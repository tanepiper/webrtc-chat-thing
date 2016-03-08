import { combineReducers } from 'redux';
import { routerReducer  } from 'react-router-redux';

import channels from './channels';

export const reducers = combineReducers({
  channels: channels,
  routing: routerReducer
});
