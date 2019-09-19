import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {isAuthenticated, token, handleAuthentication} from "./services/authentication";

import SignUpView from './components/SignUpView'
import SignInView from './components/SignInView'
import ModelsView from './components/ModelsView'
import ModelView from './components/ModelView'
import LandingView from "./components/LandingView";
import { BrowserRouter as Router, Redirect, Route, Link } from "react-router-dom";
import 'jquery';
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

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

    this.state = {
        isAuthenticated: isAuthenticated,
        token: token
    };

    this.handleAuth = this.handleAuth.bind(this)
  }

  handleAuth(session) {
    handleAuthentication(session);
    this.setState({
      isAuthenticated: true,
      token: session.token
    })
  }

  render() {
    console.log(this.state);
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={LandingView}/>
          <Route path="/login" render={props => <SignInView onAuthenticated={this.handleAuth} {...props} />} />
          <Route path="/signup" render={props => <SignUpView onAuthenticated={this.handleAuth} {...props} />} />
          <PrivateRoute exact path="/models" component={ModelsView} token={this.state.token} isAuthenticated={this.state.isAuthenticated} />
          <PrivateRoute exact path="/models/:id" component={ModelView} token={this.state.token} isAuthenticated={this.state.isAuthenticated} />
        </div>
      </Router>
    );
  }
}

export default App;
