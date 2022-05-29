import initialLocations from "../data/initialLocations.json";
import "./ChessCell.js";

class ChessBoard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get styles() {
    return /* css */`
      :host {
        --piece-size: 54px;
        --cell-size: 72px;
        --board-size: calc(var(--cell-size) * 8);

        --color-odd: #eed2aa;
        --color-even: #90502f;
        --frame-color: #62351f;
        --border-style: 0;
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
  }

  changePieces(theme, ext = "png") {
    const cells = [...this.shadowRoot.querySelectorAll("chess-cell")];
    cells.forEach(cell => {
      const piece = cell.shadowRoot.querySelector("chess-piece");
      piece && piece.changeTheme(theme, ext);
    });
  }

  renderCells() {
    const cells = [];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        cells.push(this.renderCell(y, x));
      }
    }
    return cells.join("");
  }

  renderCell(y, x) {
    const col = String.fromCharCode(97 + x);
    const row = 9 - (y + 1);
    return /* html */`
      <chess-cell x="${col}" y="${row}"></chess-cell>`;
  }

  genFakeCells(n) {
    const texts = ((n === 8) ? "87654321" : " abcdefgh ").split("");
    return texts.map(text => /* html */`<div class="fake">${text}</div>`).join("");
  }

  addPiece(letter, position) {
    const x = position[0];
    const y = position[1];
    this.getCell(x, y).innerHTML = /* html */`<chess-piece type="${letter}"></chess-piece>`;
  }

  // board.movePiece("a2", "a3", "a4")
  movePiece(from, to) {
  }

  getCell(x, y) {
    return this.shadowRoot.querySelector(`[x="${x}"][y="${y}"]`).shadowRoot.querySelector(".cell");
  }

  preparePieces() {
    initialLocations.forEach(([piece, position]) => this.addPiece(piece, position));
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
        ${this.renderCells()}
      </div>
      <div class="col right">
        ${this.genFakeCells(8)}
      </div>
      <div class="row bottom">
        ${this.genFakeCells(10)}
      </div>
    </div>`;
  }
}

customElements.define("chess-board", ChessBoard);
