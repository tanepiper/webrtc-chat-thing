import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class ChannelList extends Component {

  static propTypes = {
    channels: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { channels } = this.props;

    return (
      <ul>
      {channels.map((channel, index) => {
        return <li key={channel.id}><Link to={`/channel/${channel.id}`}>{channel.name}</Link></li>
      })}
      </ul>
    )
  }
}
