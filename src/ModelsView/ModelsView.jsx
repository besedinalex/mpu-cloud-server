import React, { Component } from 'react';

import axios from 'axios';
import { BrowserRouter as Router, Redirect, Route, Link } from "react-router-dom";
import ModelItem from '../ModelItem/ModelItem';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import $ from "jquery";

class ModelsView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            models: [],
            isDiaglogOpen: false,
            title: '',
            desc: '',
            filename: '',
            isUploaded: false
        }

        this.fileInput = React.createRef();

        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.handleOpenDialog = this.handleOpenDialog.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.handleUpload = this.handleUpload.bind(this)
        this.handleFileSelection = this.handleFileSelection.bind(this)

    }

    componentDidMount() {
        axios.get(`http://127.0.0.1:4000/models?token=${this.props.token}`).then(res => {
            console.log(res.data)
            this.setState({ models: res.data.reverse() })
        })
    }

    handleCloseDialog() {
        this.setState({ isDiaglogOpen: false })
    }

    handleOpenDialog() {
        this.setState({ isDiaglogOpen: true })
    }

    handleTitleChange(e) {
        this.setState({ title: e.target.value })
    }

    handleDescChange(e) {
        this.setState({ desc: e.target.value })
    }

    handleFileSelection() {
        console.log(this.fileInput.current.files)
        if (this.fileInput.current.files) this.setState({ filename: this.fileInput.current.files[0].name });
    }

    handleUpload() {
        this.setState({ isUploaded: true })
        console.log(this.fileInput, this.state)
        let bodyFormData = new FormData();

        bodyFormData.append('title', this.state.title)
        bodyFormData.append('desc', this.state.desc)
        bodyFormData.append('model', this.fileInput.current.files[0]);

        for (var pair of bodyFormData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        axios({
            method: 'post',
            url: `http://127.0.0.1:4000/models?token=${this.props.token}`,
            data: bodyFormData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
            .then(res => {
                //handle success
                console.log(res.data);
            
                this.setState(prev => ({
                    isUploaded: false, isDiaglogOpen: false, models: [res.data, ...prev.models]
                }));
                $('#exampleModal').modal('hide')
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
    }

    handleLogOut() {
        localStorage.removeItem('session');
        window.location.reload();
    }

    render() {
        console.log(this.state.isDiaglogOpen)

        const modelCells = this.state.models.map(model => {
            console.log(model)
            return (
                <ModelItem
                    id={model.model_id}
                    token={this.props.token}
                    filename={model.filename}
                    type={model.type}
                    sizeKB={model.sizeKB}
                    createdTime={model.createdTime}>
                </ModelItem>
            );
        })

        return (
            <div>
                <div hidden={!this.state.isDiaglogOpen} class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Добавить модель</h5>
                                <button  onClick={this.handleCloseDialog} type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="input-group" style={{ marginBottom: '16px' }}>
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="">Название</span>
                                    </div>
                                    <input name="author" type="text" class="form-control" onChange={this.handleTitleChange} required />
                                </div>
                                <div class="form-group" style={{ textAlign: 'left' }} >
                                    <label style={{ textAlign: 'left' }} for="exampleFormControlTextarea1">Описание</label>
                                    <textarea name="desc" class="form-control" id="exampleFormControlTextarea1" rows="5" onChange={this.handleDescChange} required></textarea>
                                </div>
                                <div class="custom-file">
                                    <div class="input-group">
                                        <div class="custom-file">
                                            <input ref={this.fileInput} class="custom-file-input" name="model" id="inputGroupFile04" type="file" required="" />
                                                <label style={{ textAlign: 'left' }}  class="custom-file-label" for="inputGroupFile04">Выберете файл</label>
									</div>

                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button onClick={this.handleCloseDialog} type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
                                    {this.state.isUploaded ? <button class="btn btn-primary" type="button" disabled>
  <span style={{marginRight: '8px'}} class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Загрузка...
</button> : <button type="button" class="btn btn-primary" onClick={this.handleUpload}>Отправить</button>}
                                    
                                </div>
                            </div>
                        </div>
                    </div>


                    <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ marginBottom: 24 + 'px' }}>
                        <div className="container">
                            <a className="navbar-brand" href="/">MPU Cloud</a>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                                <div className="navbar-nav">
                                    <Link className="nav-item nav-link" to="/models">Модели</Link>
                                    <Link className="nav-item nav-link" to="/learn">Руководства</Link>
                                    <Link className="nav-item nav-link" to="/profile">Профиль</Link>

                                </div>
                                <span style={{ marginLeft: 'auto' }} class="navbar-text"><button type="button" onClick={this.handleLogOut} className="btn btn-link">Выход</button></span>
                            </div>
                        </div>
                    </nav>

                    <div className="container">
                        <div style={{ marginBottom: 20 + 'px', display: 'flex', justifyContent: 'space-between' }}>
                            <h3>Мои модели</h3>
                            <button style={{height: '42px'}} onClick={this.handleOpenDialog} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                                Добавить
</button>
                        </div>
                        <table className="table">
                            {modelCells}
                        </table>

                    </div>
                </div>
                );
            }
        }
        
export default ModelsView;