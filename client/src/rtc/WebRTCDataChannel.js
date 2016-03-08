import Firebase from 'firebase';

const peerConnection = typeof window['webkitRTCPeerConnection'] !== 'undefined' ? window['webkitRTCPeerConnection'] : window['RTCPeerConnection'];

export default class WebRTCDataChannel {

  static SIGNAL_CHANNEL = 'signalling';

  static iceServers = [{
    'url': 'stun:stun.l.google.com:19302'
  }];

  static dataChannelOptions = {
    ordered: false, //no guaranteed delivery, unreliable but faster
    maxRetransmitTime: 1000 //milliseconds
  };

  rtcPeerConnection = null;

  dataChannel = null;

  constructor(identifier = 'default-channel') {
    this.configuration = {
      identifier: identifier,
      iceServers: [{
        'url': 'stun:stun.l.google.com:19302'
      }]
    };

    this.socket = new Firebase(`https://blazing-torch-9743.firebaseio.com/${this.SIGNAL_CHANNEL}`);
    console.log(peerConnection);
    this.rtcPeerConnection = new peerConnection(this.configuration, null);
    this.dataChannel = this.rtcPeerConnection.createDataChannel(identifier, this.dataChannelOptions);
  }

  startSignalling() {
    console.log('Signalling', this.configuration.identifier);
    this.dataChannel.onopen = this.dataChannelStateChanged.bind(this);
    this.rtcPeerConnection.ondatachannel = this.receiveDataChannel.bind(this);

    // send any ice candidates to the other peer
    this.rtcPeerConnection.onicecandidate = (evt) => {
      if (evt.candidate) {
        console.log('Event Candidate', evt.candidate);

        const req = {
          candidate: evt.candidate
        };
        this.socket.set(req);
      }
    };

    // let the 'negotiationneeded' event trigger offer generation
    this.rtcPeerConnection.onnegotiationneeded = () => {
      console.log("on negotiation called");
      this.rtcPeerConnection.createOffer(this.sendLocalDesc.bind(this), console.error);
    }
  }

  dataChannelStateChanged() {
    if (this.dataChannel.readyState === 'open') {
      console.log("Data Channel open");
      this.dataChannel.onmessage = this.receiveDataChannelMessage.bind(this);
    }
  }

  receiveDataChannel(event) {
    console.log("Receiving a data channel");
    this.dataChannel = event.channel;
    this.dataChannel.onmessage = this.receiveDataChannelMessage.bind(this);
  }

  receiveDataChannelMessage(event) {
    console.log("From DataChannel: " + event.data);
  }

  sendLocalDesc(desc) {
    this.rtcPeerConnection.setLocalDescription(desc, () => {
      console.log("sending local description");
      console.log('signal',{"type":"SDP", "message": JSON.stringify({ 'sdp': this.rtcPeerConnection.localDescription }), "room": this.SIGNAL_ROOM});
    }, console.error);
  }


}
