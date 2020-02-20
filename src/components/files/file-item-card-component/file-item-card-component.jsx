import React, {Component} from "react";
import {Redirect} from 'react-router-dom';
import {serverURL} from "../../../services/server-url";
import {token} from "../../../services/authentication";
import {deleteFile} from "../../../services/files";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFolder, faCloudDownloadAlt, faTrash} from "@fortawesome/free-solid-svg-icons";
import "./file-item-card-component.css";
import DropDownComponent from "../../drop-down-component";

export default class FileItemCardComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMouseOver: false,
            redirect: false,
            img: `${serverURL}/file/view/${this.props.id}?token=${token}&format=jpg`,
            isDownloadClicked: false,
            format: ""
        };
    }

    handleModelClick = (e) => {
        e.preventDefault();
        this.setState({redirect: true});
    };

    handleRemoveClick = () => deleteFile(this.props.id).then(() => window.location.reload());

    handleMouseOver = () => this.setState({isMouseOver: true});

    handleMouseOut = () => this.setState({isMouseOver: false});

    handleDownloadClick = (e) => {
        e.preventDefault();
        if (this.state.isDownloadClicked) {
            this.setState({isDownloadClicked: false});
        } else {
            this.setState({isDownloadClicked: true});
        }
    };

    handleMouseLeave = () => this.setState({isDownloadClicked: false});

    updateFormatData = (value) =>
        window.location.href = `${serverURL}/file/original/${this.props.id}?token=${token}&groupId=${this.props.groupId}&format=${value}`;

    render() {
        if (this.state.redirect) {
            const path = this.props.type.toLowerCase() === 'pdf' ? 'document' : 'model';
            const groupParam = this.props.groupId !== undefined ? `?groupId=${this.props.groupId}` : '';
            return <Redirect to={`/${path}/${this.props.id}${groupParam}`} />;
        }
        return (
            <div className="card mt-3" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}
                 onMouseLeave={this.handleMouseLeave}>
                <img src={this.state.img} className="card-img-top" onClick={this.handleModelClick} />
                <div className="icons-spacing tools" hidden={!this.state.isMouseOver}>
                    <FontAwesomeIcon transform="grow-5" onClick={this.handleDownloadClick} icon={faCloudDownloadAlt}
                                     className="tool download sp-color" />
                    <div hidden={!this.state.isDownloadClicked} onMouseLeave={this.handleMouseLeave}>
                        <DropDownComponent updateFormatData={this.updateFormatData} />
                    </div>
                    <FontAwesomeIcon transform="grow-5" onClick={this.handleRemoveClick} className="tool trash sp-color"
                                     icon={faTrash} />
                </div>
                <div className="c-body">
                    <FontAwesomeIcon icon={faFolder} transform="grow-2" /><h6>{this.props.filename}</h6>
                </div>
            </div>
        );
    }
}
