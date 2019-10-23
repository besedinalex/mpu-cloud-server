import React, {Component} from 'react';

import {token} from "../../services/authentication";

class ModelView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modelId: Number(this.props.match.params.id),
            groupId: Number(this.props.location.search.split("?groupId=")[1])
        };

        this.viewer = window.MPUCloudViewer;
    }

    componentDidMount = () => this.viewer.init({
        viewerToken: token,
        modelToken: this.state.modelId,
        groupId: this.state.groupId
    });

    componentWillUnmount = () => this.viewer.destruct();

    render() {
        return (
            <div id="mpu-cloud-viewer"/>
        );
    }
}

export default ModelView;