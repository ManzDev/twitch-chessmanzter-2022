// STAGE 0 - SELECT PIECE
// STAGE 1 - SELECT TARGET

export class Stage {
  constructor() {
    this.stage = 0;
  }

  isSelect() {
    return this.stage === 0;
  }

  isTarget() {
    return this.stage === 1;
  }

  isWaiting() {
    return this.stage === 2;
  }

  next() {
    if (this.stage === 0) {
      this.stage = 1;
    } else if (this.stage === 1) {
      this.stage = 0;
    }
  }
}
