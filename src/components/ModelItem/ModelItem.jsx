import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faCloudDownloadAlt, faTrash } from '@fortawesome/free-solid-svg-icons'

import './ModelItem.css'
import Axios from 'axios';

class ModelItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMouseOver: false
        }
        this.handleModelClick = this.handleModelClick.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleDownloadClick = this.handleDownloadClick.bind(this);
        this.handleRemoveClick = this.handleRemoveClick.bind(this);
    }

    handleModelClick() {
        console.log(this.props);
        window.location.href = 'http://127.0.0.1:4000/view?id=' + Number(this.props.id).toString() + '&token=' + this.props.token;
    }

    handleDownloadClick() {
        window.location.href = 'http://127.0.0.1:4000/model/original/' + Number(this.props.id).toString() + '?token=' + this.props.token;
    }

    handleRemoveClick() {
        Axios.delete(`http://127.0.0.1:4000/model/${this.props.id}?token=${this.props.token}`).then(res => {
            this.props.onModelRemoved({ id: this.props.id, deleted: res.data.deleted })
        })
    }

    handleMouseOver(e) {
        this.setState({ isMouseOver: true })
    }

    handleMouseOut(e) {
        this.setState({ isMouseOver: false })
    }

    render() {
        return (
            <tr onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
                 

                 
                
                <td onClick={this.handleModelClick} className="filename">
                <img src="https://cdn3.iconfinder.com/data/icons/ikooni-outline-file-formats/128/files2-48-512.png" style ={{position:"relative"}} width = "35px" alt=""/>
                {this.props.filename}
                </td>
                

                <td className="tools" style={{ width: '120px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }} hidden={!this.state.isMouseOver}>
                        <FontAwesomeIcon onClick={this.handleModelClick} className="tool" icon={faEye} />
                        <FontAwesomeIcon onClick={this.handleDownloadClick} className="tool download" icon={faCloudDownloadAlt} />
                        <FontAwesomeIcon onClick={this.handleRemoveClick} className="tool trash" icon={faTrash} />
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
