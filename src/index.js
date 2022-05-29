import * as dat from "dat.gui";
import "./components/ChessBoard.js";

const board = document.querySelector("chess-board");
board.preparePieces();

const gui = new dat.GUI();

const options = {
  pieces: "pixel",
  theme: "wood"
};

gui.add(options, "pieces", ["pixel", "normal"])
  .onChange(data => {
    const ext = data === "pixel" ? ".png" : ".svg";
    board.changePieces(data, ext);
  });

// { K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙", k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" };
