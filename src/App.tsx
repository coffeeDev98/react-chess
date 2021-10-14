import { useEffect, useState } from "react";
import { Key } from "chessground/types";
import Chessground from "@react-chess/chessground";
import useChess from "./hooks/useChess";
import queen from "./assets/images/wQ.svg";
import rook from "./assets/images/wR.svg";
import bishop from "./assets/images/wB.svg";
import knight from "./assets/images/wN.svg";
import "./App.css";
import useAgora from "./hooks/useAgora";

declare let window: any;

function App() {
  const {
    chess,
    turnColor,
    undoMove,
    lastMove,
    fen,
    promotion,
    calcMovable,
    promotionModal,
    movesLog,
  } = useChess();
  const { sendMsgInChannel } = useAgora();

  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const updateDimensions = () => {
    setInnerWidth(window.innerWidth);
    setInnerHeight(window.innerHeight);
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
      check: true,
    },
    // animation: {
    //   enabled: true,
    //   duration: 5000,
    // },
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
    <div className="app" id="chessboard">
      <div className="side-section">
        <div>
          {movesLog?.map((move: String) => (
            <>{move}, </>
          ))}
        </div>
        {promotionModal && (
          <div className="piece-promotion-prompt">
            Promote To?
            <div className="roles">
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
        {chess.fen() !==
          "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" && (
          <div
            className="undo-btn"
            onClick={() => {
              undoMove();
            }}
          >
            Undo
          </div>
        )}
        <div>
          <div
            id="chat-section"
            className="chat-section"
            style={{ padding: 10, border: "black" }}
          ></div>
          <div style={{ display: "flex" }}>
            <input type="text" id="chatbox" />
            <button
              onClick={() => {
                sendMsgInChannel(
                  window.document.getElementById("chatbox").value
                );
              }}
              style={{ padding: 10 }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
      <div className="main-chessboard">
        <Chessground
          width={
            innerWidth < innerHeight ? innerWidth * 0.5 : innerHeight * 0.5
          }
          height={
            innerWidth < innerHeight ? innerWidth * 0.5 : innerHeight * 0.5
          }
          config={{ ...config }}
        />
      </div>
    </div>
  );
}

export default App;
