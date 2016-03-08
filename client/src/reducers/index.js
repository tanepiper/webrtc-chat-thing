import { combineReducers } from 'redux';
import { routerReducer  } from 'react-router-redux';

import channels from './channels';
import auth from './auth';

export const reducers = combineReducers({
  auth: auth,
  channels: channels,
  routing: routerReducer
});
