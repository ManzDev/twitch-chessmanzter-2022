export class Turn {
  constructor(movements) {
    this.movements = movements;
    this.offset = 0;
  }

  set(turn) {
    this.offset = turn.toLowerCase()[0] === "w" ? 0 : 1;
  }

  isWhite() {
    return ((this.movements.length % 2) + this.offset) === 0;
  }

  isBlack() {
    return ((this.movements.length % 2) + this.offset) !== 0;
  }

  toString() {
    return this.isWhite() ? "white" : "black";
  }
}
