import React, { Component, useState } from 'react';

import '../styles/styles.css';
import Letter from './letter';
import { answers, initialGuess } from '../data/answers'

export const letterStates = [
  'absent',
  'present',
  'correct',
]



class GuessContainer extends Component {

  initialState = () => {
    return {
      gameStarted: false,
      currentGuess: initialGuess(),
      guessList: answers,
      currentGuessState: [
        {'letter': '', 'state': letterStates[0]},
        {'letter': '', 'state': letterStates[0]},
        {'letter': '', 'state': letterStates[0]},
        {'letter': '', 'state': letterStates[0]},
        {'letter': '', 'state': letterStates[0]}
      ],
      absentLetters: {},
      numberOfGuesses: 1,
      won: false
    }
  }

  constructor(props) {
    super(props)
    this.state = this.initialState();
  }

  reset() {
    this.setState(this.initialState())
  }

  updateWord = () => {
    const currentGuessState = this.state.currentGuessState;
    for (let x in currentGuessState) {
      currentGuessState[x]['letter'] = this.state.currentGuess[x]
    }
    this.setState({
      gameStarted: true,
      currentGuessState: currentGuessState
    })
  }

  setGuessState = (order, state, letter) => {
    const newGuessState = this.state.currentGuessState;
    newGuessState[order].state = state;
    newGuessState[order].letter = letter;
    this.setState({
      currentGuessState: newGuessState
    })
  }

  onNextClick = () => {
    if (!this.state.gameStarted) this.updateWord();
    if (this.checkWinCondition()) {
      this.setState({won: true});
      return;
    }
    let absentLetters = this.state.absentLetters;
    for (let x in this.state.currentGuessState) {
      if (this.state.currentGuessState[x]['state'] == 'absent') {
        absentLetters[(this.state.currentGuessState[x]['letter'])] = null;
      }
    }
    this.setState({
      absentLetters: absentLetters
    },
    function() {
      this.filterGuesses();
      this.resetLetters();
    });
  }

  resetLetters = () => {
    this.setState({
      currentGuessState: this.state.currentGuessState.filter((x) => {
        if (x.state == 'correct') return x.state
        else return x.state = letterStates[0]
      })
    })
  }

  filterGuesses = () => {
    let filteredList = []

    filteredList = this.filterCorrectLetters()
    this.setState({
        guessList: filteredList
      },
      this.selectGuess
      );
  }

  filterCorrectLetters = () => {
    const greenLetters = {};
    const yellowLetters = {};
    const filteredList = [];
    let guessList = this.state.guessList;

    const isLetterInWord = (word) => {
      for (let letter of word) {
        if (
          letter in this.state.absentLetters &&
          !greenLetters[letter]
          && !yellowLetters[letter]
        ) {
          return true;
        }
      } return false;
    }

    const greenLettersValidated = (word) => {
      for (const [key, value] of Object.entries(greenLetters)) {
        if (word[value] != key) return false;
      } return true;
    }

    const yellowLettersValidated = (word) => {
      for (const [key, value] of Object.entries(yellowLetters)) {
        if (key && (word[value] == key || !word.includes(key))) return false;
      } return true;
    }

    // Add green / yellow letter objects
    for (let [i, x] of this.state.currentGuessState.entries()) {
      if (x.state == 'present') {
        yellowLetters[x.letter] = i;
      } else if (x.state == 'correct') {
        greenLetters[x.letter] = i;
      }
    }

    // Remove absent letters
    guessList = guessList.filter((x) => {
      if (!isLetterInWord(x)) return x;
    })

    // Check for yellow and green letters
    for (let word of guessList) {
      if (greenLettersValidated(word) && yellowLettersValidated(word)) filteredList.push(word);
    }
    console.log('Remaining words', filteredList);
    return filteredList;
  }


  selectGuess = () => {
    const guess = Math.floor(Math.random() * this.state.guessList.length)
    if (this.state.guessList.length == 0) return;
    this.setState({
      currentGuess: this.state.guessList[guess],
      numberOfGuesses: this.state.numberOfGuesses + 1
    },
    this.updateWord
    );
  }


  generateLetterBox = (num) => {
    return (
      <div className="grid-item">
        <Letter
          value={this.state.currentGuess[num]}
          order={num}
          onClick={this.setGuessState}
          state={this.state.currentGuessState[num]['state']}
        />
      </div>
    );
  }

  renderNextButton = () => {
    return (
      <button
      className='submit-button'
      onClick={()=>this.onNextClick()}
      >
        Next
      </button>
    )
  }

  checkWinCondition = () => {
    for (let x of this.state.currentGuessState) {
      if (x.state !== 'correct') return false
    } return true;
  }

  winMessage = () => {
    return(
      <div className="winning-message">
          Woohoo! I got it in {this.state.numberOfGuesses} guesses! :)
      </div>
    )
  }
  errorMessage = () => {
    return(
      <div className="error-message">
          Uh oh. There are no other valid guesses in my database :(
      </div>
    )
  }

  render() {
    console.log('check win condition', this.state.guessList)
    return (
      <div className='container'>
        <div className="guess-container">
          {this.generateLetterBox(0)}
          {this.generateLetterBox(1)}
          {this.generateLetterBox(2)}
          {this.generateLetterBox(3)}
          {this.generateLetterBox(4)}
        </div>
        <div className='guess-count'>
          Guesses: {this.state.numberOfGuesses}
        </div>
        {this.state.guessList.length == 0
          ? this.errorMessage()
          : this.state.won
          ? this.winMessage()
          : this.renderNextButton()}
        <br />
        <button
          className='reset-button'
          onClick={()=>this.reset()}
        >
          Reset
        </button>
      </div>

    );
  }
}

export default GuessContainer;
