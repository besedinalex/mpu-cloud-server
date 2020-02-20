import React, {Component} from 'react';
import {serverURL} from '../../services/server-url';
import {token} from "../../services/authentication";
import './pdf-view.css';

export default class PDFView extends Component {
    render() {
        return (
            <iframe
                src={`${serverURL}/file/view/${Number(this.props.match.params.id)}?token=${token}&format=pdf`}
                width={window.innerWidth} height={window.innerHeight} className={'pdf-viewer'}
            />
        );
    }
}
