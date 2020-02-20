import React, {Component} from 'react';
import {BrowserRouter as Router, Link, Redirect, Route, Switch} from "react-router-dom";
import 'jquery';
import {isAuthenticated} from "./services/authentication";
import LandingView from "./components/landing-view";
import SignUpView from './components/auth-view/sign-up-view';
import SignInView from './components/auth-view/sign-in-view';
import FilesView from './components/files/files-view';
import ModelViewerView from "./components/files/model-viewer-view";
import GroupsView from "./components/groups/groups-view";
import GroupView from "./components/groups/group-view";
import PDFViewerView from './components/files/pdf-viewer-view';
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
                        <PublicOnlyRoute path="/login" component={SignInView} />
                        <PublicOnlyRoute path="/signup" component={SignUpView} />
                        <PrivateRoute path="/files" component={FilesView} />
                        <PrivateRoute path="/model/:id" component={ModelViewerView} />
                        <PrivateRoute path="/document/:id" component={PDFViewerView} />
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
