/** @jsxImportSource @emotion/react */

import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useFetch from 'use-http';

import * as cs from '../styles/common';

export default function Join({ playerName, setGameMeta }) {
  const [code, setCode] = useState('');
  const history = useHistory();

  const { post } = useFetch(`/api/v1/game/join`);
  const onClick = useCallback(async () => {
    if (!playerName) {
      console.log('Gotta set a player name');
      return;
    }

    try {
      const { cards, playerId } = await post(`/${code}`, { playerName });
      setGameMeta({ cards, playerId });
      history.push(`/play/${code}`);
    } catch (err) {
      console.log(`Code ${code} is not valid, doing nothing`);
    }
  }, [setGameMeta, history, post, playerName, code]);

  return (
    <div css={cs.column}>
      <h3>Join</h3>
      <input value={code} onChange={(e) => setCode(e.target.value)} />
      <button type="button" onClick={onClick}>
        Join
      </button>
    </div>
  );
}
