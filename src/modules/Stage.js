// STAGE 0 - SELECT PIECE
// STAGE 1 - SELECT TARGET
// STAGE 2 - WAITING (BEFORE ANIMATION)
// STAGE 3 - WAITING (AFTER ANIMATION)

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

  isWaitingBefore() {
    return this.stage === 2;
  }

  isWaitingAfter() {
    return this.stage === 3;
  }

  reset() {
    this.stage = 0;
  }

  next() {
    if (this.stage === 0) {
      this.stage = 1;
    } else if (this.stage === 1) {
      this.stage = 2;
    } else if (this.stage === 2) {
      this.stage = 3;
    } else if (this.stage === 3) {
      this.stage = 0;
    }
  }
}
