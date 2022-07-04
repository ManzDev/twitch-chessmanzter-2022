import * as dat from "dat.gui";
import "./components/ChessBoard.js";

const board = document.createElement("chess-board");
// board.setFromFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w");
board.setFromFEN("rnbqkbnr/ppp2ppp/8/3pp3/3PP3/8/PPP2PPP/RNBQKBNR w");
// board.setFromFEN("r1bq1bnr/ppp1kppp/2n5/3pp3/2BPPB2/7N/PPP2PPP/RN1QK2R b");

const gui = new dat.GUI();

const options = {
  pieces: "pixel",
  theme: "manzdev"
};

gui.add(options, "pieces", ["pixel", "normal"])
  .onChange(data => board.changePieces(data));

gui.add(options, "theme", ["wood", "manzdev", "forest", "classic", "ocean"])
  .onChange(data => {
    const chessboard = document.querySelector("chess-board");
    chessboard.classList.remove("wood", "manzdev", "forest", "classic", "ocean");
    chessboard.classList.add(data);
  });

gui.close();

// const vb = new VirtualBoard("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w");
