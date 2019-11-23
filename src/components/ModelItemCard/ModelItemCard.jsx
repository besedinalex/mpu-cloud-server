import React, { Component } from "react";
import { Redirect } from 'react-router-dom';

import { serverURL } from "../../services/server-url";
import { token } from "../../services/authentication";
import { deleteModel } from "../../services/models";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faCloudDownloadAlt, faTrash } from "@fortawesome/free-solid-svg-icons";

import "./ModelItemCard.css";

class ModelItemCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMouseOver: false,
            redirect: false,
            img: "https://sun9-63.userapi.com/c857020/v857020868/4f08b/bsiKjLp__Zw.jpg"
        };
    }

    handleModelClick = () => this.setState({ redirect: true });

    handleDownloadClick = () =>
        window.location.href = `${serverURL}/model/original/${this.props.id}?token=${token}&groupId=${this.props.groupId}&format=${this.props.type}`;

    handleRemoveClick = () => deleteModel(this.props.id).then(() => window.location.reload());

    handleMouseOver = () => this.setState({ isMouseOver: true });

    handleMouseOut = () => this.setState({ isMouseOver: false });

    render() {
        if (this.state.redirect) {
            const groupParam = this.props.groupId !== undefined ? `?groupId=${this.props.groupId}` : '';
            return <Redirect to={`/model/${this.props.id}${groupParam}`} />;
        }
        return (

            <div className="card mt-3" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} onClick = {this.handleModelClick}>
                <img src= {this.state.img} className="card-img-top" />

                <div className="icons-spacing" hidden={!this.state.isMouseOver}>
                    <FontAwesomeIcon transform="grow-5" onClick={this.handleDownloadClick} icon={faCloudDownloadAlt} className="tool download" />
                    <FontAwesomeIcon transform="grow-5" onClick={this.handleRemoveClick} className="tool trash" icon={faTrash} />
                </div>
                <div className="c-body">
                    <FontAwesomeIcon icon={faFolder} transform="grow-2"/><h6>{this.props.filename}</h6>
                  </div>
            </div>

        );
    }
}

export default ModelItemCard;
