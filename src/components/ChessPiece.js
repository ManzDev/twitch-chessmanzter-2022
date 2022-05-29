const PIECES = {
  K: "king",
  Q: "queen",
  R: "rook",
  B: "bishop",
  N: "knight",
  P: "pawn",
};

const MAYUS_PIECES = Object.keys(PIECES);

class ChessPiece extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get styles() {
    return /* css */`
      :host {

      }

      .piece img {
        image-rendering: pixelated;
        transform: scale(3);
        filter: drop-shadow(0 0 1px #0006);
      }
    `;
  }

  connectedCallback() {
    this.type = this.getAttribute("type");
    this.color = MAYUS_PIECES.includes(this.type) ? "black" : "white";
    this.render();
  }

  render() {
    const piece = PIECES[this.type.toUpperCase()];
    this.shadowRoot.innerHTML = /* html */`
    <style>${ChessPiece.styles}</style>
    <div class="piece">
      <img src="pieces/${this.color}-${piece}.png" alt="${this.color} ${piece}" />
    </div>`;
  }
}

customElements.define("chess-piece", ChessPiece);
