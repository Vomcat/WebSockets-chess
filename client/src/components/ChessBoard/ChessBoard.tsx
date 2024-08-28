import { CSSProperties, useMemo, useState } from 'react';
import { Chess, Square } from 'chess.js';

import { Chessboard } from 'react-chessboard';
import Engine from './engine';

interface Props {
  gameMode?: 'playerVsPlayer' | 'playerVsComputer';
}

const players = [
  {
    id: 1,
    name: 'Daniel',
    color: 'w',
  },
  {
    id: 2,
    name: 'Weronika',
    color: 'b',
  },
];

export default function ChessBoard({ gameMode = 'playerVsPlayer' }: Props) {
  const game = useMemo(() => new Chess(), []);
  const [optionSquares, setOptionSquares] = useState({});
  const [gamePosition, setGamePosition] = useState(game.fen());
  const engine = useMemo(() => new Engine(), []);

  function computerMove() {
    engine.evaluatePosition(game.fen(), 10);
    engine.onMessage(({ bestMove }: { bestMove: any }) => {
      if (bestMove) {
        game.move({
          from: bestMove.substring(0, 2),
          to: bestMove.substring(2, 4),
          promotion: bestMove.substring(4, 5),
        });

        setGamePosition(game.fen());
      }
    });
  }

  function getMoveOptions(square: Square) {
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }
    const newSquares: { [key: string]: CSSProperties } = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to)!.color !== game.get(square)!.color
            ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%',
      };
      return move;
    });
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)',
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });
    setGamePosition(game.fen());

    // illegal move
    if (move === null) return false;
    if (gameMode === 'playerVsComputer') setTimeout(computerMove, 200);

    if (game.game_over() || game.in_draw()) return false;
    return true;
  }

  function onSquareClick(square: Square) {
    getMoveOptions(square);
  }

  function onPieceDragBegin(_piece: string, sourceSquare: Square): any {
    getMoveOptions(sourceSquare);
  }

  return (
    <>
      <Chessboard
        animationDuration={200}
        onSquareClick={onSquareClick}
        onPieceDragBegin={onPieceDragBegin}
        onPieceDragEnd={() => setOptionSquares({})}
        position={gamePosition}
        onPieceDrop={onDrop}
        customSquareStyles={{
          ...optionSquares,
        }}
      />
      <p className="flex justify-center text-2xl mt-3">
        Tura gracza: {players.find((obj) => obj.color === game.turn())!.name}
      </p>

      {/* TODO Zrobić jakoś ładnie wizualnie ze ktos wygrał albo jest remis */}
      {/* {game.game_over() && alert('Ktos tam wygrał')} */}
      {/* {game.in_draw() && alert('Remis')} */}
    </>
  );
}
