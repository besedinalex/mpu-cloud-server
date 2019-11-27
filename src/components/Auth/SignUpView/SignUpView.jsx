import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";

import { handleSigningUp } from "../../../services/authentication";
import $ from "jquery";
import '../Auth.css';
import Cloud from "../../../images/cloud-computing.svg";

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
            },
            isValidated: false,
            popovers: [
                'email',
                'firstName',
                'lastName',
                'password'
            ]
        };
        $('[data-toggle="popover"]').popover({
            html: true
        })
    }

    signUp = (e) => {
        e.preventDefault();
        this.setState({
            isValidated: true
        });
        if (this.state.formValid) {
            this.closeAllPopovers();
            e.preventDefault();
            handleSigningUp(this.state.firstName, this.state.lastName, this.state.email, this.state.password)
                .then(() => this.setState({ redirect: true }));
        }
        this.setFocus();
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

        // (?=.*[0-9]) - строка содержит хотя бы одно число;
        // (?=.*[!@#$%^&*]) - строка содержит хотя бы один спецсимвол;
        // (?=.*[a-z]) - строка содержит хотя бы одну латинскую букву в нижнем регистре;
        // (?=.*[A-Z]) - строка содержит хотя бы одну латинскую букву в верхнем регистре;
        // [0-9a-zA-Z!@#$%^&*]{6,} - строка состоит не менее, чем из 6 вышеупомянутых символов.

        //Имена только на кириллице 
        switch (fieldName) {
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                break;
            case 'password':
                passwordValid = value.length >= 6;
                break;
            case 'firstName':
                firstNameValid = value.match(/(?=.*[а-я])(?=.*[А-Я])[а-яА-Я]{3,}/g);
                break;
            case 'lastName':
                lastNameValid = value.match(/(?=.*[а-я])(?=.*[А-Я])[а-яА-Я]{3,}/g);
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            emailValid: emailValid,
            passwordValid: passwordValid,
            firstNameValid: firstNameValid,
            lastNameValid: lastNameValid,
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

    //Работа с popovers
    closeAllPopovers = ()=> {
        for (let i = 0; i < this.state.popovers.length; i++) {
             $("#"+this.state.popovers[i]).popover('dispose');
        }
    }

    handleFocus = (e) =>{
        if (this.state.isValidated) {
            const name = e.target.name; 
            for (let i = 0; i < this.state.popovers.length; i++) {
                if(this.state.popovers[i] == name){
                    $("#"+name).popover('show');
                }
                else{
                    $("#"+this.state.popovers[i]).popover('dispose');
                }
            }   
        }
    }

    setFocus = () =>{
        //Hard Codding
        if (!this.state.emailValid) {
            $('#email').focus();
        }
        else if (!this.state.firstNameValid) {
            $('#firstName').focus();
        }
        else if (!this.state.lastNameValid) {
            $('#lastName').focus();
        }
        else if (!this.state.passwordValid) {
            $('#password').focus();
        } 
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/models" />;
        }
        else {
            return (
                <form className="form-auth">
                    <Link to="/" onClick = {this.closeAllPopovers}>
                        <img className="mb-4" src={Cloud} alt="" width="100" />
                    </Link>
                    <h1 className="h3 mb-3 font-weight-normal">Регистрация</h1>
                    {/* Поле name для создание единого метода handleUserInput */}
                    <input
                        onChange={this.handleUserInput}
                        type="email" 
                        name="email"
                        className={`form-control ${(!this.state.firstNameValid && this.state.isValidated) ? 'has-error' : 'blank'}`}
                        placeholder="Электронная почта"
                        required
                        autoFocus
                        onFocus ={this.handleFocus}
                        data-trigger="manual"
                        data-placement="right"
                        data-content="Введите корректный Email"
                        id="email"
                    />
                    <input
                        onChange={this.handleUserInput}
                        id="validationTooltip01"
                        type="text"
                        name="firstName"
                        className={`form-control ${(!this.state.firstNameValid && this.state.isValidated) ? 'has-error' : 'blank'}`}
                        placeholder="Имя"
                        required
                        onFocus ={this.handleFocus}
                        data-trigger="manual"
                        data-placement="left"
                        title="Пожалуйста, укажите Ваше имя и фамилию, используя кириллицу"
                        data-content="Чтобы облегчить общение и поиск друзей, у нас приняты настоящие имена и фамилии"
                        id="firstName"
                    />
                    <input
                        onChange={this.handleUserInput}
                        type="text"
                        name="lastName"
                        className={`form-control ${(!this.state.lastNameValid && this.state.isValidated) ? 'has-error' : 'blank'}`}
                        placeholder="Фамилия"
                        required
                        onFocus ={this.handleFocus}
                        data-trigger="manual"
                        data-placement="right"
                        title="Пожалуйста, укажите Ваше имя и фамилию, используя кириллицу"
                        data-content="Чтобы облегчить общение и поиск друзей, у нас приняты настоящие имена и фамилии"
                        id="lastName"
                    />
                    <input
                        onChange={this.handleUserInput}
                        type="password"
                        name="password"
                        className={`form-control ${(!this.state.passwordValid && this.state.isValidated) ? 'has-error' : 'blank'}`}
                        placeholder="Пароль"
                        required
                        onFocus ={this.handleFocus}
                        data-trigger="manual"
                        data-placement="left"
                        data-content="Ваш пароль должен содержать не менее 6 символов"
                        id="password"
                    />

                    <div className="checkbox">
                        <label>
                            <input type="checkbox" value="remember-me" /> Запомнить меня
                        </label>
                    </div>
                    <Link to="/login" className="link" onClick={this.closeAllPopovers}>Уже есть аккаунт? Войди!</Link>
                    <button onClick={this.signUp} className="btn btn-lg btn-primary btn-block" type="submit">Зарегистрироваться</button>
                    <p className="mt-5 mb-3 text-muted">© 2019-{new Date().getFullYear()}</p>
                </form>
            );
        }
    }
}

export default SignUpView;
