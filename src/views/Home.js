/** @jsxImportSource @emotion/react */

// import { css } from '@emotion/react';

import * as cs from '../styles/common.js';

import Join from './Join.js';
import Start from './Start.js';

export default function Home() {
  return (
    <div css={[cs.column, { width: '100%' }]}>
      <h1>King Screech's Suits</h1>
      <div css={[cs.row, { width: '100%' }]}>
        <Start />
        <Join />
      </div>
    </div>
  );
}
