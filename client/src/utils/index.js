import Firebase from 'firebase';

/**
 * Utility method to create a set of reducers by passing
 * in a spread of string arguments
 * @param constants
 * @returns {*}
 */
export function createConstants(...constants) {

  return constants.reduce((previousValue, currentValue) => {

    previousValue[currentValue] = currentValue;
    return previousValue;
  }, {});
}

/**
 * Utility method to create a reducer from a map,
 * with initial state
 * @param initialState
 * @param reducerMap
 * @returns {Function}
 */
export function createReducer(initialState, reducerMap) {

  return (state = initialState, action) => {
    const reducer = reducerMap[action.type];
    return reducer
      ? reducer(state, action.payload)
      : state;
  };
}


export function getSignalingServer() {
  return new Firebase('https://flickering-fire-1517.firebaseio.com/signalling');
}
