import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import './HeaderComponent.css';

class HeaderComponent extends Component {
    constructor(props) {
        super(props);

        const session = JSON.parse(localStorage.getItem('session'));

        this.state = {
            isAuthenticated: session !== null && Date.now() <= session.expiresAt
        };
    }

    handleLogOut() {
        localStorage.removeItem('session');
        window.location.reload();
    }

    render() {
        const loggedIn = this.state.isAuthenticated;
        return (
            <header className="navbar navbar-expand-lg py-3 navbar-dark bg-dark fixed-top">
                <Link className="navbar-brand text-white" to="/">MPU Cloud</Link>

                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item" hidden={!loggedIn}>
                            <Link to="/models" className="nav-link">Модели</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/learn" className="nav-link">Руководства</Link>
                        </li>
                        <li className="nav-item" hidden={!loggedIn}>
                            <Link to="/profile" className="nav-link">Профиль</Link>
                        </li>
                        <li className="nav-item" hidden={!loggedIn}>
                            <Link to="/groups" className="nav-link">Группы</Link>
                        </li>
                    </ul>
                    <Link to="/signup" hidden={loggedIn} className="margin-right">
                        <button className="btn btn-info">Регистрация</button>
                    </Link>
                    <Link to="/login" hidden={loggedIn}>
                        <button className="btn btn-light">Войти</button>
                    </Link>
                    <button hidden={!loggedIn} className="btn btn-danger" onClick={this.handleLogOut}>Выйти</button>
                </div>
            </header>
        );
    }
}

export default HeaderComponent;
