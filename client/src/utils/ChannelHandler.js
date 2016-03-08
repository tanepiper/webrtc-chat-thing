export default class ChatDelegate {

  static stunConfig = {
    iceServers: [{
      url: 'stun:stun.l.google.com:19302'
    }]
  };

  static isRunning = false;

  /**
   * Constructor for the Chat Delegate for a user and channel
   * @param username
   * @param channelId
   */
  constructor(username = 'zer0kool', channelId = null, messageBus) {
    this.username = username;
    this.channelId = channelId;
    this.messageBus = messageBus;

    this.database = new Firebase('https://blazing-torch-9743.firebaseio.com');
    this.signalChannel = this.database.child('messages').child(username);
    this.announceChannel = this.database.child('announce');

    this.signalChannel.on('child_added', this.handleSignalChannelMessage.bind(this));
    this.announceChannel.on('child_added', this.handleAnnounceChannelMessage.bind(this));

    return this;
  }

  /**
   * Sent when the user joins a channel
   */
  sendAnnounceChannelMessage() {
    this.announceChannel.remove(() => {
      this.announceChannel.push({
        sharedKey: this.channelId,
        id: this.username
      });
      console.log('Announced our sharedKey is ' + this.channelId);
      console.log('Announced our ID is ' + this.username);
    });
  }


  /**
   * Handler for the signal channel
   * @param snapshot
   */
  handleSignalChannelMessage(snapshot) {
    const message = snapshot.val();
    const sender = message.sender;
    const type = message.type;

    console.log(type, message, sender);

    switch (type) {
      case 'offer':
        return this.handleOfferSignal.call(this, message);
      case 'answer':
        return this.handleAnswerSignal.call(this, message);
      case 'candidate':
        return this.isRunning && this.handleCandidateSignal.call(this, message);
      default:
        console.log('handleSignalChannelMessage', 'Unknown message type', type, message, sender);
    }
  }

  /**
   * Handler for the announcement channel
   * @param snapshot
   */
  handleAnnounceChannelMessage(snapshot) {
    var message = snapshot.val();
    if (message.id != this.username && message.sharedKey === this.channelId) {
      console.log('handleAnnounceChannelMessage', 'Incoming Shared Announcement', message.id, message.sharedKey);
      this.lastRemoteClient = message.id;
      this.initiateWebRTCState.call(this);
      this.connectSessions.call(this);
    }
  }


  createPeerConnectionAnswer (sessionDescription) {

  }

  /**
   * Handler for an incoming offer signal
   * @param message
   */
  handleOfferSignal(message) {

    this.isRunning = true;

    this.initiateWebRTCState.call(this);
    this.startSendingCandidates.call(this);
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(message));

    this.peerConnection.createAnswer((sessionDescription) => {
      console.log('Sending answer to ' + message.sender, message);
      this.peerConnection.setLocalDescription(sessionDescription);
      this.database.child('messages').child(message.sender).push(sessionDescription.toJSON());
    });
  }

  handleAnswerSignal(message) {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(message));
  }

  handleCandidateSignal(message) {
    console.log('Candidate Signal', message);
    var candidate = new RTCIceCandidate(message);
    this.peerConnection.addIceCandidate(candidate);
  }

  /**
   * Hande ICE Server connection state change
   */
  handleICEConnectionStateChange() {
    if (this.peerConnection.iceConnectionState == 'disconnected') {
      console.log('Client disconnected!');
      this.sendAnnounceChannelMessage();
    }
  }

  startSendingCandidates() {
    this.peerConnection.oniceconnectionstatechange = () => {
      switch (this.peerConnection.iceConnectionState) {
        case 'connected':
          return console.log('Client Connected')
        case 'disconnected':
          console.log('Client Disconnected');
          return this.sendAnnounceChannelMessage();
        default:
          console.log('Unknown oniceconnectionstatechange', this.peerConnection.iceConnectionState, this.peerConnection);
      }
    };

    this.peerConnection.onicecandidate = (event) => {
      var candidate = event.candidate;
      if (candidate) {
        candidate = candidate.toJSON();
        candidate.type = 'candidate';
        if (this.lastRemoteClient) {
          this.database.child('messages').child(this.lastRemoteClient).push(Object.assign({}, candidate, {
            sender: this.username
          }));
        }
      }
    };

    this.peerConnection.onerror = (error) => {
      console.error('Peer Error', error);
    }
  }

  handleOnPeerDataChannel (event) {
    event.channel.onmessage = (event) => {
      console.log('Received Message: ' + event.data);
      this.messageBus(JSON.parse(event.data));
    };

    event.channel.onerror = (error) => {
      console.error('Event Channel Error', error)
    }
  }


  /**
   * Init a WebRTC peer connection and create a data channel for the channel id
   */
  initiateWebRTCState() {
    this.peerConnection = new webkitRTCPeerConnection(this.stunConfig);
    this.peerConnection.ondatachannel = this.handleOnPeerDataChannel.bind(this);

    this.dataChannel = this.peerConnection.createDataChannel(this.channelId);

    this.dataChannel.onmessage = (event) => {
      console.log('Received Message: ' + event.data);
      this.messages.push(event.data);
    };


    this.dataChannel.onopen = (event) => {
      console.log('Data channel created!', this.channelId);
      var readyState = this.dataChannel.readyState;
      if (readyState == 'open') {
        this.dataChannel.send(JSON.stringify({
          event: 'connected',
          username: this.username,
          message: `${this.username$} has connected`,
          channel: this.channelId
        }));
      }
    };

    this.dataChannel.onclose = (event) => {
      console.error('Data Channel has closed', this.channelId, event, this.dataChannel);
    }

    this.dataChannel.onerror = (error) => {
      console.error('Data Channel error', error);
    }
  }

  connectSessions() {
    this.isRunning = true;
    this.startSendingCandidates.call(this);
    this.peerConnection.createOffer((sessionDescription) => {
      console.log('Sending offer to ' + this.lastRemoteClient);
      this.peerConnection.setLocalDescription(sessionDescription);

      let message = sessionDescription.toJSON();
      message.sender = this.username;
      this.database.child('messages').child(this.lastRemoteClient).push(message);
    });
  }



  sendMessage(message) {
    console.log(this, message);
    if (this.dataChannel.readyState === 'open') {
      this.dataChannel.send(JSON.stringify({ event: 'message', username: this.username, message: message, channel: this.channelId }));
    } else {
      console.log('Data Channel Not Open', this.dataChannel.readyState, this.dataChannel);
    }

  }

}
