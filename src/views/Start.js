/** @jsxImportSource @emotion/react */

import useFetch from 'use-http';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import * as cs from '../styles/common';

export default function Start({ playerName, setGameMeta }) {
  const history = useHistory();

  const { post } = useFetch('/api/v1/game');
  const startNewGame = useCallback(async () => {
    if (!playerName) {
      console.log('Gotta set a player name');
      return;
    }

    const {
      cards,
      playerId,
      game: { code },
    } = await post({ playerName });

    setGameMeta({ cards, playerId });
    history.push(`/play/${code}`);
  }, [setGameMeta, history, playerName, post]);

  return (
    <div css={cs.column}>
      <h3>Start</h3>
      <button type="button" onClick={startNewGame}>
        Start New
      </button>
    </div>
  );
}
