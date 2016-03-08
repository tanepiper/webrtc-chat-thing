import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Col, Input } from 'react-bootstrap';

import Channels from './Channels';
import Username from './Username';

export default class Home extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Chat App</h1>

        <div className="row">
          <Username />
        </div>

        <div className="row">
          <Col md={6}>
            <Channels />
          </Col>
          <Col md={6}>
            {this.props.children}
          </Col>
        </div>
      </div>
    );
  }
}
