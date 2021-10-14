import { useEffect, useState } from "react";
import { ChessInstance, PieceType, ShortMove } from "chess.js";
import { colors } from "chessground/types";

const Chess = require("chess.js");

const useChess = () => {
  const [chess] = useState<ChessInstance>(
    new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  );
  const [fen, setFen] = useState(chess.fen());
  const [pendingMove, setPendingMove] = useState<any>();
  const [promotionModal, setPromotionModal] = useState(false);
  const [lastMove, setLastMove] = useState<any>();
  const [movesLog, setMovesLog] = useState<String[]>();
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    console.log("pendingMove: ", pendingMove);
  }, [pendingMove]);

  const showPromotionModal = () => setPromotionModal(true);
  const hidePromotionModal = () => setPromotionModal(false);
  const checkGameOver = () => chess.game_over();

  const turnColor = () => (chess.turn() === "w" ? colors[0] : colors[1]);

  const handleMove = (move: ShortMove) => {
    const moves = chess.moves({ verbose: true });
    // console.log("moves: ", chess.moves());

    for (let i = 0, len = moves.length; i < len; i++) {
      /* eslint-disable-line */
      if (moves[i].flags.indexOf("p") !== -1 && moves[i].from === move.from) {
        setPendingMove([move.from, move.to]);
        showPromotionModal();
        return;
      }
    }
    const moveVerbose = chess.move(move);
    if (moveVerbose) {
      console.log(moveVerbose.san);
      setFen(chess.fen());
      console.log("GAME STATS", {
        in_check: chess.in_check(),
        in_checkmate: chess.in_checkmate(),
        in_stalemate: chess.in_stalemate(),
        in_threefold_repetition: chess.in_threefold_repetition(),
      });
      setGameOver(checkGameOver());
      setLastMove([move.from, move.to]);
      setMovesLog(chess.history());
    }
  };

  const undoMove = () => {
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
    hidePromotionModal();
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

  return {
    chess,
    turnColor,
    handleMove,
    undoMove,
    pendingMove,
    lastMove,
    fen,
    promotion,
    calcMovable,
    promotionModal,
    showPromotionModal,
    movesLog,
    gameOver,
  };
};

export default useChess;
