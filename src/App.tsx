import React, { useEffect, useState } from "react";
import Chessground from "@react-chess/chessground";
import "./App.css";
import { ChessInstance, ShortMove } from "chess.js";
import { Key, Role, Dests, Color, colors } from "chessground/types";
const Chess = require("chess.js");
declare let window: any;
function App() {
  const [chess] = useState<ChessInstance>(
    new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  );

  const [fen, setFen] = useState(chess.fen());
  const [selectedChesspiece, setSelectedChesspiece] = useState<any>();
  useEffect(() => {
    console.log(fen);
  }, [fen]);
  const handleMove = (move: ShortMove) => {
    if (chess.move(move)) {
      // setTimeout(() => {
      //   const moves = chess.moves();
      //   if (moves.length > 0) {
      //     const computerMove = moves[Math.floor(Math.random() * moves.length)];
      //     chess.move(computerMove);
      //     setFen(chess.fen());
      //   }
      // }, 300);
    }
    setFen(chess.fen());
  };
  const calcMovable = () => {
    const dests = new Map();
    chess.SQUARES.forEach((s) => {
      const ms = chess.moves({ square: s, verbose: true });
      if (ms.length)
        dests.set(
          s,
          ms.map((m) => m.to)
        );
    });
    console.log("movable: ", {
      free: false,
      dests: dests,
      showDests: true,
      events: {
        after: (from: any, to: any, metadeta: any) => {
          return handleMove({ from: from, to: to, promotion: "q" });
        },
      },
    });
    return {
      free: false,
      dests,
      showDests: true,
      events: {
        after: (from: any, to: any, metadeta: any) => {
          // console.log("MOVABLE: ", metadeta);
          return handleMove({ from: from, to: to, promotion: "q" });
        },
      },
    };
  };

  let config = {
    coordinates: true,
    turnColor: colors[0],
    addPieceZIndex: true,
    selectable: {
      enabled: true,
    },
    movable: calcMovable(),
    events: {
      select: (key: Key) => {
        setSelectedChesspiece(key);
        // console.log(new Map(key, chess.moves({square: key})));
      },
    },
  };
  return (
    <div className="App" id="chessboard">
      <div className="main">
        <Chessground config={{ fen: fen, ...config }} />
      </div>
    </div>
  );
}

export default App;
