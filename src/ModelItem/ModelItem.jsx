import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import img from '../reducer.jpg'

const styles = theme => ({
    card: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
    content: {
        textAlign: 'left'
    }
});

class ModelItem extends Component {
    constructor(props) {
        super(props);

        this.handleModelClick = this.handleModelClick.bind(this);
    }

    handleModelClick() {
        console.log(this.props);
        window.location.href = 'http://127.0.0.1:4000/models/' + Number(this.props.id).toString() + '?token=' + this.props.token;
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Card className={classes.card}>
                    <CardActionArea onClick={this.handleModelClick}>
                        <CardMedia
                            className={classes.media}
                            image={img}
                            title="Contemplative Reptile"
                        />
                        <CardContent style={{height: '100px'}} className={classes.content}>
                            <Typography gutterBottom variant="h5" component="h2">{this.props.title}</Typography>
                            <Typography variant="body2" color="textSecondary" component="p">{this.props.desc}</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </div>
        );
    }
}

export default withStyles(styles)(ModelItem);