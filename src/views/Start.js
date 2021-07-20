/** @jsxImportSource @emotion/react */

// import { css } from '@emotion/react';
import { Link } from 'react-router-dom';

import * as cs from '../styles/common.js';

export default function Start() {
  return (
    <div css={cs.column}>
      Start
      <Link to="/play">todo play</Link>
    </div>
  );
}
