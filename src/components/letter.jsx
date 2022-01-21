import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';

import '../styles/styles.css';
import {answers} from '../data/answers'
import { letterStates } from './guessContainer'


class Letter extends Component {

  static propTypes = {
    value: PropTypes.string,
    order: PropTypes.number,
    onClick: PropTypes.func,
    state: PropTypes.string
  };

  letterStateChange = (order, letterState, value) => {
    const newState = letterState == letterStates[2]
      ? letterStates[0]
      : letterStates[letterStates.indexOf(letterState) + 1]

    this.props.onClick(order, newState, value)
  }

  render() {
    const letterState = this.props.state;
    return (
      <div
        className={
          `letter-container ${letterState == 'present' && 'letter-present'} ${letterState == 'correct' && 'letter-correct'}`}
        onClick={()=> {
          this.letterStateChange(this.props.order, letterState, this.props.value)
        }}
      >
        {this.props.value}
      </div>
    );
  }


}

export default Letter;
