import initialLocations from "../data/initialLocations.json";
import "./ChessCell.js";

class ChessBoard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.PIECES = [];
    this.movements = [];
    this.stage = 0; // 0: select, 1: move, 2: convert-piece
  }

  isWhiteTurn() {
    return this.movements.length % 2 === 0;
  }

  isBlackTurn() {
    return this.movements.length % 2 !== 0;
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
    this.classList.add("manzdev");
  }

  changePieces(theme, ext = "png") {
    const cells = [...this.shadowRoot.querySelectorAll("chess-cell")];
    cells.forEach(cell => {
      const piece = cell.shadowRoot.querySelector("chess-piece");
      piece && piece.changeTheme(theme, ext);
    });
  }

  renderCells() {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        this.renderCell(y, x);
      }
    }
  }

  renderCell(y, x) {
    const board = this.shadowRoot.querySelector(".board");
    const col = String.fromCharCode(97 + x);
    const row = 9 - (y + 1);
    const cell = document.createElement("chess-cell");
    cell.setAttribute("x", col);
    cell.setAttribute("y", row);

    const [a, b] = this.getCellCoords(col + row);
    cell.setAttribute("row", a);
    cell.setAttribute("col", b);

    cell.addEventListener("click", () => this.onClick(cell));
    cell.addEventListener("contextmenu", (ev) => this.onRightClick(ev, cell));
    board.appendChild(cell);
  }

  hightlightMoves(cells) {
    cells.forEach(move => {
      const cell = this.getCellComponent(move.position);
      cell && cell.classList.add("valid");
    });
  }

  onRightClick(ev, cell) {
    const isCtrlPressed = ev.ctrlKey;
    if (isCtrlPressed) {
      ev.preventDefault();
      cell.classList.add("valid");
    }

    if (!isCtrlPressed) {
      ev.preventDefault();
      const piece = cell.shadowRoot.querySelector("chess-piece");
      if (!piece) return null;
      console.log(this.getAllMoves(cell, piece));
    }
  }

  onClick(cell) {
    const piece = cell.shadowRoot.querySelector("chess-piece");
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
    const pieceType = piece.id;
    const [x, y] = [Number(cell.getAttribute("row")), Number(cell.getAttribute("col"))];

    const moves = [];

    // Pawn
    if (pieceType.toLowerCase() === "p") {
      const multiplier = piece.color === "white" ? -1 : 1;
      const isInitialPosition = (piece.isBlack() && y === 1) || (piece.isWhite() && y === 6);

      // Normal
      const posForward = this.getCellPosition([x, y + (1 * multiplier)]);
      this.isEmpty(posForward) && moves.push({ position: posForward, type: "normal" });

      // Initial
      const posForwardInitial = this.getCellPosition([x, y + (2 * multiplier)]);
      if (this.isEmpty(posForward) && this.isEmpty(posForwardInitial) && isInitialPosition) {
        moves.push({ position: posForwardInitial, type: "initial" });
      }

      // Attacks
      const posLeft = this.getCellPosition([x - 1, y + (1 * multiplier)]);
      const posRight = this.getCellPosition([x + 1, y + (1 * multiplier)]);
      const cellLeft = this.getCellComponent(posLeft);
      const cellRight = this.getCellComponent(posRight);
      const isAttackLeft = cellLeft && this.hasOpponentPiece(cellLeft, piece);
      const isAttackRight = cellRight && this.hasOpponentPiece(cellRight, piece);
      isAttackLeft && moves.push({ position: posLeft, type: "attack" });
      isAttackRight && moves.push({ position: posRight, type: "attack" });
    }

    // Bishop
    if (pieceType.toLowerCase() === "b") {
      const directions = [
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1]
      ];
      directions.forEach(direction => {
        const [deltaX, deltaY] = direction;

        let nextX = x + deltaX;
        let nextY = y + deltaY;

        if (this.isInside(nextX, nextY)) {
          let nextCellPosition = this.getCellPosition([nextX, nextY]);
          console.log({ nextX, nextY, nextCellPosition });
          let nextCell = this.getCellComponent(nextCellPosition);

          while (nextCell && this.isInside(nextX, nextY) && this.isEmpty(nextCellPosition)) {
            moves.push({ position: nextCellPosition, type: "normal" });

            nextX += deltaX;
            nextY += deltaY;

            nextCellPosition = this.getCellPosition([nextX, nextY]);
            nextCell = this.getCellComponent(nextCellPosition);
          }

          if (nextCell && this.hasOpponentPiece(nextCell, piece)) {
            moves.push({ position: nextCellPosition, type: "attack" });
          }
        }
      });
    }

    // Knight
    if (pieceType.toLowerCase() === "n") {
      const directions = [
        [-2, -1],
        [-1, -2],
        [1, -2],
        [2, -1],
        [2, 1],
        [1, 2],
        [-1, 2],
        [-2, 1]
      ];
      directions.forEach(direction => {
        const [deltaX, deltaY] = direction;

        const nextX = x + deltaX;
        const nextY = y + deltaY;

        if (this.isInside(nextX, nextY)) {
          const nextCellPosition = this.getCellPosition([nextX, nextY]);
          const nextCell = this.getCellComponent(nextCellPosition);

          if (nextCell && this.hasOpponentPiece(nextCell, piece)) {
            moves.push({ position: nextCellPosition, type: "attack" });
          } else if (nextCell && this.isEmpty(nextCellPosition)) {
            moves.push({ position: nextCellPosition, type: "normal" });
          }
        }
      });
    }

    // Rook
    if (pieceType.toLowerCase() === "r") {
      const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
      ];
      directions.forEach(direction => {
        const [deltaX, deltaY] = direction;

        let nextX = x + deltaX;
        let nextY = y + deltaY;

        if (this.isInside(nextX, nextY)) {
          let nextCellPosition = this.getCellPosition([nextX, nextY]);
          let nextCell = this.getCellComponent(nextCellPosition);

          while (nextCell && this.isInside(nextX, nextY) && this.isEmpty(nextCellPosition)) {
            moves.push({ position: nextCellPosition, type: "normal" });

            nextX += deltaX;
            nextY += deltaY;

            nextCellPosition = this.getCellPosition([nextX, nextY]);
            nextCell = this.getCellComponent(nextCellPosition);
          }

          if (nextCell && this.hasOpponentPiece(nextCell, piece)) {
            moves.push({ position: nextCellPosition, type: "attack" });
          }
        }
      });
    }

    // Queen
    if (pieceType.toLowerCase() === "q") {
      const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1]
      ];
      directions.forEach(direction => {
        const [deltaX, deltaY] = direction;

        let nextX = x + deltaX;
        let nextY = y + deltaY;

        if (this.isInside(nextX, nextY)) {
          let nextCellPosition = this.getCellPosition([nextX, nextY]);
          let nextCell = this.getCellComponent(nextCellPosition);

          while (nextCell && this.isInside(nextX, nextY) && this.isEmpty(nextCellPosition)) {
            moves.push({ position: nextCellPosition, type: "normal" });

            nextX += deltaX;
            nextY += deltaY;

            nextCellPosition = this.getCellPosition([nextX, nextY]);
            nextCell = this.getCellComponent(nextCellPosition);
          }

          if (nextCell && this.hasOpponentPiece(nextCell, piece)) {
            moves.push({ position: nextCellPosition, type: "attack" });
          }
        }
      });
    }

    // King
    if (pieceType.toLowerCase() === "k") {
      const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1]
      ];
      directions.forEach(direction => {
        const [deltaX, deltaY] = direction;

        const nextX = x + deltaX;
        const nextY = y + deltaY;

        if (this.isInside(nextX, nextY)) {
          const nextCellPosition = this.getCellPosition([nextX, nextY]);
          const nextCell = this.getCellComponent(nextCellPosition);

          if (nextCell && this.hasOpponentPiece(nextCell, piece)) {
            moves.push({ position: nextCellPosition, type: "attack" });
          } else if (nextCell && this.isEmpty(nextCellPosition)) {
            moves.push({ position: nextCellPosition, type: "normal" });
          }
        }
      });
    }

    return moves;
  }

  getCellCoords(position) {
    const x = position.charCodeAt(0) - 97;
    const y = 8 - (Number(position[1]));
    return [x, y];
  }

  getCellPosition(coords) {
    if (!this.isInside(...coords)) return null;

    const [x, y] = coords;
    const col = String.fromCharCode(97 + x);
    const row = 9 - (y + 1);
    return `${col}${row}`;
  }

  getCellComponent(position) {
    if (!position) return null;

    const [x, y] = position.split("");
    const cell = this.shadowRoot.querySelector(`chess-cell[x="${x}"][y="${y}"]`);
    return cell;
  }

  selectPiece(cell) {
    const sourcePiece = cell.shadowRoot.querySelector("chess-piece");
    const isCorrectWhitePiece = this.isWhiteTurn() && sourcePiece.isWhite();
    const isCorrectBlackPiece = this.isBlackTurn() && sourcePiece.isBlack();

    const isValidPiece = isCorrectWhitePiece || isCorrectBlackPiece;
    if (isValidPiece) {
      cell.select();
      this.stage = 1;
      const moves = this.getAllMoves(cell, sourcePiece);
      this.hightlightMoves(moves);
    }
  }

  reset() {
    const cells = [...this.shadowRoot.querySelectorAll("chess-cell")];
    cells.forEach(cell => cell.classList.remove("selected", "valid"));
    this.stage = 0;
  }

  selectTarget(cell) {
    this.moveTo(cell);
  }

  genFakeCells(n) {
    const texts = ((n === 8) ? "87654321" : " abcdefgh ").split("");
    return texts.map(text => /* html */`<div class="fake">${text}</div>`).join("");
  }

  addPiece(letter, position) {
    const x = position[0];
    const y = position[1];
    const cell = this.getCell(x, y);

    const piece = document.createElement("chess-piece");
    piece.setAttribute("type", letter);
    cell.appendChild(piece);

    this.PIECES.push(piece);
  }

  isInside(x, y) {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
  }

  // chess-cell
  at(position) {
    const x = position[0];
    const y = position[1];
    return this.getCell(x, y);
  }

  isEmpty(position) {
    const cell = this.at(position);
    const piece = cell.querySelector("chess-piece");
    return !piece;
  }

  hasOpponentPiece(cell, sourcePiece) {
    const piece = cell.shadowRoot.querySelector("chess-piece");
    return piece && this.isOpponentPiece(piece, sourcePiece);
  }

  isOpponentPiece(piece, sourcePiece) {
    return piece.color !== sourcePiece.color;
  }

  moveTo(targetCell) {
    const sourceCell = this.shadowRoot.querySelector("chess-cell.selected");
    const sourcePiece = sourceCell.shadowRoot.querySelector("chess-piece");

    targetCell.shadowRoot.querySelector(".cell").appendChild(sourcePiece);
    // sourcePiece.incMovements();
    this.addMovement(sourcePiece, sourceCell, targetCell);
    this.reset();
  }

  addMovement(piece, sourceCell, targetCell) {
    this.movements.push(piece.id + sourceCell.id + targetCell.id);
  }

  getHistoryMovements(piece) {
    return this.movements.filter(movement => movement.startsWith(piece));
  }

  getCell(x, y) {
    return this.shadowRoot.querySelector(`[x="${x}"][y="${y}"]`).shadowRoot.querySelector(".cell");
  }

  getPiece(position) {
    const isEmpty = this.isEmpty(position);
    if (!isEmpty) {
      const cell = this.at(position);
      return cell.querySelector("chess-piece");
    }
  }

  preparePieces() {
    initialLocations.forEach(([piece, position]) => {
      this.addPiece(piece, position);
    });
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
