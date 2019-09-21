import React, {Component} from "react";

import axios from "axios";

import {token} from '../../services/authentication';

import HeaderComponent from "../HeaderComponent";
import GroupItem from "../GroupItem";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFolderPlus} from "@fortawesome/free-solid-svg-icons";


class GroupsView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDialogOpen: false,
            key: "",
            title: "",
            filename: "",
            groups: []
        };

        this.fileInput = React.createRef();

        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.handleOpenDialog = this.handleOpenDialog.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleFileSelection = this.handleFileSelection.bind(this);
        this.getGroups = this.getGroups.bind(this);
    }

    componentDidMount = () => this.getGroups();

    getGroups() {
        axios
            .get(`http://127.0.0.1:4000/groups?token=${token}`)
            .then(res => this.setState({groups: res.data}));
    }

    handleCloseDialog = () => this.setState({isDialogOpen: false});

    handleOpenDialog = () => this.setState({isDialogOpen: true});

    handleTitleChange = ({target: {value}}) =>
        this.setState({title: value});

    handleFileSelection = ({target: {value}}) =>
        this.setState({filename: value});

    handleCreate = event => {
        event.preventDefault();
        const title = this.state.title;
        const file = this.state.file;
        const date = this.getCurrentDate();
        axios
            .post(
                `http://127.0.0.1:4000/group-create?token=${token}&title=${title}&image=${file}&dateOfCreation=${date}`
            )
            .then();
        this.getGroups();
    };

    getCurrentDate() {
        const date = new Date();
        return (
            date.getDate().toString() +
            "." +
            (date.getMonth() + 1).toString() +
            "." +
            date.getFullYear().toString()
        );
    }

    render() {
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
                                    Создать новый проект
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
                    <span className="input-group-text" id="">
                      Имя проекта
                    </span>
                                    </div>
                                    <input
                                        name="author"
                                        type="text"
                                        value={this.state.title}
                                        className="form-control"
                                        onChange={this.handleTitleChange}
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
                                                style={{textAlign: "left"}}
                                                className="custom-file-label"
                                                htmlFor="inputGroupFile04"
                                            >
                                                Выберете аватар
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
                                <button
                                    onClick={this.handleCreate}
                                    type="button"
                                    className="btn btn-primary"
                                    data-dismiss="modal"
                                >
                                    Создать
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

              <HeaderComponent />

                <main role="main" className="container margin-after-header">
                    <div class="my-3 p-3 bg-white rounded shadow-sm">
                        <h3 className="inline">Группы</h3>
                        <div className="inline">
                            <FontAwesomeIcon
                                className="tool"
                                onClick={this.handleOpenDialog}
                                transform="grow-10 left-2 up-2.2"
                                data-toggle="modal"
                                data-target="#exampleModal"
                                icon={faFolderPlus}
                            />
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
                                <th scope="col">Создано</th>
                                <th scope="col">Дата</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.groups.map(group => (
                                <GroupItem group={group} />
                            ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        );
    }
}

export default GroupsView;
