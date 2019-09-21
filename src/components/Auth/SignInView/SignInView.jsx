import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";

import {handleSigningIn} from "../../../services/authentication";

import '../Auth.css';
import '../../../assets/logo192.png';

class SignInView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            redirect: false
        };

        this.signIn = this.signIn.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    signIn = (e) => {
        e.preventDefault();
        handleSigningIn(this.state.email, this.state.password)
            .then(() => this.setState({redirect: true}));
    };

    handleEmailChange = (e) => this.setState({email: e.target.value});

    handlePasswordChange = (e) => this.setState({password: e.target.value});

    render() {
        if (this.state.redirect) {
            return <Redirect to="/models" />;
        } else {
            return (
                <form className="form-auth">
                    <Link to="/">
                        <img className="mb-4" src="logo192.png" alt="" width="72" height="72" />
                    </Link>
                    <h1 className="h3 mb-3 font-weight-normal">Вход</h1>
                    <input onChange={this.handleEmailChange} type="email" className="form-control" placeholder="Электронная почта" required autoFocus />
                    <input onChange={this.handlePasswordChange} type="password" className="form-control" placeholder="Пароль" required />
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" value="remember-me" /> Запомнить меня
                        </label>
                    </div>
                    <Link to="/signup" className="link">Нет аккаунта? Зарегистрируйся!</Link>
                    <button onClick={this.signIn} className="btn btn-lg btn-primary btn-block" type="submit">Войти</button>
                    <p className="mt-5 mb-3 text-muted">© 2019-{new Date().getFullYear()}</p>
                </form>
            );
        }
    }
}

export default SignInView;
