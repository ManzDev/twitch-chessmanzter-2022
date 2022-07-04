import rules from "../data/rules.json";

export const areOpponentPieces = (piece, opponent) => {
  const pieceColor = /^[a-z]$/.test(piece) ? "white" : "black";
  const opponentColor = /^[a-z]$/.test(opponent) ? "white" : "black";
  return pieceColor !== opponentColor;
};

export const isPawn = (piece) => piece === "p" || piece === "P";
export const isRook = (piece) => piece === "r" || piece === "R";
export const isKnight = (piece) => piece === "n" || piece === "N";
export const isBishop = (piece) => piece === "b" || piece === "B";
export const isQueen = (piece) => piece === "q" || piece === "Q";
export const isKing = (piece) => piece === "k" || piece === "K";

export const isWhite = (piece) => ["p", "r", "n", "b", "q", "k"].includes(piece);
export const isBlack = (piece) => ["P", "R", "N", "B", "Q", "K"].includes(piece);

export const isEmpty = (piece) => piece === null;

export const getRules = (piece) => rules[piece.toLowerCase()];
