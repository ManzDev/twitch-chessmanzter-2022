import "./ChessPiece.js";

class ChessCell extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get styles() {
    return /* css */`
      .cell {
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

  get id() {
    return this.x + this.y;
  }

  select() {
    this.classList.add("selected");
  }

  unselect() {
    this.classList.remove("selected");
  }

  connectedCallback() {
    this.x = this.getAttribute("x");
    this.y = this.getAttribute("y");
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${ChessCell.styles}</style>
    <div class="cell">
    </div>`;
  }
}

customElements.define("chess-cell", ChessCell);
