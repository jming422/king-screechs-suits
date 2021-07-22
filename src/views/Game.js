/** @jsxImportSource @emotion/react */

import { useParams } from 'react-router-dom';

import * as cs from '../styles/common.js';

export default function Game() {
  const { code } = useParams();

  return <div css={[cs.column, { width: '100%' }]}> Game code: {code}</div>;
}
