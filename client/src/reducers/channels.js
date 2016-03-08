import { createReducer } from '../utils';

import {
  GET_CHANNELS,
  CREATE_CHANNEL
} from '../constants';

const initialState = {
  channels: [],
  error: null
};


export default createReducer(initialState, {
  [GET_CHANNELS]: (state, payload) => {
    return Object.assign({}, state, {
      channels: payload,
      error: null
    })
  },

  [CREATE_CHANNEL]: (state, payload) => {
    let channels = state.channels.slice();
    channels.push(payload);
    return Object.assign({}, state, {
      channels: channels
    });
  }
})
