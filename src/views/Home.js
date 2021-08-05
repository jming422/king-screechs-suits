/** @jsxImportSource @emotion/react */

// import { css } from '@emotion/react';
import { useState } from 'react';

import * as cs from '../styles/common';

import Join from './Join';
import Start from './Start';

export default function Home({ setGameMeta }) {
  const [playerName, setPlayerName] = useState('');

  return (
    <div css={[cs.column, { width: '100%' }]}>
      <h1>King Screech's Suits</h1>
      <label>Player Name:</label>
      <input
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <div css={[cs.row, { width: '100%' }]}>
        <Start {...{ playerName, setGameMeta }} />
        <Join {...{ playerName, setGameMeta }} />
      </div>
    </div>
  );
}
