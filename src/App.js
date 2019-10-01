import React, {Component} from 'react';
import {BrowserRouter as Router, Link, Redirect, Route, Switch} from "react-router-dom";

import 'jquery';

import {isAuthenticated} from "./services/authentication";

import LandingView from "./components/LandingView";
import SignUpView from './components/Auth/SignUpView';
import SignInView from './components/Auth/SignInView';
import ProfileView from "./components/ProfileView";
import ModelsView from './components/ModelsView';
import GroupsView from "./components/Groups/GroupsView";
import GroupView from "./components/Groups/GroupView";

import './App.css';
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

function PrivateRoute({component: Component, ...rest}) {
    return (
        <Route {...rest}
            render={props => isAuthenticated ? (<Component {...rest} {...props} />) : (<Redirect to="/login" />)}
        />
    );
}

function PublicOnlyRoute({component: Component, ...rest}) {
    return (
        <Route {...rest}
            render={props => isAuthenticated ? (<Redirect to="/models" />) : (<Component {...rest} {...props} />)}
        />
    );
}

function Page404() {
    return (
        <div>
            <h3>Error 404: Page is not found.</h3>
            <h4>
                <Link to="/">Return to landing page.</Link>
            </h4>
        </div>
    );
}

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Switch>
                        <Route exact path="/" component={LandingView} />
                        <Route path="/profile/:id" component={ProfileView} />
                        <PublicOnlyRoute path="/login" component={SignInView} />
                        <PublicOnlyRoute path="/signup" component={SignUpView} />
                        <PrivateRoute path="/models" component={ModelsView} groupModels={false} />
                        <PrivateRoute path="/groups" component={GroupsView} />
                        <PrivateRoute path="/group/:id" component={GroupView} />
                        
                        <Route component={Page404} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
