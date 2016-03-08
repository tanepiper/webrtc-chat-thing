import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>{this.props.children}</div>
    );
  }
}
