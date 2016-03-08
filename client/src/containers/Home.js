import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Col } from 'react-bootstrap';

import Channels from './Channels';

export default class Home extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Chat App</h1>

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
