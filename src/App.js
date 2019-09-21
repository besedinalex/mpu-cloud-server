import React, {Component} from 'react';
import {BrowserRouter as Router, Redirect, Route} from "react-router-dom";

import './App.css';

import {isAuthenticated, token, handleAuthentication} from "./services/authentication";

import SignUpView from './components/SignUpView';
import SignInView from './components/SignInView';
import ModelsView from './components/ModelsView';
import LandingView from "./components/LandingView";
import GroupsView from "./components/GroupsView";
import GroupView from "./components/GroupView";
import HeaderComponent from "./components/HeaderComponent";

import 'jquery';
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

function PrivateRoute({component: Component, ...rest}) {
    return (
        <Route {...rest} render=
            {props =>
                rest.isAuthenticated ?
                    (<Component {...rest} {...props} />) :
                    (<Redirect to={{pathname: "/login", state: {from: props.location}}} />)
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
                    <HeaderComponent/>
                    <Route exact path="/" component={LandingView} />
                    <Route path="/login" render={props => <SignInView onAuthenticated={this.handleAuth} {...props} />} />
                    <Route path="/signup" render={props => <SignUpView onAuthenticated={this.handleAuth} {...props} />} />
                    <PrivateRoute exact path="/groups" component={GroupsView} token={this.state.token} isAuthenticated={this.state.isAuthenticated} />
                    <PrivateRoute path="/group/:id" component={GroupView} token={this.state.token} isAuthenticated={this.state.isAuthenticated} />
                    <PrivateRoute exact path="/models" component={ModelsView} token={this.state.token} isAuthenticated={this.state.isAuthenticated} />
                </div>
            </Router>
            
        );
    }
}

export default App;
