import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faCloudDownloadAlt, faTrash } from '@fortawesome/free-solid-svg-icons'

import './ModelItem.css'

class ModelItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMouseOver: false
        }
        this.handleModelClick = this.handleModelClick.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
    }

    handleModelClick() {
        console.log(this.props);
        window.location.href = 'http://127.0.0.1:4000/view/' + Number(this.props.id).toString() + '?token=' + this.props.token;
    }

    handleMouseOver(e) {
        this.setState({ isMouseOver: true })
    }

    handleMouseOut(e) {
        this.setState({ isMouseOver: false })
    }

    render() {
        console.log(this.state.isMouseOver)

        return (
            <tr onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
                <td className="filename">{this.props.filename}</td>
                <td className="tools" style={{ width: '120px' }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '4px'}} hidden={!this.state.isMouseOver}>
                        <FontAwesomeIcon onClick={this.handleModelClick} className="tool" icon={faEye} />
                        <FontAwesomeIcon className="download" icon={faCloudDownloadAlt} />
                        <FontAwesomeIcon className="trash" icon={faTrash} />
                    </div>
                </td>
                <td>{this.props.type}</td>
                <td>{this.props.sizeKB + ' KB'}</td>
                <td>{new Date(this.props.createdDate).toString()}</td>
            </tr>
        );
    }
}

export default ModelItem;