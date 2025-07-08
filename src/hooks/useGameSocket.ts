import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs.min.js";

export type WsMessage =
  | { kind: "move"; value: "X" | "O"; index: number }
  | { kind: "hist"; step: number }
  | { kind: "reset" };

export default function useGameSocket(onMessage: (m: WsMessage) => void) {
  const client = useRef<Client>();

  useEffect(() => {
    const c = new Client({
      reconnectDelay: 2000,
      webSocketFactory: () =>
        new SockJS("http://localhost:8080/ws", null, { withCredentials: false }),
      onConnect() {
        c.subscribe("/topic/msg", (frame) => {
          const parts = frame.body.split(":");
          switch (parts[0]) {
            case "MOVE":
              onMessage({
                kind: "move",
                value: parts[1] as "X" | "O",
                index: Number(parts[2]),
              });
              break;
            case "HIST":
              onMessage({ kind: "hist", step: Number(parts[1]) });
              break;
            case "RESET":
              onMessage({ kind: "reset" });
              break;
          }
        });
      },
    });
    c.activate();
    client.current = c;
    return () => c.deactivate();
  }, [onMessage]);

  const send = (s: string) =>
    client.current?.publish({ destination: "/app/msg", body: s });

  return {
    sendMove: (sym: "X" | "O", idx: number) => send(`MOVE:${sym}:${idx}`),
    sendHist: (step: number) => send(`HIST:${step}`),
    sendReset: () => send("RESET"),
  };
}
