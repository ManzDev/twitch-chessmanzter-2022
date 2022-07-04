import { isWhite, isBlack, areOpponentPieces, isPawn, isBishop, isRook, isQueen, getRules, isKnight, isKing } from "./Movements.js";
import { position, toggleColorPieces } from "./Utils.js";

const debug = (table) => console.table(JSON.parse(JSON.stringify(table)));

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
    // debug(this.board);
  }

  getCell(coords) {
    const [x, y] = coords;
    if ((x < 0) || (y < 0) || (x > 7) || (y > 7)) return;
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

  selectPiece(sourceCoords) {
    const [col, row] = sourceCoords;
    const sourcePiece = this.getCell(sourceCoords);
    const moves = [];

    console.log({ name: "CUAK", row, col, sourcePiece });

    if (isPawn(sourcePiece)) {
      const [col, row] = sourceCoords;

      const multiplier = isWhite(sourcePiece) ? -1 : 1;
      const isInitialPosition =
        (isBlack(sourcePiece) && row === 1) ||
        (isWhite(sourcePiece) && row === 6);

      // Normal
      const normalCoords = [col, row + (1 * multiplier)];
      const cellForward = this.getCell(normalCoords);
      cellForward === null && moves.push({ position: position(normalCoords), type: "normal" });

      // Initial (Special movement)
      const initialCoords = [col, row + (2 * multiplier)];
      const cellForwardInitial = this.getCell(initialCoords);
      if (cellForward === null && !cellForwardInitial && isInitialPosition) {
        moves.push({ position: position(initialCoords), type: "initial" });
      }

      // Attacks
      const leftCoords = [col - 1, row + (1 * multiplier)];
      const rightCoords = [col + 1, row + (1 * multiplier)];
      const cellLeft = this.getCell(leftCoords);
      const cellRight = this.getCell(rightCoords);
      const isAttackLeft = cellLeft && areOpponentPieces(sourcePiece, cellLeft);
      const isAttackRight = cellRight && areOpponentPieces(sourcePiece, cellRight);
      isAttackLeft && moves.push({ position: position(leftCoords), type: "attack" });
      isAttackRight && moves.push({ position: position(rightCoords), type: "attack" });
    }

    if (isBishop(sourcePiece) || isRook(sourcePiece) || isQueen(sourcePiece)) {
      const directions = getRules(sourcePiece);

      directions.forEach(direction => {
        const [deltaX, deltaY] = direction;

        let nextX = col + deltaX;
        let nextY = row + deltaY;
        let nextCell = this.getCell([nextX, nextY]);

        while (nextCell === null) {
          moves.push({ position: position([nextX, nextY]), type: "normal" });

          nextX += deltaX;
          nextY += deltaY;
          nextCell = this.getCell([nextX, nextY]);
        }

        if (nextCell && areOpponentPieces(nextCell, sourcePiece)) {
          moves.push({ position: position([nextX, nextY]), type: "attack" });
        }
      });
    }

    if (isKnight(sourcePiece)) {
      const directions = getRules(sourcePiece);

      directions.forEach(direction => {
        const [deltaX, deltaY] = direction;

        const nextX = col + deltaX;
        const nextY = row + deltaY;
        const nextCell = this.getCell([nextX, nextY]);

        if (nextCell && areOpponentPieces(nextCell, sourcePiece)) {
          moves.push({ position: position([nextX, nextY]), type: "attack" });
        } else if (nextCell === null) {
          moves.push({ position: position([nextX, nextY]), type: "normal" });
        }
      });
    }

    if (isKing(sourcePiece)) {
      const directions = getRules(sourcePiece);

      directions.forEach(direction => {
        const [deltaX, deltaY] = direction;

        const nextX = col + deltaX;
        const nextY = row + deltaY;

        const nextCell = this.getCell([nextX, nextY]);

        if (nextCell && areOpponentPieces(nextCell, sourcePiece)) {
          moves.push({ position: position([nextX, nextY]), type: "attack" });
        } else if (nextCell === null) {
          moves.push({ position: position([nextX, nextY]), type: "normal" });
        }
      });
    }

    return moves;
  }

  getPiecesByColor(color = "white") {
    const regex = color === "white" ? /^[a-z]$/ : /^[A-Z]$/;
    const pieces = [];

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = this.board[j][i];
        const isPiece = regex.test(piece);
        // console.log({ piece, isPiece });
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
