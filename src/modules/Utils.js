export const coords = (position) => {
  const [letter, number] = position.toLowerCase().split("");
  const col = letter.charCodeAt(0) - 97;
  const row = 8 - Number(number);

  const isInside = (col >= 0 && col < 8) && (row >= 0 && row < 8);
  return isInside ? [col, row] : null;
};
