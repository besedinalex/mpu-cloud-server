import React, { Component } from 'react';

import $ from 'jquery';

import {getUserModels, uploadModel} from "../../services/models";

import HeaderComponent from "../HeaderComponent";
import ModelItem from "../ModelItem/ModelItem";

import "./ModelsView.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";


class ModelsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      models: [],
      isDialogOpen: false,
      title: "",
      desc: "",
      filename: "",
      isUploaded: false
    };

    this.fileInput = React.createRef();

        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.handleOpenDialog = this.handleOpenDialog.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleFileSelection = this.handleFileSelection.bind(this);
        this.handleModelRemoved = this.handleModelRemoved.bind(this);
        this.getModels = this.getModels.bind(this);
    }

    componentDidMount = () => this.getModels();

    getModels = () => getUserModels().then(res => this.setState({ models: res.data.reverse() }));

    handleCloseDialog() {
        this.setState({ isDialogOpen: false });
    }

  handleOpenDialog() {
    this.setState({ isDialogOpen: true });
  }

  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }

  handleDescChange(e) {
    this.setState({ desc: e.target.value });
  }

  handleFileSelection() {
    console.log(this.fileInput.current.files);
    if (this.fileInput.current.files)
      this.setState({ filename: this.fileInput.current.files[0].name });
  }

  handleModelRemoved(data) {
    let newModels = this.state.models.filter(model => {
      return model.model_id !== data.id;
    });
    console.log(newModels);
    this.setState(prev => ({
      models: newModels
    }));
  }

    handleUpload() {
        this.setState({isUploaded: true});
        uploadModel(this.state.title, this.state.desc, this.fileInput.current.files[0], 'NULL')
            .then(() => {
                this.setState({isUploaded: false, isDialogOpen: false});
                $('#exampleModal').modal('hide');
                this.getModels().then();
            });
    }

    render() {
        console.log(this.state.isDialogOpen);

        const modelCells = this.state.models.map(model => {
            console.log(model);
            return (
                <ModelItem
                    id={model.model_id}
                    token={this.props.token}
                    filename={model.filename}
                    type={model.type}
                    sizeKB={model.sizeKB}
                    createdTime={model.createdTime}
                    onModelRemoved={this.handleModelRemoved}
                >
                </ModelItem>
            );
        });

  render() {
    console.log(this.state.isDialogOpen);

    const modelCells = this.state.models.map(model => {
      console.log(model);
      return (
        <ModelItem
          id={model.model_id}
          token={this.props.token}
          filename={model.filename}
          type={model.type}
          sizeKB={model.sizeKB}
          createdTime={model.createdTime}
          onModelRemoved={this.handleModelRemoved}
        ></ModelItem>
      );
    });

    return (
      <div>
        <div
          hidden={!this.state.isDialogOpen}
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Добавить модель
                </h5>
                <button
                  onClick={this.handleCloseDialog}
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="input-group" style={{ marginBottom: "16px" }}>
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="">
                      Название
                    </span>
                  </div>
                  <input
                    name="author"
                    type="text"
                    className="form-control"
                    onChange={this.handleTitleChange}
                    required
                  />
                </div>
                <div className="form-group" style={{ textAlign: "left" }}>
                  <label
                    style={{ textAlign: "left" }}
                    htmlFor="exampleFormControlTextarea1"
                  >
                    Описание
                  </label>
                  <textarea
                    name="desc"
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="5"
                    onChange={this.handleDescChange}
                    required
                  />
                </div>
                <div className="custom-file">
                  <div className="input-group">
                    <div className="custom-file">
                      <input
                        ref={this.fileInput}
                        className="custom-file-input"
                        name="model"
                        id="inputGroupFile04"
                        type="file"
                        required=""
                      />
                      <label
                        style={{ textAlign: "left" }}
                        className="custom-file-label"
                        htmlFor="inputGroupFile04"
                      >
                        Выберете файл
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={this.handleCloseDialog}
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Отмена
                </button>
                {this.state.isUploaded ? (
                  <button className="btn btn-primary" type="button" disabled>
                    <span
                      style={{ marginRight: "8px" }}
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Загрузка...
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.handleUpload}
                  >
                    Отправить
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <HeaderComponent />

        <div className="container margin-after-header">
         

          <main role="main" className="container">
            <div class="my-3 p-3 bg-white rounded shadow-sm">

                
            <h3 className = "inline">Модели</h3>

            <div className ="inline">
              <FontAwesomeIcon className="tool" onClick={this.handleOpenDialog} transform="grow-7 left-1.5 up-2.2" data-toggle="modal" data-target="#exampleModal" icon={faUpload} />
            </div>

            <h3 class="border-bottom border-gray pb-2 mb-0"></h3>
              {/* <button class="btn btn-primary" onClick={this.handleOpenDialog} data-toggle="modal" data-target="#exampleModal">
                <i class="icon-excel"></i>Добавить
              </button> */}

              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Название</th>
                    <th scope="col" />
                    <th scope="col">Тип</th>
                    <th scope="col">Вес</th>
                    <th scope="col">Загружено</th>
                  </tr>
                </thead>
                <tbody>{modelCells}</tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default ModelsView;
