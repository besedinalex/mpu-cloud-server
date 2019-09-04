import React, { Component } from 'react';

import ModelItem from '../ModelItem'
import { Toolbar, Grid, Container, Fab, AppBar, Typography, Button, DialogActions, Dialog, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';


const styles = theme => ({
    '@global': {
        body: {
            background: '#eceff1'
        }
    },
    grid: {
        padding: theme.spacing(2)
    },
    fab: {
        margin: theme.spacing(1),
        position: 'absolute',
        bottom: theme.spacing(5),
        right: theme.spacing(10),
    },
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },

});

class ModelsView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            models: [],
            isDiaglogOpen: false,
            title: '',
            desc: '',
            filename: '',
            isUploaded: false
        }

        this.fileInput = React.createRef();

        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.handleOpenDialog = this.handleOpenDialog.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.handleUpload = this.handleUpload.bind(this)
        this.handleFileSelection = this.handleFileSelection.bind(this)

    }

    componentDidMount() {
        axios.get(`http://127.0.0.1:4000/models?token=${this.props.token}`).then(res => {
            this.setState({ models: res.data.reverse() })
        })
    }

    handleCloseDialog() {
        this.setState({ isDiaglogOpen: false })
    }

    handleOpenDialog() {
        this.setState({ isDiaglogOpen: true })
    }

    handleTitleChange(e) {
        this.setState({ title: e.target.value })
    }

    handleDescChange(e) {
        this.setState({ desc: e.target.value })
    }

    handleFileSelection() {
        console.log(this.fileInput.current.files)
        if (this.fileInput.current.files) this.setState({ filename: this.fileInput.current.files[0].name });
    }

    handleUpload() {
        this.setState({isUploaded: true})
        console.log(this.fileInput, this.state)
        let bodyFormData = new FormData();

        bodyFormData.append('title', this.state.title)
        bodyFormData.append('desc', this.state.desc)
        bodyFormData.append('model', this.fileInput.current.files[0]);

        for (var pair of bodyFormData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        axios({
            method: 'post',
            url: `http://127.0.0.1:4000/models?token=${this.props.token}`,
            data: bodyFormData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
            .then(res => {
                //handle success
                console.log(res.data.model_id)
                this.setState(prev => ({
                    isUploaded: false, isDiaglogOpen: false, models: [{ id_model: res.data.model_id, title: prev.title, desc: prev.desc }, ...prev.models]
                }));
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });

    }

    handleLogOut() {
        localStorage.removeItem('session');
        window.location.reload();
    }

    render() {
        console.log(this.state.isDiaglogOpen)
        const { classes } = this.props;

        const modelItems = this.state.models.map(model => {
            return (<Grid item xs={12} md={4}>
                <ModelItem token={this.props.token} title={model.title} desc={model.desc} id={model.id_model}></ModelItem>
            </Grid>);
        })

        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Облако Политеха
          </Typography>
                        <Button color="inherit" onClick={this.handleLogOut}>Выход</Button>
                    </Toolbar>
                </AppBar>
                <Container maxWidth='md'>
                    <Grid className={classes.grid} container spacing={3}>
                        {modelItems}
                    </Grid>
                    <Fab color="primary" className={classes.fab} onClick={this.handleOpenDialog}>
                        <AddIcon />
                    </Fab>
                </Container>
                <Dialog onClose={this.handleCloseDialog} open={this.state.isDiaglogOpen}>
                    <DialogTitle id="customized-dialog-title" onClose={this.handleCloseDialog}>
                        Новая модель
        </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} container direction="column">
                            <Grid item>
                                <TextField fullWidth={true} label="Название" id="title" value={this.state.title} onChange={this.handleTitleChange} required /></Grid>
                            <Grid item>
                                <TextField fullWidth={true} label="Описание" id="desc" value={this.state.desc} onChange={this.handleDescChange} required />
                            </Grid>
                            <Grid item>
                                <input style={{ display: 'none' }} id="contained-button-file" type="file" ref={this.fileInput} onChange={this.handleFileSelection} />
                                <label htmlFor="contained-button-file">
                                    <Button size='small' variant="contained" component="span" className={classes.button} >
                                        Выбрать файл
        </Button>
                                    <Typography style={{ marginLeft: 12 + 'px' }} variant="p">{this.state.filename !== '' ? this.state.filename : 'Файл не выбран'}</Typography>

                                </label>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        {!this.state.isUploaded ?
                            <Button onClick={this.handleUpload} color="primary">
                                Отправить
      </Button> : <Button onClick={this.handleUpload} color="primary" disabled >
      <CircularProgress size={24} style={{marginRight: '12px'}} />
                                Загрузка..
          </Button>
                        }
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(ModelsView);