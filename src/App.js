/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from 'react-router-dom';

import Game from './views/Game.js';
import Home from './views/Home.js';

import myfun from 'kss-lib';
import { useEffect } from 'react';

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
  useEffect(() => {
    console.log(`myfun res: ${myfun()}`);
  }, []);

  return (
    <div css={appContainer}>
      <Router>
        <div css={pageContainer}>
          <Switch>
            <Route path="/play/:code">
              <Game />
            </Route>
            <Route path="/">
              <Home />
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
