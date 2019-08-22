import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'typeface-roboto';

import SignUpView from './SignUpView'
import SignInView from './SignInView'
import ModelsView from './ModelsView'
import { BrowserRouter as Router, Redirect, Route, Link } from "react-router-dom";

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route {...rest} render=
      {
        props => rest.isAuthenticated ? (<Component {...rest} {...props} />) :
          (<Redirect to={{ pathname: "/login", state: { from: props.location } }} />)
      }
    />
  );
}

class App extends Component {
  constructor(props) {
    super(props);

    const session = JSON.parse(localStorage.getItem('session'));

    this.state = {
        isAuthenticated: session !== null && Date.now() <= session.expiresAt,
        token: session !== null ? session['token'] : undefined
    }

    this.handleAuthentication = this.handleAuthentication.bind(this)
  }

  handleAuthentication(session) {
    localStorage.setItem('session', JSON.stringify(session));
    this.setState({
      isAuthenticated: true ,
      token: session.token
    })
  }

  render() {
    console.log(this.state)
    return (
      <Router>
        <div className="App">
          <Route path="/login" render={props => <SignInView onAuthenticated={this.handleAuthentication} {...props} />} />
          <Route path="/signup" render={props => <SignUpView onAuthenticated={this.handleAuthentication} {...props} />} />
          <PrivateRoute path="/models" component={ModelsView} token={this.state.token} isAuthenticated={this.state.isAuthenticated} />
        </div>
      </Router >
    );
  }
}

export default App;
