import { useEffect, useState } from "react";
import useGameSocket, { WsMessage } from "../../hooks/useGameSocket";
import "./MyApp.css";

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const winnerOf = (b: (string | null)[]) => {
  for (const [a, b1, c] of lines)
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
  return b.every(x => x) ? "Draw" : null;
};

export default function App() {
  const [symbol, setSymbol] = useState<"X" | "O" | null>(null);
  const [history, setHistory] = useState<(string | null)[][]>([Array(9).fill(null)]);
  const [step, setStep] = useState(0);
  const board = history[step];
  const winner = winnerOf(board);
  const turn = step % 2 === 0 ? "X" : "O";

  const { sendMove, sendHist, sendReset } = useGameSocket(handleMsg);

  useEffect(() => {
    const stored = localStorage.getItem("ttt_symbol");
    if (stored === "X" || stored === "O") setSymbol(stored);
  }, []);

  async function handleStart() {
    const res = await fetch("http://localhost:8080/start");
    const txt = await res.text();
    if (txt === "X" || txt === "O") {
      setSymbol(txt);
      localStorage.setItem("ttt_symbol", txt);
    } else {
      setSymbol(txt);
    }
  }

  async function resetGame() {
    sendReset();
    await fetch("http://localhost:8080/api/reset-symbols", { method: "POST" });
    localStorage.removeItem("ttt_symbol");
    setSymbol(null);
  }

  function handleMsg(m: WsMessage) {
    switch (m.kind) {
      case "move":
        setHistory(prev => {
          const next = [...prev[step]];
          if (!winnerOf(next) && !next[m.index]) {
            next[m.index] = m.value;
            return [...prev.slice(0, step + 1), next];
          }
          return prev;
        });
        setStep(s => s + 1);
        break;

      case "hist":
        setStep(m.step);
        break;

      case "reset":
        setHistory([Array(9).fill(null)]);
        setStep(0);
        break;
    }
  }

  const handleCell = (i: number) => {
    if (!symbol || symbol !== turn || winner || board[i]) return;
    sendMove(symbol, i);
  };

  return (
    <div className="wrapper">
      <h1 className="title">Tic Tac Toe</h1>

      {!symbol &&
        <div className="symbol-picker">
          <button onClick={handleStart}>Iniciar</button>
        </div>
      }

      {symbol &&
        <p className="info">Tu símbolo: <strong>{symbol}</strong></p>
      }

      <div className="game-area">
        <div className="board">
          {board.map((v, i) => (
            <button key={i}
              className="cell"
              onClick={() => handleCell(i)}>
              {v}
            </button>
          ))}
        </div>

        <div className="history">
          <h3>Historial</h3>
          {history.map((_, mv) => (
            <button key={mv}
              className={mv === step ? "hist-btn current" : "hist-btn"}
              onClick={() => sendHist(mv)}>
              {mv === 0 ? "Inicio" : `Jugada ${mv}`}
            </button>
          ))}
        </div>
      </div>

      <p className="status">
        {winner
          ? winner === "Draw" ? "🤝 Empate" : `🏆 Ganó ${winner}`
          : symbol
            ? (turn === symbol ? "Tu turno" : "Turno del oponente")
            : "Elige un símbolo"}
      </p>

      <div className="actions">
        <button disabled={step <= 0}
          onClick={() => sendHist(step - 1)}>Deshacer</button>
        <button onClick={resetGame}>Reiniciar</button>
      </div>
    </div>
  );
}
