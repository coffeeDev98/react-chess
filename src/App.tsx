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
import AgoraRTM, {
  RtmChannel,
  RtmClient,
  RtmMessage,
  RtmTextMessage,
} from "agora-rtm-sdk";
import axios from "axios";
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

  // AGORA INTEGRATION
  const [chatHistory, setChatHistory] = useState<any>([]);
  const appId = "f4b36b6c897e41bfaa3904d75da40777";
  const client: RtmClient | null = AgoraRTM.createInstance(appId);
  let channel: RtmChannel | null = null;
  useEffect(() => {
    playerLogin().then(() => {
      console.log("integrations successful");
    });
  }, []);
  // useEffect(() => {
  //   console.log(chatHistory);
  // }, [chatHistory]);
  const playerLogin = async () => {
    const playerMeta = {
      uid: (Math.floor(Math.random() * 90000) + 10000).toString(),
      token: "",
    };
    axios
      .get(
        `http://localhost:8080/access_token?channel=test&uid=${playerMeta.uid}`
      )
      .then((res: any) => {
        console.log(res);
        playerMeta.token = res.data?.token || "";
        console.log("LOGIN OPTIONS: ", playerMeta);
        client.login(playerMeta).then(() => {
          console.log("Login successful");
          channel = client.createChannel("test");
          // Executed when message is received
          channel.on("ChannelMessage", (message: any) => {
            console.log(message);
            setChatHistory([...chatHistory, message]);
          });
          channel.on("MemberJoined", function (memberId) {
            console.log("New member joined: ", memberId);
          });

          channel.join().then(() => {
            const msgObject: RtmTextMessage = {
              text: "Hello",
              messageType: "TEXT",
            };
            channel?.sendMessage(msgObject).then(() => {
              // setChatHistory([...chatHistory, msgObject]);
            });
          });
        });
      });
  };

  const sendMsgInChannel = (message: string) => {
    const msgObject: RtmTextMessage = {
      text: message || "",
      messageType: "TEXT",
    };
    console.log("channel:", channel);
    channel?.sendMessage(msgObject);
  };
  // AGORA INTEGRATION END

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
    console.log("moves: ", chess.moves());

    for (let i = 0, len = moves.length; i < len; i++) {
      /* eslint-disable-line */
      if (moves[i].flags.indexOf("p") !== -1 && moves[i].from === move.from) {
        setPendingMove([move.from, move.to]);
        setPromotionModal(true);
        return;
      }
    }
    const moveVerbose = chess.move(move);
    if (moveVerbose) {
      console.log(moveVerbose.san);
      setFen(chess.fen());
      const gameOverCheck = chess.game_over();
      console.log("game-over: ", gameOverCheck);
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
          // console.log("metadata: ", { from, to, metadeta });
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
    <div className="app" id="chessboard">
      <div className="side-section">
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
          <div className="undo-btn" onClick={handleMoveUndo}>
            Undo
          </div>
        )}
        <div>
          {/* <div
            className="chat-section"
            style={{ padding: 10, border: "black" }}
          >
            {chatHistory.map((chatItem: any, index: number) => (
              <div key={index}>
                <span>
                  <strong>{chatItem.text}</strong>
                </span>
              </div>
            ))}
          </div> */}
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
