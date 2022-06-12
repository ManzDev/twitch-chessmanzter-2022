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

  get id() {
    return this.type;
  }

  isWhite() {
    return this.color === "white";
  }

  isBlack() {
    return this.color === "black";
  }

  getRules() {
  }

  changeTheme(theme = "pixel", ext = ".png") {
    const piece = PIECES[this.type.toUpperCase()];
    const img = this.shadowRoot.querySelector(".piece img");
    img.src = `pieces/${theme}/${this.color}-${piece}${ext}`;
  }

  render() {
    const piece = PIECES[this.type.toUpperCase()] + ".png";
    this.shadowRoot.innerHTML = /* html */`
    <style>${ChessPiece.styles}</style>
    <div class="piece">
      <img src="pieces/pixel/${this.color}-${piece}" alt="${this.color} ${piece}" />
    </div>`;
  }
}

customElements.define("chess-piece", ChessPiece);
