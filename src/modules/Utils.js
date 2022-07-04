export const isInside = (col, row) => {
  return (col >= 0 && col < 8) && (row >= 0 && row < 8);
};

export const coords = (position) => {
  const [letter, number] = position.toLowerCase().split("");
  const col = letter.charCodeAt(0) - 97;
  const row = 8 - Number(number);

  return isInside(col, row) ? [col, row] : null;
};

export const position = (coords) => {
  const [row, col] = coords;
  const x = String.fromCharCode(97 + row);
  const y = 9 - (col + 1);
  return x + y;
};

export const toggleColorPieces = (fen) =>
  fen.split("")
    .map(e => e.match(/[a-z]/) ? e.toUpperCase() : e.match(/[A-Z]/) ? e.toLowerCase() : e).join("");
