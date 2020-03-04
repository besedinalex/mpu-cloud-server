import React, {Component} from 'react';
import {serverURL} from '../../../services/server-url';
import {token} from "../../../services/authentication";
import './pdf-viewer-view.css';

export default class PDFViewerView extends Component {
    constructor(props) {
        super(props);

        const fileId = Number(this.props.match.params.id);
        const groupId = Number(this.props.location.search.split("?groupId=")[1]);
        this.source = `${serverURL}/file/view/${fileId}?token=${token}&groupId=${groupId}&format=pdf`;

        this.state = {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    onWindowResize = () => {
        this.setState({
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        });
    };

    render() {
        return (
            <iframe
                src={this.source} className={'pdf-viewer'}
                width={this.state.windowWidth} height={this.state.windowHeight}
            />
        );
    }
}
