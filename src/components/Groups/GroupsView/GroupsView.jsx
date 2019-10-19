import React, {Component} from "react";

import {addGroup, getGroups} from "../../../services/groups";

import HeaderComponent from "../../HeaderComponent";
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
            description: '',
            filename: "",
            groups: []
        };

        this.fileInput = React.createRef();
    }

    componentDidMount = () => this.getData();

    getData = () => getGroups().then(res => this.setState({groups: res.data}));

    handleCloseDialog = () => this.setState({isDialogOpen: false});

    handleOpenDialog = () => this.setState({isDialogOpen: true});

    handleTitleChange = ({target: {value}}) => this.setState({title: value});

    handleFileSelection = ({target: {value}}) => this.setState({filename: value});

    handleDescChange = ({target: {value}}) => this.setState({description: value});

    handleCreate = event => {
        event.preventDefault();
        addGroup(this.state.title, this.state.description, this.state.file)
            .then(window.location.reload());
    };

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
                                <h5 className="modal-title" id="exampleModalLabel">Создать группу</h5>
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
                                        <span className="input-group-text">Имя группы</span>
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

                                <div className="form-group" style={{textAlign: "left"}}>
                                    <label style={{textAlign: "left"}} htmlFor="exampleFormControlTextarea1">
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

                                {/*<div className="custom-file">*/}
                                {/*    <div className="input-group">*/}
                                {/*        <div className="custom-file">*/}
                                {/*            <input*/}
                                {/*                ref={this.fileInput}*/}
                                {/*                className="custom-file-input"*/}
                                {/*                name="model"*/}
                                {/*                id="inputGroupFile04"*/}
                                {/*                type="file"*/}
                                {/*                required=""*/}
                                {/*            />*/}
                                {/*            <label*/}
                                {/*                style={{textAlign: "left"}}*/}
                                {/*                className="custom-file-label"*/}
                                {/*                htmlFor="inputGroupFile04"*/}
                                {/*            >*/}
                                {/*                Выберете аватар*/}
                                {/*            </label>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
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
                    <div className="my-3 p-3 bg-white rounded shadow-sm">
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
                        <div className="border-bottom border-gray pb-2 mb-0" />

                        <table className="table">
                            <thead>
                            <tr>
                                <th scope="col">Название</th>
                                <th scope="col" />
                                <th scope="col">Создано</th>
                                <th scope="col">Дата создания</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.groups.map((group, i) => (
                                <GroupItem group={group} key={i} />
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
