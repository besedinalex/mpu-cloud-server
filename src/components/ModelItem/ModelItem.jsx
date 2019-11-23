import React, { Component } from "react";
import { Redirect } from 'react-router-dom';

import { serverURL } from "../../services/server-url";
import { token } from "../../services/authentication";
import { deleteModel } from "../../services/models";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCloudDownloadAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import $ from "jquery";
import "./ModelItem.css";
import DropDown from "../DropDown";

class ModelItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMouseOver: false,
            redirect: false,
            isDownloadClicked: false,
            format:""
        };
    }

    handleModelClick = () => this.setState({ redirect: true });

    //window.location.href = `${serverURL}/model/original/${this.props.id}?token=${token}&groupId=${this.props.groupId}&format=${this.props.type}`;

    handleRemoveClick = () => deleteModel(this.props.id).then(() => window.location.reload());

    handleMouseOver = () => this.setState({ isMouseOver: true });

    handleMouseOut = () => this.setState({ isMouseOver: false });

    handleClose = () => {
        this.setState({ isDownloadClicked: false });
        console.log(this.state.isDownloadClicked);
    }
    handleDownloadClick = () => {
        if (this.state.isDownloadClicked) {
            this.setState({ isDownloadClicked: false });
        }
        else{
            this.setState({ isDownloadClicked: true });
        }
        
    }

    handleMouseLeave = () => {
        this.setState({ isDownloadClicked: false });
    }

    updateFormatData = (value) => {
        window.location.href = `${serverURL}/model/original/${this.props.id}?token=${token}&groupId=${this.props.groupId}&format=${value}`;
    }

    render() {
        if (this.state.redirect) {
            const groupParam = this.props.groupId !== undefined ? `?groupId=${this.props.groupId}` : '';
            return <Redirect to={`/model/${this.props.id}${groupParam}`} />;
        }
        return (
            <tr onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} onMouseLeave={this.handleMouseLeave}>
                <td onClick={this.handleModelClick} className="filename">
                    <img
                        src="https://image.flaticon.com/icons/svg/337/337926.svg"
                        style={{ position: "relative", right: "5px" }}
                        width="35px"
                        alt=""
                    />
                    {this.props.filename}
                </td>
                <td className="tools" style={{ width: "130px" }}>
                    <div className="icons" hidden={!this.state.isMouseOver}>
                        <FontAwesomeIcon onClick={this.handleModelClick} className="tool" icon={faEye} />
                        <FontAwesomeIcon onClick={this.handleDownloadClick} id="ref" className="tool download dropdown-toggle" icon={faCloudDownloadAlt} />
                        <div hidden={!this.state.isDownloadClicked} onMouseLeave={this.handleMouseLeave}>
                            <DropDown updateFormatData={this.updateFormatData}/>
                        </div>
                        <FontAwesomeIcon onClick={this.handleRemoveClick} className="tool trash" icon={faTrash} />
                    </div>
                </td>
                {this.props.groupModels ? <td>{this.props.name}</td> : null}
                <td>{this.props.type}</td>
                <td>{this.props.sizeKB + " KB"}</td>
                <td>{this.props.createdTime}</td>
            </tr>

        );
    }
}

export default ModelItem;
