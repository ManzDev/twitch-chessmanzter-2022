import PIECES from "../data/pieces.json";

class ChessPiece extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get styles() {
    return /* css */`
      .piece img {
        image-rendering: pixelated;
        transform: scale(3);
        filter: drop-shadow(0 0 1px #0006);
      }
    `;
  }

  connectedCallback() {
    this.type = this.getAttribute("type");
    this.color = Object.keys(PIECES).includes(this.type) ? "black" : "white";
    this.render();
  }

  isWhite() {
    return this.color === "white";
  }

  isBlack() {
    return this.color === "black";
  }

  isPawn() {
    return this.type.toLowerCase() === "p";
  }

  isRook() {
    return this.type.toLowerCase() === "r";
  }

  isKing() {
    return this.type.toLowerCase() === "k";
  }

  isBishop() {
    return this.type.toLowerCase() === "b";
  }

  isKnight() {
    return this.type.toLowerCase() === "n";
  }

  isQueen() {
    return this.type.toLowerCase() === "q";
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
