import React, { useEffect, useState } from "react";
import Chessground from "@react-chess/chessground";
import "./App.css";
import { ChessInstance, PieceType, ShortMove } from "chess.js";
import { Key, Role, Dests, Color, colors } from "chessground/types";
import queen from "./assets/images/wQ.svg";
import rook from "./assets/images/wR.svg";
import bishop from "./assets/images/wB.svg";
import knight from "./assets/images/wN.svg";
import { updateDimensions } from "./utils";
const Chess = require("chess.js");

declare let window: any;

function App() {
  const [chess] = useState<ChessInstance>(
    new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  );
  const [fen, setFen] = useState(chess.fen());
  const [pendingMove, setPendingMove] = useState<any>();
  const [promotionModal, setPromotionModal] = useState(false);
  const [lastMove, setLastMove] = useState<any>();
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  // const [selectedChesspiece, setSelectedChesspiece] = useState<any>();

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  useEffect(() => {
    console.log("pendingMove: ", pendingMove);
  }, [pendingMove]);

  const updateDimensions = () => {
    setInnerWidth(window.innerWidth);
    setInnerHeight(window.innerHeight);
  };

  const turnColor = () => (chess.turn() === "w" ? colors[0] : colors[1]);

  const handleMove = (move: ShortMove) => {
    const moves = chess.moves({ verbose: true });
    for (let i = 0, len = moves.length; i < len; i++) {
      /* eslint-disable-line */
      if (moves[i].flags.indexOf("p") !== -1 && moves[i].from === move.from) {
        setPendingMove([move.from, move.to]);
        setPromotionModal(true);
        return;
      }
    }
    if (chess.move(move)) {
      setFen(chess.fen());
      setLastMove([move.from, move.to]);
    }
  };
  const handleMoveUndo = () => {
    const lastMoveVerbose = chess.undo();
    setLastMove([lastMoveVerbose?.from, lastMoveVerbose?.to]);
    setFen(chess.fen());
  };

  const promotion = (e?: Exclude<PieceType, "p" | "k">) => {
    const from = pendingMove[0];
    const to = pendingMove[1];
    chess.move({ from, to, promotion: e });
    setFen(chess.fen());
    // setLastMove([from, to])
    setPromotionModal(false);
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

    return {
      free: false,
      dests: dests,
      showDests: true,
      events: {
        after: (from: any, to: any, metadeta: any) => {
          console.log("metadata: ", { from, to, metadeta });
          return handleMove({ from: from, to: to });
        },
      },
      rookCastle: true,
    };
  };

  let config = {
    fen: fen,
    coordinates: true,
    turnColor: turnColor(),
    addPieceZIndex: true,
    autoCastle: true,
    lastMove: lastMove,
    highlight: {
      lastMove: true,
    },
    selectable: {
      enabled: true,
    },
    movable: calcMovable(),
    events: {
      select: (key: Key) => {
        // setSelectedChesspiece(key);
        // console.log(new Map(key, chess.moves({square: key})));
      },
    },
  };
  return (
    <div className="App" id="chessboard">
      {promotionModal && (
        <div style={{ textAlign: "center" }}>
          Promote To?
          <div style={{ textAlign: "center", cursor: "pointer" }}>
            <span role="presentation" onClick={() => promotion("q")}>
              <img src={queen} alt="" style={{ width: 50 }} />
            </span>
            <span role="presentation" onClick={() => promotion("r")}>
              <img src={rook} alt="" style={{ width: 50 }} />
            </span>
            <span role="presentation" onClick={() => promotion("b")}>
              <img src={bishop} alt="" style={{ width: 50 }} />
            </span>
            <span role="presentation" onClick={() => promotion("n")}>
              <img src={knight} alt="" style={{ width: 50 }} />
            </span>
          </div>
        </div>
      )}
      <div className="main">
        <Chessground
          width={innerWidth < innerHeight ? innerWidth : innerHeight}
          height={innerWidth < innerHeight ? innerWidth : innerHeight}
          config={{ ...config }}
        />
      </div>
      {chess.fen() !==
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" && (
        <div
          style={{
            textAlign: "center",
            cursor: "pointer",
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translate(-50%,0)",
          }}
          onClick={handleMoveUndo}
        >
          Undo
        </div>
      )}
    </div>
  );
}

export default App;
