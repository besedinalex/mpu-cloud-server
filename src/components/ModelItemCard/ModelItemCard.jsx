import React, { Component } from "react";
import { Redirect } from 'react-router-dom';

import { serverURL } from "../../services/server-url";
import { token } from "../../services/authentication";
import { deleteFile } from "../../services/files";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faCloudDownloadAlt, faTrash } from "@fortawesome/free-solid-svg-icons";

import "./ModelItemCard.css";
import DropDown from "../DropDown";

class ModelItemCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMouseOver: false,
            redirect: false,
            img: `${serverURL}/preview/${this.props.preview}`,
            isDownloadClicked: false,
            format:""
        };
    }

    handleModelClick = (e) => {
        e.preventDefault();
        this.setState({ redirect: true });
    }

   // handleDownloadClick = (e) =>{
  //      e.preventDefault();
       
  //  }
       // window.location.href = `${serverURL}/model/original/${this.props.id}?token=${token}&groupId=${this.props.groupId}&format=${this.props.type}`;

    handleRemoveClick = () => deleteFile(this.props.id).then(() => window.location.reload());

    handleMouseOver = () => this.setState({ isMouseOver: true });

    handleMouseOut = () => this.setState({ isMouseOver: false });

    handleClose = () => {
        this.setState({ isDownloadClicked: false });
        console.log(this.state.isDownloadClicked);
    }
    handleDownloadClick = (e) => {
        e.preventDefault();
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
        window.location.href = `${serverURL}/user-model/original/${this.props.id}?token=${token}&groupId=${this.props.groupId}&format=${value}`;
    }

    render() {
        if (this.state.redirect) {
            const groupParam = this.props.groupId !== undefined ? `?groupId=${this.props.groupId}` : '';
            return <Redirect to={`/model/${this.props.id}${groupParam}`} />;
        }
        return (
            <div className="card mt-3" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} onMouseLeave={this.handleMouseLeave}>
                <img src= {this.state.img} className="card-img-top" onClick = {this.handleModelClick}/>
                <div className="icons-spacing tools" hidden={!this.state.isMouseOver}> 
                    <FontAwesomeIcon transform="grow-5" onClick={this.handleDownloadClick} icon={faCloudDownloadAlt} className="tool download sp-color" />
                    <div hidden={!this.state.isDownloadClicked} onMouseLeave={this.handleMouseLeave}>
                            <DropDown updateFormatData={this.updateFormatData}/>
                    </div>
                    <FontAwesomeIcon transform="grow-5" onClick={this.handleRemoveClick} className="tool trash sp-color" icon={faTrash} />
                </div>
                <div className="c-body">
                    <FontAwesomeIcon icon={faFolder} transform="grow-2"/><h6>{this.props.filename}</h6>
                  </div>
            </div>

        );
    }
}

export default ModelItemCard;
