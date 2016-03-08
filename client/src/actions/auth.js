import {
  SET_USERNAME,
  GET_USERNAME
} from '../constants'

export function reduceSetUsername(payload) {
  return {
    type: SET_USERNAME,
    payload: payload
  }
}

export function reduceGetUsername() {
  return {
    type: GET_USERNAME
  }
}

export function setUsername(username) {
  return (dispatch, state) => {
    dispatch(reduceSetUsername(username));
  }
}

export function getUsername() {
  return (dispatch, state) => {
    dispatch(reduceGetUsername());
  }
}
