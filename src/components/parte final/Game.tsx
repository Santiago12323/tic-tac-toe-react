import { useCallback, useState } from "react";
import { Button } from "@nextui-org/react";
import Board from "./Board";
import useGameSocket, { GameState } from "../../hooks/useGameSocket";

export default function Game() {
  const [game, setGame] = useState<GameState | null>(null);
  const [mySymbol, setMySymbol] = useState<"X" | "O" | null>(null);

  const { sendMove, undo, reset } = useGameSocket(
    useCallback((g: GameState) => setGame(g), []),
    useCallback((sym) => setMySymbol(sym), [])
  );

  if (!game || !mySymbol) return <p className="text-center mt-10">Conectando…</p>;

  const handleCell = (i: number) => {
    if (game.winner || game.board[i]) return;
    if (game.currentTurn !== mySymbol) return; // no es tu turno
    sendMove(i);
  };

  const status =
    game.winner === "draw"
      ? "🤝 Empate"
      : game.winner
      ? `🏆 Ganó ${game.winner}`
      : game.currentTurn === mySymbol
      ? "Tu turno"
      : "Turno del oponente";

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h2 className="text-2xl font-semibold">{status}</h2>

      <Board squares={game.board} onPlay={handleCell} />

      <div className="flex gap-4 mt-4">
        <Button disabled={game.history.length === 0} onPress={undo}>
          Undo
        </Button>
        <Button color="warning" onPress={reset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
