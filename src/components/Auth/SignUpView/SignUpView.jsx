import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";

import {handleSigningUp} from "../../../services/authentication";

import '../Auth.css';

class SignUpView extends Component {
    state = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        redirect: false
    };

    handleFirstNameChange = (e) => this.setState({firstName: e.target.value});

    handleLastNameChange = (e) => this.setState({lastName: e.target.value});

    handleEmailChange = (e) => this.setState({email: e.target.value});

    handlePasswordChange = (e) => this.setState({password: e.target.value});

    signUp = (e) => {
        e.preventDefault();
        handleSigningUp(this.state.firstName, this.state.lastName, this.state.email, this.state.password)
            .then(() => this.setState({redirect: true}));
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to="/models" />;
        } else {
            return (
                <form className="form-auth">
                    <Link to="/">
                        <img className="mb-4" src="../../../images/logo192.png" alt="" width="72" height="72" />
                    </Link>
                    <h1 className="h3 mb-3 font-weight-normal">Регистрация</h1>
                    <input onChange={this.handleEmailChange} type="email" className="form-control" placeholder="Электронная почта" required autoFocus />
                    <input onChange={this.handleFirstNameChange} type="text" className="form-control" placeholder="Имя" required />
                    <input onChange={this.handleLastNameChange} type="text" className="form-control" placeholder="Фамилия" required />
                    <input onChange={this.handlePasswordChange} type="password" className="form-control" placeholder="Пароль" required />
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" value="remember-me" /> Запомнить меня
                        </label>
                    </div>
                    <Link to="/login" className="link">Уже есть аккаунт? Войди!</Link>
                    <button onClick={this.signUp} className="btn btn-lg btn-primary btn-block" type="submit">Зарегистрироваться</button>
                    <p className="mt-5 mb-3 text-muted">© 2019-{new Date().getFullYear()}</p>
                </form>
            );
        }
    }
}

export default SignUpView;
