import { createReducer } from '../utils';

import {
  SET_USERNAME,
  GET_USERNAME
} from '../constants';

const initialState = {
  username: ''
};


export default createReducer(initialState, {
  [SET_USERNAME]: (state, payload) => {
    return Object.assign({}, state, {
      username: payload
    })
  },
  [GET_USERNAME]: (state) => {
    return state.username
  }
})
