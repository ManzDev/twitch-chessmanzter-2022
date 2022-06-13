import initialLocations from "../data/initialLocations.json";
import { Turn } from "../modules/Turn.js";
import { Movements } from "../modules/Movements.js";
import { Pieces } from "../modules/Pieces.js";
import "./ChessCell.js";

// Translate (Remove later)
import { coords } from "../modules/Utils.js";

const DEFAULT_THEME = "manzdev";

class ChessBoard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.pieces = new Pieces();
    this.movements = new Movements();
    this.turn = new Turn(this.movements);
    this.stage = 0; // 0: select, 1: move, 2: convert-piece
  }

  isSelectStage() {
    return this.stage === 0;
  }

  isTargetStage() {
    return this.stage === 1;
  }

  static get styles() {
    return /* css */`
      :host {
        --piece-size: 54px;
        --cell-size: 72px;
        --board-size: calc(var(--cell-size) * 8);
        --border-style: 0;

        user-select: none;
      }

      :host(.wood) {
        --color-odd: #eed2aa;
        --color-even: #90502f;
        --frame-color: #62351f;
      }

      :host(.manzdev) {
        --color-odd: #f566e8;
        --color-even: #7135a4;
        --frame-color: #421768;
      }

      :host(.forest) {
        --color-odd: #ebecd0;
        --color-even: #779556;
        --frame-color: #3d5226;
      }

      :host(.classic) {
        --color-odd: #e7e6e4;
        --color-even: #181713;
        --frame-color: #000000;
      }

      :host(.ocean) {
        --color-odd: #99ccff;
        --color-even: #026498;
        --frame-color: #09364e;
      }

      .frame {
        display: grid;
        grid-template-areas: "top top top"
                              "left board right"
                              "bottom bottom bottom";
        justify-content: center;
        align-items: center;
        width: calc(var(--cell-size) * 10);
        height: calc(var(--cell-size) * 10);
        background: var(--frame-color);
        font-family: Montserrat;
        color: #eee;
      }

      .row {
        display: flex;
      }

      .top { grid-area: top; }
      .bottom { grid-area: bottom; }
      .left { grid-area: left; }
      .right { grid-area: right; }
      .board { grid-area: board; }

      .fake {
        display: flex;
        justify-content: center;
        align-items: center;
        width: var(--cell-size);
        height: var(--cell-size);
        box-sizing: border-box;
      }

      .board {
        display: flex;
        flex-wrap: wrap;
        width: var(--board-size);
        height: var(--board-size);
        border: var(--border-style);

        background: conic-gradient(
          var(--color-even) 90deg,
          var(--color-odd) 90deg 180deg,
          var(--color-even) 180deg 270deg,
          var(--color-odd) 270deg
        );
        background-size: calc(var(--cell-size) * 2) calc(var(--cell-size) * 2);
      }
    `;
  }

  connectedCallback() {
    this.render();
    this.classList.add(DEFAULT_THEME);
  }

  changePieces(theme, ext = "png") {
    const cells = [...this.shadowRoot.querySelectorAll("chess-cell")];
    cells.forEach(cell => {
      const piece = cell.piece;
      piece && piece.changeTheme(theme, ext);
    });
  }

  genFakeCells(n) {
    const texts = ((n === 8) ? "87654321" : " abcdefgh ").split("");
    return texts.map(text => /* html */`<div class="fake">${text}</div>`).join("");
  }

  renderCells() {
    for (let col = 0; col < 8; col++) {
      for (let row = 0; row < 8; row++) {
        this.renderCell(row, col);
      }
    }
  }

  renderCell(row, col) {
    const board = this.shadowRoot.querySelector(".board");
    const cell = document.createElement("chess-cell");

    cell.setAttribute("col", col);
    cell.setAttribute("row", row);

    cell.addEventListener("click", () => this.onClick(cell));
    cell.addEventListener("contextmenu", (ev) => this.onRightClick(ev, cell));
    board.appendChild(cell);
  }

  highlightMoves(cells) {
    cells.forEach(move => {
      const cell = this.getCell(coords(move.position));
      cell && cell.classList.add("valid");
    });
  }

  onRightClick(ev, cell) {
    ev.preventDefault();
    if (cell.piece) { console.log(this.getAllMoves(cell, cell.piece)); }
  }

  onClick(cell) {
    const piece = cell.piece;
    const isCancel = cell.classList.contains("selected");
    const isTargetValid = cell.classList.contains("valid");

    // Select Source
    if (piece && this.isSelectStage()) this.selectPiece(cell);
    // Cancel Source
    else if (isCancel && this.isTargetStage()) this.reset();
    // Select Target
    else if (this.isTargetStage() && isTargetValid) this.selectTarget(cell);
  }

  getAllMoves(cell, piece) {
    const x = Number(cell.getAttribute("row"));
    const y = Number(cell.getAttribute("col"));

    const moves = [];

    if (piece.isPawn()) {
      const multiplier = piece.color === "white" ? -1 : 1;
      const isInitialPosition = (piece.isBlack() && y === 1) || (piece.isWhite() && y === 6);

      // Normal
      const cellForward = this.getCell([x, y + (1 * multiplier)]);
      cellForward.isEmpty() && moves.push({ position: cellForward.position, type: "normal" });

      // Initial
      const cellForwardInitial = this.getCell([x, y + (2 * multiplier)]);
      if (cellForward.isEmpty() && cellForwardInitial.isEmpty() && isInitialPosition) {
        moves.push({ position: cellForwardInitial.position, type: "initial" });
      }

      // Attacks
      const cellLeft = this.getCell([x - 1, y + (1 * multiplier)]);
      const cellRight = this.getCell([x + 1, y + (1 * multiplier)]);
      const isAttackLeft = cellLeft && this.hasOpponentPiece(cellLeft, piece);
      const isAttackRight = cellRight && this.hasOpponentPiece(cellRight, piece);
      isAttackLeft && moves.push({ position: cellLeft.position, type: "attack" });
      isAttackRight && moves.push({ position: cellRight.position, type: "attack" });
    }

    if (piece.isBishop() || piece.isRook() || piece.isQueen()) {
      piece.directions.forEach(direction => {
        const [deltaX, deltaY] = direction;

        let nextX = x + deltaX;
        let nextY = y + deltaY;
        let nextCell = this.getCell([nextX, nextY]);

        while (nextCell && nextCell.isEmpty()) {
          moves.push({ position: nextCell.position, type: "normal" });

          nextX += deltaX;
          nextY += deltaY;
          nextCell = this.getCell([nextX, nextY]);
        }

        if (nextCell && this.hasOpponentPiece(nextCell, piece)) {
          moves.push({ position: nextCell.position, type: "attack" });
        }
      });
    }

    if (piece.isKnight()) {
      piece.directions.forEach(direction => {
        const [deltaX, deltaY] = direction;

        const nextX = x + deltaX;
        const nextY = y + deltaY;
        const nextCell = this.getCell([nextX, nextY]);

        if (nextCell && this.hasOpponentPiece(nextCell, piece)) {
          moves.push({ position: nextCell.position, type: "attack" });
        } else if (nextCell && nextCell.isEmpty()) {
          moves.push({ position: nextCell.position, type: "normal" });
        }
      });
    }

    if (piece.isKing()) {
      piece.directions.forEach(direction => {
        const [deltaX, deltaY] = direction;

        const nextX = x + deltaX;
        const nextY = y + deltaY;

        const nextCell = this.getCell([nextX, nextY]);

        if (nextCell && this.hasOpponentPiece(nextCell, piece)) {
          moves.push({ position: nextCell.position, type: "attack" });
        } else if (nextCell && nextCell.isEmpty()) {
          moves.push({ position: nextCell.position, type: "normal" });
        }
      });
    }

    return moves;
  }

  getCell(coords) {
    const [row, col] = coords;
    return this.shadowRoot.querySelector(`[row="${row}"][col="${col}"]`);
  }

  selectPiece(cell) {
    const sourcePiece = cell.piece;
    const isValidPiece = String(this.turn) === sourcePiece.color;

    if (isValidPiece) {
      cell.select();
      this.stage = 1;
      const moves = this.getAllMoves(cell, sourcePiece);
      this.highlightMoves(moves);
    }
  }

  reset() {
    const cells = [...this.shadowRoot.querySelectorAll("chess-cell")];
    cells.forEach(cell => cell.classList.remove("selected", "valid"));
    this.stage = 0;
  }

  selectTarget(targetCell) {
    const sourceCell = this.shadowRoot.querySelector("chess-cell.selected");
    const sourcePiece = sourceCell.piece;

    this.moveTo(sourcePiece, targetCell);
  }

  isInside(x, y) {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
  }

  hasOpponentPiece(cell, sourcePiece) {
    return cell.piece && cell.piece.isOpponentOf(sourcePiece);
  }

  moveTo(sourcePiece, targetCell) {
    const sourceCell = this.shadowRoot.querySelector("chess-cell.selected");
    targetCell.shadowRoot.appendChild(sourcePiece);
    this.movements.add(sourcePiece, sourceCell, targetCell);
    this.reset();
  }

  at(coords) {
    return this.getCell(coords).shadowRoot;
  }

  addPiece(type, coords) {
    const cell = this.at(coords);
    const piece = document.createElement("chess-piece");
    piece.setAttribute("type", type);
    cell.appendChild(piece);

    this.pieces.push(piece);
  }

  preparePieces() {
    initialLocations.forEach(([piece, coords]) => this.addPiece(piece, coords));
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${ChessBoard.styles}</style>
    <div class="frame">
      <div class="row top">
        ${this.genFakeCells(10)}
      </div>
      <div class="col left">
        ${this.genFakeCells(8)}
      </div>
      <div class="board">
      </div>
      <div class="col right">
        ${this.genFakeCells(8)}
      </div>
      <div class="row bottom">
        ${this.genFakeCells(10)}
      </div>
    </div>`;
    this.renderCells();
  }
}

customElements.define("chess-board", ChessBoard);
