import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from '../containers/App';
import Home from './../containers/Home';
import ChatRoom from '../containers/ChatRoom'

const chatRoutes = () =>
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="channel/:channel" component={ChatRoom} />
  </Route>
  ;

export default (
  <section>
    { chatRoutes() }
  </section>
);
