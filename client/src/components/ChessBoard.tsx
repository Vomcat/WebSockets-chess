import { CSSProperties, useState } from 'react';
import { Chess, Move, Square } from 'chess.js';

import { Chessboard } from 'react-chessboard';

export default function ChessBoard() {
  const [game, setGame] = useState(new Chess());
  const [optionSquares, setOptionSquares] = useState({});

  function makeAMove(move: Move | string) {
    const gameCopy = { ...game };
    const result = gameCopy.move(move);
    setGame(gameCopy);
    return result; // null if the move was illegal, the move object if the move was legal
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
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
      color: 'b',
      flags: '',
      piece: 'b',
      san: '',
    });

    // illegal move
    if (move === null) return false;
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
        position={game.fen()}
        onPieceDrop={onDrop}
        customSquareStyles={{
          ...optionSquares,
        }}
      />
      {/* TODO Zrobić jakoś ładnie wizualnie ze ktos wygrał albo jest remis */}
      {game.game_over() && alert('Ktos tam wygrał')}
      {game.in_draw() && alert('Remis')}
    </>
  );
}
