import {
  GET_CHANNELS,
  GET_CHANNEL,
  CREATE_CHANNEL
} from '../constants';

export function reduceGetChannels(payload) {
  return {
    type: GET_CHANNELS,
    payload: payload
  }
}

export function reduceCreateChannel(payload) {
  return {
    type: CREATE_CHANNEL,
    payload: payload
  }
}

export function getChannels() {
  return (dispatch, state) => {
    //psudocode
    let channels = [{
      name: 'Channel 1',
      id: 'channel-1'
    }];
    dispatch(reduceGetChannels(channels));
  }
}

export function createChannel() {
  return (dispatch, state) => {
    let name = `Channel ${Math.round(Math.random() * 10000)}`;
    let id = name.split(' ').join('-').toLowerCase();
    // psudocode
    let channel = {
      name: name,
      id: id
    };
    dispatch(reduceCreateChannel(channel))
  }
}
