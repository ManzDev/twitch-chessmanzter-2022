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
        background: red;
      }

      :host(.valid) {
        background: green;
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
