import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import './HeaderComponent.css';

class HeaderComponent extends Component {
    constructor(props) {
        super(props);

        const session = JSON.parse(localStorage.getItem('session'));

        this.state = {
            isAuthenticated: session !== null && Date.now() <= session.expiresAt,
            token: session !== null ? session['token'] : undefined
        };

        this.handleAuthentication = this.handleAuthentication.bind(this);
    }

    handleAuthentication(session) {
        localStorage.setItem('session', JSON.stringify(session));
        this.setState({
            isAuthenticated: true ,
            token: session.token
        });
    }

    handleLogOut() {
        localStorage.removeItem('session');
        window.location.reload();
    }

    render() {
        const loggedIn = this.state.isAuthenticated;
        return (
            <header className="navbar navbar-expand-lg py-3 navbar-dark bg-dark fixed-top">
                <Link className="navbar-brand text-white" to="/home">MPU Cloud</Link>

                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/models">Модели</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/learn">Руководства</Link>
                        </li>
                        <li hidden={!loggedIn}>
                            <Link className="nav-link" to="/profile">Профиль</Link>
                        </li>
                    </ul>
                    <Link hidden={loggedIn} className="margin-right-3" to="/signup">
                        <button className="btn btn-info">Регистрация</button>
                    </Link>
                    <Link hidden={loggedIn} to="/login">
                        <button className="btn btn-light">Войти</button>
                    </Link>
                    <button hidden={!loggedIn} className="btn btn-danger" onClick={this.handleLogOut}>Выйти</button>
                </div>
            </header>
        );
    }
}

export default HeaderComponent;
