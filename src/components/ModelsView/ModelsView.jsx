import React, { Component } from "react";

import $ from "jquery";

import { getGroupModels, getUserModels, uploadModel } from "../../services/models";

import HeaderComponent from "../HeaderComponent";
import ModelItem from "../ModelItem/ModelItem";

import "./ModelsView.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import ModelItemCard from "../ModelItemCard";

import gridDark from "../../images/gridDark.png";
import gridLight from "../../images/gridLight.png";
import listDark from "../../images/listDark.png";
import listLight from "../../images/listLight.png";



class ModelsView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            models: [],
            isDialogOpen: false,
            title: "",
            desc: "",
            filename: "Выберите файл",
            isUploaded: false,
            listIcon: listLight,
            gridIcon: gridDark

        };
        this.fileInput = React.createRef();

    }


    componentDidMount = () => this.getModels();

    getModels = () => {
        if (this.props.groupId !== undefined) {
            getGroupModels(this.props.groupId).then(res => this.setState({ models: res.data.reverse() }));
        } else {
            getUserModels().then(res => this.setState({ models: res.data.reverse() }));
        }
    };

    marginAfterHeader = () => this.props.groupId !== undefined ? "container" : "container margin-after-header";

    handleCloseDialog = () => this.setState({ isDialogOpen: false });

    handleOpenDialog = () => this.setState({ isDialogOpen: true });

    handleTitleChange = (e) => this.setState({ title: e.target.value });

    handleDescChange = (e) => this.setState({ desc: e.target.value });

    handleInputChange = (e) => this.setState({ filename: e.target.value });

    handleUpload = () => {
        this.setState({ isUploaded: true });
        const groupId = this.props.groupId === undefined ? 'NULL' : this.props.groupId;
        uploadModel(this.state.title, this.state.desc, this.fileInput.current.files[0], groupId)
            .then(() => {
                this.setState({ isUploaded: false, isDialogOpen: false, filename: 'Выберите файл' });
                $("#exampleModal").modal("hide");
                this.getModels();
            });
    };

    changeIconFirst = () => {
        if (this.state.listIcon == listDark) {
            this.setState({
                listIcon: listLight,
                gridIcon: gridDark
            });
        }
    }

    changeIconSecond = () => {
        if (this.state.gridIcon == gridDark) {
            this.setState({
                listIcon: listDark,
                gridIcon: gridLight
            });
        }
    }

   
    render() {
        return (
            <div>
                <div
                    hidden={!this.state.isDialogOpen} className="modal fade"
                    id="exampleModal" tabIndex="-1" role="dialog"
                    aria-labelledby="exampleModalLabel" aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Добавить модель
                                </h5>
                                <button
                                    onClick={this.handleCloseDialog} type="button"
                                    className="close" data-dismiss="modal" aria-label="Close"
                                >
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="input-group" style={{ marginBottom: "16px" }}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Название</span>
                                    </div>
                                    <input
                                        name="author" type="text" className="form-control"
                                        onChange={this.handleTitleChange} required
                                    />
                                </div>
                                <div className="form-group" style={{ textAlign: "left" }}>
                                    <label className="text-left" htmlFor="exampleFormControlTextarea1">
                                        Описание
                                    </label>
                                    <textarea
                                        name="desc" className="form-control"
                                        id="exampleFormControlTextarea1" rows="5"
                                        onChange={this.handleDescChange} required
                                    />
                                </div>
                                <div className="custom-file">
                                    <div className="input-group">
                                        <div className="custom-file">
                                            <input
                                                ref={this.fileInput} className="custom-file-input"
                                                name="model" id="inputGroupFile04"
                                                type="file" required onChange={this.handleInputChange}
                                            />
                                            <label className="custom-file-label text-left" htmlFor="inputGroupFile04">
                                                {this.state.filename}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    onClick={this.handleCloseDialog} type="button"
                                    className="btn btn-secondary" data-dismiss="modal"
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
                        <div className="media-body mb-0 small lh-125 inline2">
                            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                <li className="nav-item" onClick={this.changeIconFirst}>
                                    <a className="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills2-home"
                                        role="tab" aria-controls="pills-home" aria-selected="true">
                                        <img src={this.state.listIcon} width="20px" alt="" />
                                    </a>
                                </li>
                                <li className="nav-item" onClick={this.changeIconSecond}>
                                    <a className="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills2-profile"
                                        role="tab" aria-controls="pills-profile" aria-selected="false">
                                        <img src={this.state.gridIcon} width="20px" alt="" />
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <h3 className="inline">Модели</h3>
                        <div className="inline">
                            <FontAwesomeIcon
                                className="tool" onClick={this.handleOpenDialog}
                                transform="grow-7 left-1.5 up-2.2" data-toggle="modal"
                                data-target="#exampleModal" icon={faUpload}
                            />
                        </div>

                    <div className="border-bottom border-gray pb-2 mb-0" />
                        <div className="tab-content" id="pills-tabContent">
                            <div
                                className="tab-pane fade show active" id="pills2-home"
                                role="tabpanel" aria-labelledby="pills-home-tab"
                            >
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
                                    <tbody>
                                        {this.state.models.map((model, i) => (
                                            <ModelItem
                                                id={model.model_id} filename={model.title} type={model.type}
                                                sizeKB={model.sizeKB} createdTime={model.createdTime}
                                                name={this.props.name} groupId={this.props.groupId} key={i}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div
                                className="tab-pane fade" id="pills2-profile"
                                role="tabpanel" aria-labelledby="pills-profile-tab"
                            >
                                <table className="table">
                                    <tbody>
                                        {this.state.models.map((model, i) => (
                                            <ModelItemCard id={model.model_id} filename={model.title} name={this.props.name} groupId={this.props.groupId} key={i} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}

export default ModelsView;
