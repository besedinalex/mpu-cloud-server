import React, {Component} from 'react';

// Material UI

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {BrowserRouter as Router, Redirect} from "react-router-dom";


import axios from 'axios';

const styles = theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

class SignUpView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            redirect: false
        }

        this.handleFirstNameCahnge = this.handleFirstNameCahnge.bind(this);
        this.handleLastNameCahnge = this.handleLastNameCahnge.bind(this);
        this.handleEmailCahnge = this.handleEmailCahnge.bind(this);
        this.handlePasswordCahnge = this.handlePasswordCahnge.bind(this);
        this.signUp = this.signUp.bind(this);
    }

    handleFirstNameCahnge(e) {
        this.setState({firstName: e.target.value})
    }

    handleLastNameCahnge(e) {
        this.setState({lastName: e.target.value})
    }

    handleEmailCahnge(e) {
        this.setState({email: e.target.value})
    }

    handlePasswordCahnge(e) {
        this.setState({password: e.target.value})
    }

    signUp(e) {
        e.preventDefault();
        axios.post(`http://127.0.0.1:4000/user?firstName=${this.state.firstName}&lastName=${this.state.lastName}&email=${this.state.email}&password=${this.state.password}`).then(res => {
            console.log(res)
            if (res.status == 200) {
                this.props.onAuthenticated(res.data);
                this.setState({redirect: true});
            }
        })
    }

    render() {
        const {classes} = this.props;

        if (this.state.redirect) {
            return <Redirect to="/secret" />;
        } else {

            return (
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">Регистрация</Typography>
                        <form className={classes.form} noValidate>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="fname"
                                        name="firstName"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="Имя"
                                        onChange={this.handleFirstNameCahnge}
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Фамилия"
                                        name="lastName"
                                        onChange={this.handleLastNameCahnge}
                                        autoComplete="lname"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Эл. Почта"
                                        name="email"
                                        onChange={this.handleEmailCahnge}

                                        autoComplete="email"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Пароль"
                                        type="password"
                                        id="password"
                                        onChange={this.handlePasswordCahnge}
                                        autoComplete="current-password"
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={this.signUp}
                            >
                                Зарегистрироваться
                            </Button>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Link href="/login" variant="body2">
                                        Уже имейте аккаунт? Войти
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Container>
            );
        }
    }

}

export default withStyles(styles)(SignUpView);