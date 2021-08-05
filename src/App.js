/** @jsxImportSource @emotion/react */

import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { css } from '@emotion/react';
import { useState } from 'react';

import Game from './views/Game';
import Home from './views/Home';

const appContainer = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const pageContainer = css`
  width: 100%;
  min-height: 25rem;
  margin: 1rem 10%;
`;

export default function App() {
  const [gameMeta, setGameMeta] = useState();

  return (
    <div css={appContainer}>
      <Router>
        <div css={pageContainer}>
          <Switch>
            <Route path="/play/:code">
              <Game {...{ gameMeta }} />
            </Route>
            <Route path="/">
              <Home {...{ setGameMeta }} />
            </Route>
            <Route>
              <Redirect to="/" />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}
