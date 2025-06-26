import { useState } from "react";
import { Button } from "@nextui-org/react";
import Board from "./Board";

export default function Game() {
  const [history, setHistory] = useState<(string | null)[][]>([
    Array(9).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const handlePlay = (nextSquares: (string | null)[]) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 justify-center items-start p-4">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
        <Board
          squares={currentSquares}
          xIsNext={xIsNext}
          onPlay={handlePlay}
        />
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 shadow-lg w-full max-w-xs">
        <h4 className="text-xl font-medium mb-4">History</h4>

        <div className="flex flex-col gap-2">
          {history.map((_, move) => (
            <Button
              key={move}
              variant="light"
              fullWidth
              onPress={() => setCurrentMove(move)}
            >
              {move === 0 ? "Go to start" : `Go to move #${move}`}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
