import "./ChessPiece.js";

class ChessCell extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get styles() {
    return /* css */`
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        border: var(--border-style);
        width: var(--cell-size);
        height: var(--cell-size);
        box-sizing: border-box;
      }

      :host(.selected) {
        background: var(--selected-cell-color);
      }

      :host(.valid) {
        background: var(--valid-cell-color);
      }

      .halo {
        display: block;
        width: 50px;
        height: 60px;
        background: linear-gradient(to top, gold, transparent);
        filter: drop-shadow(0 0 5px gold) blur(2px);
        position: absolute;
        transform-origin: 50% 100%;
        transform: translateX(50%) scaleY(8);
        opacity: 0;
        transition: opacity 0.5s;
      }

      .halo.appears {
        opacity: 1;
      }
    `;
  }

  get position() {
    const [row, col] = this.coords;
    const x = String.fromCharCode(97 + row);
    const y = 9 - (col + 1);
    return x + y;
  }

  get coords() {
    const row = Number(this.getAttribute("row"));
    const col = Number(this.getAttribute("col"));
    return [row, col];
  }

  get piece() {
    return this.shadowRoot.querySelector("chess-piece");
  }

  isEmpty() {
    return !this.piece;
  }

  createHalo() {
    const halo = document.createElement("div");
    halo.classList.add("halo");
    this.piece.insertAdjacentElement("afterend", halo);
    return halo;
  }

  select() {
    this.classList.add("selected");
  }

  unselect() {
    this.classList.remove("selected");
  }

  connectedCallback() {
    // this.x = this.getAttribute("x");
    // this.y = this.getAttribute("y");
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${ChessCell.styles}</style>
    `;
  }
}

customElements.define("chess-cell", ChessCell);
