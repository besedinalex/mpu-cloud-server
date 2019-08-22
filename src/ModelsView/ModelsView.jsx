import React, { Component } from 'react';

import ModelItem from '../ModelItem'
import { Grid, Container, Fab, AppBar, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';

const styles = theme => ({
    '@global': {
        body: {

        }
    },
    grid: {
        padding: theme.spacing(3)
    },
    fab: {
        margin: theme.spacing(1),
        position: 'absolute',
        bottom: theme.spacing(5),
        right: theme.spacing(10),
    },
    title: {
        flexGrow: 1,
    },
});

class ModelsView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            models: []
        }
    }

    componentDidMount() {
        axios.get(`http://127.0.0.1:4000/models?token=${this.props.token}`).then(res => {
            this.setState({ models: res.data })
        })
    }

    render() {
        const { classes } = this.props;

        const modelItems = this.state.models.map(model => {
            return (<Grid item xs={12} md={4}>
                <ModelItem title={model.title} desc={model.desc}></ModelItem>
            </Grid>);
        })

        return (
            <div>
                <AppBar className={classes.title} color='primary' position='static'>
                    <Typography variant="h6">Модели</Typography>
                </AppBar>
                <Container maxWidth='md'>
                    <Grid className={classes.grid} container spacing={3}>
                        {modelItems}
                    </Grid>
                    <Fab color="primary" className={classes.fab}>
                        <AddIcon />
                    </Fab>
                </Container>
            </div>
        );
    }
}

export default withStyles(styles)(ModelsView);