export class Turn {
  constructor(movements) {
    this.movements = movements;
  }

  isWhite() {
    return this.movements.length % 2 === 0;
  }

  isBlack() {
    return this.movements.length % 2 !== 0;
  }

  toString() {
    return this.isWhite() ? "white" : "black";
  }
}
