import React, {Component} from "react";

import $ from "jquery";

import {getGroupModels, getUserModels, uploadModel} from "../../services/models";

import HeaderComponent from "../HeaderComponent";
import ModelItem from "../ModelItem/ModelItem";

import "./ModelsView.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUpload} from "@fortawesome/free-solid-svg-icons";

class ModelsView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            models: [],
            isDialogOpen: false,
            title: "",
            desc: "",
            filename: "",
            isUploaded: false,

        };
        this.fileInput = React.createRef();
    }

    componentDidMount = () => this.getModels();

    getModels = () => {
        if (this.props.groupModels) {
            getGroupModels(this.props.groupId).then(res => this.setState({models: res.data.reverse()}));
        } else {
            getUserModels().then(res => this.setState({models: res.data.reverse()}));
        }
    };

    marginAfterHeader = () => this.props.groupModels ? "container" : "container margin-after-header";

    handleCloseDialog = () => this.setState({isDialogOpen: false});

    handleOpenDialog = () => this.setState({isDialogOpen: true});

    handleTitleChange = (e) => this.setState({title: e.target.value});

    handleDescChange = (e) => this.setState({desc: e.target.value});

    handleModelRemoved = (data) => {
        const newModels = this.state.models.filter(model => model.model_id !== data.id);
        this.setState({models: newModels});
    };

    handleUpload = () => {
        this.setState({isUploaded: true});
        const groupId = this.props.groupId === undefined ? 'NULL' : this.props.groupId;
        uploadModel(this.state.title, this.state.desc, this.fileInput.current.files[0], groupId)
            .then(() => {
                this.setState({isUploaded: false, isDialogOpen: false});
                $("#exampleModal").modal("hide");
                this.getModels();
            });
    };

    render() {
        const modelCells = this.state.models.map(model => {
            return (
                <ModelItem
                    id={model.model_id}
                    filename={model.filename}
                    type={model.type}
                    sizeKB={model.sizeKB}
                    createdTime={model.createdTime}
                    onModelRemoved={this.handleModelRemoved}
                    name={this.props.name}
                    groupModels={this.props.groupModels}
                />
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
                                <div className="input-group" style={{marginBottom: "16px"}}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Название</span>
                                    </div>
                                    <input
                                        name="author"
                                        type="text"
                                        className="form-control"
                                        onChange={this.handleTitleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{textAlign: "left"}}>
                                    <label className="text-left" htmlFor="exampleFormControlTextarea1">
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
                                            <label className="custom-file-label text-left" htmlFor="inputGroupFile04">
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
                                            style={{marginRight: "8px"}}
                                            className="spinner-border spinner-border-sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        {" "}
                                        Загрузка...
                                    </button>
                                ) : (
                                    <button type="button" className="btn btn-primary" onClick={this.handleUpload}>
                                        Отправить
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <HeaderComponent />

                <main role="main" className={this.marginAfterHeader()}>
                    <div className="my-3 p-3 bg-white rounded shadow-sm">
                        <h3 className="inline">Модели</h3>

                        <div className="inline">
                            <FontAwesomeIcon
                                className="tool"
                                onClick={this.handleOpenDialog}
                                transform="grow-7 left-1.5 up-2.2"
                                data-toggle="modal"
                                data-target="#exampleModal"
                                icon={faUpload}
                            />
                        </div>

                        <div className="border-bottom border-gray pb-2 mb-0" />

                        <table className="table">
                            <thead>
                            <tr>
                                <th scope="col">Название</th>
                                <th scope="col" />
                                {this.props.groupModels ? <th scope="col">Пользователь</th> : null}
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
        );
    }
}

export default ModelsView;
