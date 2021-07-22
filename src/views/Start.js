/** @jsxImportSource @emotion/react */

import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import * as cs from '../styles/common.js';

export default function Start() {
  const history = useHistory();

  const onClick = useCallback(() => {
    //todo wait for creation
    const code = 'asdf';
    history.push(`/play/${code}`);
  }, [history]);

  return (
    <div css={cs.column}>
      <h3>Start</h3>
      <button type="button" onClick={onClick}>
        Start New
      </button>
    </div>
  );
}
