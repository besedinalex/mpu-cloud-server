import React, {Component} from 'react';

import {token} from "../../services/authentication";

import {MPUCloudViewer} from './mpu-cloud-viewer.min';

class ModelView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modelId: Number(this.props.match.params.id)
        };
    }

    componentDidMount = () => MPUCloudViewer.init(token, this.state.modelId);

    render() {
        console.log(this.props);
        return (
            <div id="mpu-cloud-viewer" />
        );
    }
}

export default ModelView;