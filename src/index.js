import * as dat from "dat.gui";
import "./components/ChessBoard.js";

const board = document.querySelector("chess-board");
board.preparePieces();

const gui = new dat.GUI();

const options = {
  pieces: "pixel",
  theme: "manzdev"
};

gui.add(options, "pieces", ["pixel", "normal"])
  .onChange(data => board.changePieces(data));

gui.add(options, "theme", ["wood", "manzdev", "forest", "classic", "ocean"])
  .onChange(data => {
    board.classList.remove("wood", "manzdev", "forest", "classic", "ocean");
    board.classList.add(data);
  });

gui.close();
