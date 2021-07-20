/** @jsxImportSource @emotion/react */

// import { css } from '@emotion/react';
import { Link } from 'react-router-dom';

import * as cs from '../styles/common.js';

export default function Join() {
  return (
    <div css={cs.column}>
      Join
      <Link to="/play">todo play</Link>
    </div>
  );
}
