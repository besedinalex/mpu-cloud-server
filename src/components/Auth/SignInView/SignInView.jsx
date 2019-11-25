import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";

import {handleSigningIn} from "../../../services/authentication";

import Notifications, { notify } from "../../Notifications";

import '../Auth.css';
import Cloud from "../../../images/cloud-computing.svg";
class SignInView extends Component {
    state = {
        email: '',
        password: '',
        redirect: false
    };

    signIn = (e) => {
        e.preventDefault();
        handleSigningIn(this.state.email, this.state.password)
            .then(() => this.setState({redirect: true}))
            .catch(() => notify("Неправильный пароль или email"));
            
    };

    handleEmailChange = (e) => this.setState({email: e.target.value});

    handlePasswordChange = (e) => this.setState({password: e.target.value});

    

    render() {
        if (this.state.redirect) {
            return <Redirect to="/models" />;
        } else {
            return (
                <div>
                <form className="form-auth">
                    <Link to="/">
                        <img className="mb-4" src={Cloud} alt="" width="100" />
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
                <Notifications/>
                </div>
            );
        }
    }
}

export default SignInView;
