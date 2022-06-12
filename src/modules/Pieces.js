export class Pieces {
  constructor() {
    this.numPieces = 0;
    this.pieces = {};
  }

  push(piece) {
    this.numPieces++;
    let number = 0;
    while (this.has(piece.type + number)) {
      number++;
    }

    piece.id = piece.type + number;
    this.pieces[piece.id] = piece;
  }

  get(id) {
    return this.pieces[id];
  }

  has(id) {
    return Object.keys(this.pieces).includes(id);
  }
}
