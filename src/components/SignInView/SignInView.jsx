import React, { Component } from 'react';
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
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { Redirect } from "react-router-dom";

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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

class SignInView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: 'admin@mpu.com',
            password: '123',
            redirect: false
        }

        this.signIn = this.signIn.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    signIn(e) {
        e.preventDefault();
        axios.get(`http://127.0.0.1:4000/token?email=${this.state.email}&password=${this.state.password}`).then(res => {
            console.log(res);
            if (res.status == 200) {
                this.props.onAuthenticated(res.data);
                this.setState({ redirect: true });
            }
        })
    }

    handleEmailChange(e) {
        this.setState({ email: e.target.value })
    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value })
    }

    render() {
        const { classes } = this.props;

        if (this.state.redirect) {
            return <Redirect to="/models" />;
        } else {
            return (
                <div>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <div className={classes.paper}>
                            <Avatar className={classes.avatar}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">Вход</Typography>
                            <form className={classes.form} noValidate>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Эл. Почта"
                                    name="email"
                                    autoComplete="email"
                                    value={this.state.email}
                                    onChange={this.handleEmailChange}
                                    autoFocus
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Пароль"
                                    type="password"
                                    value={this.state.password}
                                    onChange={this.handlePasswordChange}
                                    id="password"
                                    autoComplete="current-password"
                                />
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Запомнить меня"
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick={this.signIn}
                                >Войти</Button>
                                <Grid container>
                                    <Grid item xs>
                                        <Link href="#" variant="body2">Забыли пароль?</Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="/signup" variant="body2">
                                            {"Нет аккаунта? Регистрация"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </form>
                        </div>

                    </Container>
                </div>
            );
        }
    }
}

export default withStyles(styles)(SignInView);