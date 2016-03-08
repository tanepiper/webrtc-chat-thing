import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Col } from 'react-bootstrap';
import Firebase from 'firebase';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from '../actions/channels';

export class ChatRoom extends Component {

  state = {
    chatMessages: [],
    running: false,
    remote: null,
    peerConnection: null,
    dataChannel: null
  };

  static defaultProps = {
    iceServers: {
      iceServers: [{
        url: 'stun:stun.l.google.com:19302'
      }]
    }
  }

  handleSignalChannelMessage(snapshot) {
    const message = snapshot.val();
    const sender = message.sender;
    const type = message.type;
    console.log('Recieved a \'' + type + '\' signal from ' + sender);
    if (type == 'offer') this.handleOfferSignal(message);
    else if (type == 'answer') this.handleAnswerSignal(message);
    else if (type == 'candidate' && this.state.running) this.handleCandidateSignal.call(this, message);
  }

  handleOfferSignal(message) {
    this.setState({ running: true, remote: message.sender });

    this.initiateWebRTCState();
    this.startSendingCandidates();
    this.state.peerConnection.setRemoteDescription(new RTCSessionDescription(message));
    this.state.peerConnection.createAnswer((sessionDescription) => {
      console.log('Sending answer to ' + message.sender);
      this.state.peerConnection.setLocalDescription(sessionDescription);
      this.sendSignalChannelMessage(sessionDescription.toJSON());
    });
  }

  handleAnswerSignal (message) {
    this.state.peerConnection.setRemoteDescription(new RTCSessionDescription(message));
  }

  handleCandidateSignal (message) {
    var candidate = new RTCIceCandidate(message);
    this.state.peerConnection.addIceCandidate(candidate);
  }

  handleDataChannel (event) {
    event.channel.onmessage = this.handleDataChannelMessage.bind(this);
  };

  handleDataChannelMessage (event) {
    console.log('Recieved Message: ' + event.data);

    let messages = this.state.chatMessages.slice();
    messages.push(event.data);
    this.setState({ chatMessages: messages });
  }

  handleDataChannelOpen () {
    console.log('Data channel created!');
    this.state.dataChannel.send('Hello! I am ' + this.randomId);
  };

  handleAnnounceChannelMessage (snapshot) {
    var message = snapshot.val();
    if (message.id != this.randomId && message.sharedKey == this.props.params.channel) {
      console.log('Discovered matching announcement from ' + message.id);
      this.state.remote = message.id;
      this.initiateWebRTCState.call(this);
      this.connectSessions.call(this);
    }
  }

  startSendingCandidates () {
    this.state.peerConnection.oniceconnectionstatechange = this.handleICEConnectionStateChange.bind(this);
    this.state.peerConnection.onicecandidate = this.handleICECandidate.bind(this);
  };

  handleICEConnectionStateChange () {
    if (this.state.peerConnection.iceConnectionState == 'disconnected') {
      console.log('Client disconnected!');
      this.sendAnnounceChannelMessage();
    }
  }

  handleICECandidate (event) {
    var candidate = event.candidate;
    if (candidate) {
      candidate = candidate.toJSON();
      candidate.type = 'candidate';
      console.log('Sending candidate to ' + this.state.remote);
      this.sendSignalChannelMessage(candidate);
    } else {
      console.log('All candidates sent');
    }
  }

  sendSignalChannelMessage (message) {
    message.sender = this.randomId;
    this.database.child('messages').child(this.state.remote).push(message);
  }

  sendAnnounceChannelMessage () {
    this.announceChannel.remove(() => {
      this.announceChannel.push({
        sharedKey : this.props.params.channel,
        id : this.randomId
      });
      console.log('Announced our sharedKey is ' + this.props.params.channel);
      console.log('Announced our ID is ' + this.randomId);
    });
  }

  initiateWebRTCState() {
    const peerConnection = new webkitRTCPeerConnection(this.props.iceServers);
    peerConnection.ondatachannel = this.handleDataChannel.bind(this);
    const dataChannel = peerConnection.createDataChannel(this.props.params.channel);
    dataChannel.onmessage = this.handleDataChannelMessage.bind(this);
    dataChannel.onopen = this.handleDataChannelOpen.bind(this);

    this.setState({
      peerConnection: peerConnection,
      dataChannel: dataChannel
    })
  }

  connectSessions () {
    this.setState({running: true});
    this.startSendingCandidates.call(this);
    this.state.peerConnection.createOffer((sessionDescription) => {
      console.log('Sending offer to ' + this.state.remote);
      this.state.peerConnection.setLocalDescription(sessionDescription);
      this.sendSignalChannelMessage(sessionDescription.toJSON());
    });
  }

  constructor(props) {
    super(props);

    let randomId = Math.random().toString().replace('.', '');

    this.randomId = randomId;

    this.database = new Firebase('https://blazing-torch-9743.firebaseio.com');
    this.announceChannel = this.database.child('announce');
    this.signalChannel = this.database.child('messages').child(this.randomId);

    this.signalChannel.on('child_added', this.handleSignalChannelMessage.bind(this));
    this.announceChannel.on('child_added', this.handleAnnounceChannelMessage.bind(this));
  }

  componentDidMount() {
    this.sendAnnounceChannelMessage();
  }

  render() {

    const { chatMessages } = this.state;

    return (
      <div>
        <h1>Room: {this.props.params.channel}</h1>
        <div>
          <ul>
            {chatMessages.map((message, index) => {
              return <li key={index}>{message}</li>
            })}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  channels: state.channels.channels,
  error: state.channels.error
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch),
  dispatch: dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoom);
