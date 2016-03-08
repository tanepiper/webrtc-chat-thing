import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Col, Input, ButtonInput } from 'react-bootstrap';
import Firebase from 'firebase';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from '../actions/channels';

import ChatHandler from '../utils/ChannelHandler';

export class ChatRoom extends Component {

  state = {
    currentMessage: '',
    chatMessages: []
  };

  constructor(props) {
    super(props);

    this.chatHandler = new ChatHandler(this.props.username || 'Unknown', this.props.params.channel, this.handleNewMessages.bind(this));
  }

  handleNewMessages(message) {
    const messages = this.state.chatMessages.slice();
    messages.push(message);
    this.setState({ chatMessages: messages });
  }

  componentWillMount() {
    this.chatHandler.sendAnnounceChannelMessage();
  }

  validationState() {
    let length = this.state.currentMessage.length;
    if (length > 10) return 'success';
    else if (length > 5) return 'warning';
    else if (length > 0) return 'error';
  }

  handleChange() {
    this.setState({
      currentMessage: this.refs.input.getValue()
    });
  }

  handleClick() {
    const messages = this.state.chatMessages.slice();
    messages.push({ event: 'message', username: this.props.username, message: this.state.currentMessage, channel: this.props.params.channel });
    this.setState({
      chatMessages: messages
    });
    this.chatHandler.sendMessage(this.state.currentMessage);
    this.setState({
      currentMessage: ''
    });
  }

  render() {

    const { chatMessages } = this.state;

    return (
      <div>
        <h1>Room: {this.props.params.channel}</h1>

        <div>
          <Input
            type="text"
            value={this.state.currentMessage}
            placeholder="Enter text"
            label="Working example with validation"
            help="Validation is based on string length."
            bsStyle={this.validationState()}
            hasFeedback
            ref="input"
            groupClassName="group-class"
            labelClassName="label-class"
            onChange={this.handleChange.bind(this)}/>

          <ButtonInput type="submit" bsStyle="primary" onClick={this.handleClick.bind(this)}/>
        </div>


        <div>
          <ul>
            {chatMessages.map((message, index) => {
              if (message.event === 'message') {
                return <li key={index}><strong>{message.username}:</strong> {message.message}</li>
              }
              if (message.event === 'connected') {
                return <li key={index}><em>{message.username}</em> joined</li>
              }
            })}
          </ul>
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoom);
