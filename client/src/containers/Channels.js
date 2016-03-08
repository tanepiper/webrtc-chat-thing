import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from '../actions/channels';

import ChannelList from '../components/Channels/List';

export default class Channels extends Component {

  static propTypes = {
    channels: PropTypes.array
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.actions.getChannels();
  }

  render() {
    const { channels, error } = this.props;

    return (
      <section>
        <ChannelList channels={channels} />
        <button>Create New Channel</button>
      </section>
    );
  }
}

const mapStateToProps = (state) => ({
  username: state.auth.username,
  channels: state.channels.channels,
  error: state.channels.error
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch),
  dispatch: dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(Channels);
