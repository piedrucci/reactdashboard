import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

import {  Router, Route, Link, browserHistory, IndexRoute } from 'react-router'

import routes from './routes'
import Login from './components/login'

class App extends Component {
  render() {

    return (

      <div >

        {/* <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p> */}

        <Login />

      </div>


    );
  }
}

export default App;
