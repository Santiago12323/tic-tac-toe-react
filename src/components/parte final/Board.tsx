import Square from "../Square";
import calculateWinner from "../..//utils/calculateWinner";

type Props = {
  squares: (string | null)[];
  xIsNext: boolean;
  onPlay: (next: (string | null)[]) => void;
};

export default function Board({ squares, xIsNext, onPlay }: Props) {
  const winner = calculateWinner(squares);

  const status = winner
    ? `🏆 Winner: ${winner}`
    : `Next player: ${xIsNext ? "X" : "O"}`;

  const handleClick = (i: number) => {
    if (winner || squares[i]) return;
    const next = squares.slice();
    next[i] = xIsNext ? "X" : "O";
    onPlay(next);
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-2xl font-semibold mb-6 text-center">{status}</h3>

      <div className="grid grid-cols-3 gap-4">
        {squares.map((val, i) => (
          <Square key={i} value={val} onClick={() => handleClick(i)} />
        ))}
      </div>
    </div>
  );
}
