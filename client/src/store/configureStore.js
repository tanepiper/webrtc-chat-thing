import thunk from 'redux-thunk';
import {
  applyMiddleware,
  compose,
  createStore
} from 'redux';
import { routerMiddleware } from 'react-router-redux';

import { reducers } from './../reducers';

/**
 * Method to create stores based on a set of passed
 * reducers
 * @returns {*}
 */
export function configureStore(history, initialState = {}) {

  const middleware = routerMiddleware(history);

  const enhancer = compose(
    // Middleware you want to use in development:
    applyMiddleware(thunk, middleware),
    // Required! Enable Redux DevTools with the monitors you chose
    window.devToolsExtension ? window.devToolsExtension() : f => f
  );

  const store = createStore(reducers, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('./../reducers').default);
    });
  }
  return store;
}
