import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useCallback, useEffect, useState } from 'react';

export default function useGameWebsocket(playerId, refreshGame) {
  const wsUrl = `${window.location.protocol === 'https:' ? 'wss://' : 'ws://'}${
    window.location.host
  }/ws?playerId=${playerId}`;

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(wsUrl, {
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    shouldReconnect: () => true,
  });

  const [ready, setReady] = useState();
  const [lastActionSuccess, setLastActionSuccess] = useState(null);

  useEffect(() => {
    switch (readyState) {
      case ReadyState.UNINSTANTIATED:
      case ReadyState.CONNECTING:
        setReady(null);
        break;
      case ReadyState.CLOSING:
      case ReadyState.CLOSED:
        setReady(false);
        break;
      case ReadyState.OPEN:
      default:
        setReady(true);
    }
  }, [readyState]);

  useEffect(() => {
    const { event } = lastJsonMessage ?? {};
    switch (event) {
      case 'gameStateUpdated':
        refreshGame();
        break;
      case 'response':
        setLastActionSuccess(lastJsonMessage.success);
        break;
      default:
        if (lastJsonMessage)
          console.warn(
            `Discarding unrecognized ws response: ${JSON.stringify(
              lastJsonMessage
            )}`
          );
    }
  }, [refreshGame, lastJsonMessage]);

  // 'ability', 'draw', 'match', 'discard'
  const sendAction = useCallback(
    (action, payload) => sendJsonMessage({ action, payload }),
    [sendJsonMessage]
  );

  return { sendAction, lastActionSuccess, ready };
}
