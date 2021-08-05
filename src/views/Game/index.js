/** @jsxImportSource @emotion/react */

import useFetch from 'use-http';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import { GameContext } from '../../context';

import useGameWebSocket from '../../utils/gameWebsocket';

import * as cs from '../styles/common';

export default function Game({ gameMeta: { playerId, cards } }) {
  const { code } = useParams();

  const [gameRefreshTrigger, setGameRefresh] = useState(0);
  const refreshGame = useCallback(() => setGameRefresh((x) => x + 1), []);

  const { data, loading } = useFetch(`/api/v1/game/${code}`, [
    code,
    gameRefreshTrigger,
  ]);

  const { sendAction, lastActionSuccess, ready } = useGameWebSocket(
    playerId,
    refreshGame
  );

  const gameCtx = {
    cards, // has keys color and basic which point to arrays of full card details
    gameState: data?.state ?? {},
    refreshGame,
    sendAction,
    lastActionSuccess,
    connectionReady: ready,
    loading,
  };

  return (
    <GameContext.Provider value={gameCtx}>
      <div css={[cs.column, { width: '100%' }]}> Game code: {code}</div>
    </GameContext.Provider>
  );
}
