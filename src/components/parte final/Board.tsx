interface Props {
  board: (string | null)[];
  onClick: (i: number) => void;
}

export default function Board({ board, onClick }: Props) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 80px)", gap: "5px" }}>
      {board.map((cell, i) => (
        <button
          key={i}
          onClick={() => onClick(i)}
          style={{ height: "80px", fontSize: "32px" }}
        >
          {cell}
        </button>
      ))}
    </div>
  );
}
