import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";

import { handleSigningUp } from "../../../services/authentication";
import $ from "jquery";
import '../Auth.css';

class SignUpView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            redirect: false,

            //Validation parametres
            formErrors: { email: '', password: '' },
            emailValid: false,
            passwordValid: false,
            lastNameValid: false,
            firstNameValid: false,
            formValid: false,
            hasError: {
                border: '1px solid red'
            }
        };
        $('[data-toggle="popover"]').popover({
            html: true
        })
    }

    signUp = (e) => {
        e.preventDefault();
        $('#popEmail').popover('show');
        $('#popPassword').popover('show');
        $('#popLastName').popover('show');
        $('#popFirstName').popover('show');
        if (this.state.formValid) {
            e.preventDefault();
            handleSigningUp(this.state.firstName, this.state.lastName, this.state.email, this.state.password)
                .then(() => this.setState({ redirect: true }));
        }

    };

    //Validation functions

    handleUserInput = (e) => {

        const name = e.target.name;
        const value = e.target.value;
        this.setState({ [name]: value },
            () => { this.validateField(name, value) });
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;
        let firstNameValid = this.state.firstNameValid;
        let lastNameValid = this.state.lastNameValid;

        switch (fieldName) {
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                break;
            case 'password':
                passwordValid = value.length >= 6;
                break;
            case 'firstName':
                firstNameValid = value.length >= 3;
                break;
            case 'lastName':
                lastNameValid = value.length >= 3;
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            emailValid: emailValid,
            passwordValid: passwordValid,
            lastNameValid: firstNameValid,
            firstNameValid: lastNameValid,
        }, this.validateForm);
    }
    validateForm() {
        this.setState({
            formValid: this.state.emailValid &&
                this.state.passwordValid &&
                this.state.lastNameValid &&
                this.state.firstNameValid
        });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/models" />;
        }
        else {
            return (
                <form className="form-auth">
                    <Link to="/">
                        <img className="mb-4" src="../../../images/logo192.png" alt="" width="72" height="72" />
                    </Link>
                    <h1 className="h3 mb-3 font-weight-normal">Регистрация</h1>
                    {/* Поле name для создание единого метода handleUserInput */}

                    <input
                        onChange={this.handleUserInput}
                        type="email" name="email"
                        className="form-control"
                        //className={`form-control ${this.state.emailValid ? 'blank' : 'has-error'}`}
                        placeholder="Электронная почта"
                        required
                        autoFocus
                        data-placement="right"
                        data-content="Введите корректный Email"
                        id="popEmail" 
                    />
                    <input
                        onChange={this.handleUserInput}
                        id="validationTooltip01"
                        type="text" 
                        name="firstName"
                        className="form-control"
                        placeholder="Имя"
                        required
                        data-placement="right"
                        //title="Пожалуйста, укажите Ваше имя и фамилию"
                        //data-content="Чтобы облегчить общение и поиск друзей, у нас приняты настоящие имена и фамилии"
                        data-content="ИМЯ СОБАКА"
                        id="popFirstName" 
                    />
                    <input
                        onChange={this.handleUserInput}
                        type="text"
                        name="lastName"
                        className="form-control"
                        placeholder="Фамилия"
                        required 
                        data-placement="right"
                        data-content="Фамилия не фамилия"
                        id="popLastName" 
                        />
                    <input
                        onChange={this.handleUserInput}
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Пароль"
                        required 
                        data-placement="right"
                        data-content="Мудак"
                        id="popPassword" 
                        />

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
