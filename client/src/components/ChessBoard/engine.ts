export default class Engine {
  stockfish: Worker;
  onMessage: (callback: any) => void;

  constructor() {
    this.stockfish = new Worker('./stockfish.js');
    this.onMessage = (callback) => {
      this.stockfish.addEventListener('message', (e) => {
        const bestMove = e.data?.match(/bestmove\s+(\S+)/)?.[1];

        callback({ bestMove });
      });
    };
  }

  evaluatePosition(fen: string, depth: number) {
    this.stockfish.postMessage(`position fen ${fen}`);
    this.stockfish.postMessage(`go depth ${depth}`);
  }
  stop() {}
  quit() {}
}
