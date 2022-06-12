export class Movements {
  constructor() {
    this.movements = [];
  }

  get length() {
    return this.movements.length;
  }

  add(piece, sourceCell, targetCell) {
    this.movements.push(piece.id + sourceCell.id + targetCell.id);
  }

  getAll() {
    return this.movements;
  }

  of(piece) {
    return this.movements.filter(movement => movement.startsWith(piece));
  }
}
