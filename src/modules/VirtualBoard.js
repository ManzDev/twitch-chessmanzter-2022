import { toggleColorPieces } from "./Utils.js";

const debug = (table) => {
  console.table(JSON.parse(JSON.stringify(table)));
};

export class VirtualBoard {
  constructor(fen) {
    this.board = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => null));
    this.pieces = {};
    this.turn = null;

    this.setFromFEN(fen);
  }

  setFromFEN(fen) {
    const [state, turn] = toggleColorPieces(fen).split(" ");
    const rows = state.replaceAll("/", "").split("");
    let pos = 0;

    rows.forEach((item) => {
      const num = parseInt(item);
      const isEmpty = !Number.isNaN(num);

      if (!isEmpty) {
        const [x, y] = [pos % 8, ~~(pos / 8)];
        this.addPiece(y, x, item);
      }

      pos += isEmpty ? num : 1;
    });

    this.turn = turn;
  }

  movePiece(source, target) {
    const [sY, sX] = source;
    const [tY, tX] = target;

    this.board[tX][tY] = this.board[sX][sY];
    this.board[sX][sY] = null;
    debug(this.board);
  }

  getCell(coords) {
    const [x, y] = coords;
    return this.board[y][x];
  }

  addPiece(x, y, item) {
    this.board[x][y] = item;
  }

  findPiece(id) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const isPiece = this.board[j][i] === id;
        if (isPiece) {
          return [j, i];
        }
      }
    }
    return null;
  }

  getPiecesByColor(color = "white") {
    const regex = color === "white" ? /^[a-z]$/ : /^[A-Z]$/;
    const pieces = [];

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = this.board[j][i];
        const isPiece = regex.test(piece);
        console.log({ piece, isPiece });
        if (isPiece) {
          pieces.push([j, i]); // DANGER COORDS
        }
      }
    }
    return pieces;
  }

  isInCheck(color = "white") {
    const king = color === "white" ? "k" : "K";

    return this.findPiece(king);
  }
}
