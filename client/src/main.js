import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Root from './containers/Root';
import { configureStore } from './store/configureStore';

const store = configureStore(browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

const rootElem = document.getElementById('core');
const rootNode = (<Root history={history} store={store} />);

ReactDOM.render(rootNode, rootElem);
