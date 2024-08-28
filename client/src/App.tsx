import ChessBoard from './components/ChessBoard/ChessBoard';

function App() {
  return (
    <div className="w-[700px]">
      <ChessBoard gameMode="playerVsComputer" />
    </div>
  );
}

export default App;
