/** @jsxImportSource @emotion/react */

import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

import * as cs from '../styles/common.js';

export default function Join() {
  const [code, setCode] = useState('');
  const history = useHistory();

  const onClick = useCallback(() => {
    if (code === 'asdf') history.push(`/play/${code}`);
  }, [history, code]);

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
