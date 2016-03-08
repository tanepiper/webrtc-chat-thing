import React, { Component, PropTypes } from 'react';
import { Input } from 'react-bootstrap';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from '../actions/auth';

export class Username extends Component {

  constructor(props) {
    super(props);
  }

  validationState() {
    let length = this.props.username.length;
    if (length > 10) return 'success';
    else if (length > 5) return 'warning';
    else if (length > 0) return 'error';
  }

  handleChange() {
    this.props.actions.setUsername(this.refs.input.getValue())
  }

  render() {
    return (
      <div>
        <Input
          type="text"
          value={this.props.username}
          placeholder="Zer0kool"
          label="Please enter your username"
          help="Select a cool username"
          bsStyle={this.validationState()}
          hasFeedback
          ref="input"
          groupClassName="group-class"
          labelClassName="label-class"
          onChange={this.handleChange.bind(this)} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  username: state.auth.username
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch),
  dispatch: dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(Username);
