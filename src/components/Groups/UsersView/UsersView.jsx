import React, {Component} from "react";

import {getGroupUsers, addGroupUser} from "../../../services/groups";

import UserItem from "../UserItem";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserPlus} from "@fortawesome/free-solid-svg-icons";

class UsersView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            isDialogOpen: false,
            email: '',
            access: 'USER'
        };
    }

    componentDidMount = () => getGroupUsers(this.props.group)
        .then(res => this.setState({users: res.data.reverse()}));

    handleOpenDialog = () => this.setState({isDialogOpen: true});

    handleCloseDialog = () => this.setState({isDialogOpen: false});

    handleMailChange = ({target: {value}}) => this.setState({email: value});

    handleAccessChange = ({target: {value}}) => this.setState({access: value});

    handleAdd = event => {
        event.preventDefault();
        addGroupUser(this.props.group, this.state.email, this.state.access.toLocaleUpperCase())
            .then(window.location.reload());
    };

    render() {
        return (
            <div>
                <div
                    hidden={!this.state.isDialogOpen}
                    className="modal fade"
                    id="exampleModal1"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Добавить пользователя</h5>
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
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Email</span>
                                    </div>
                                    <input
                                        name="author"
                                        type="text"
                                        className="form-control"
                                        onChange={this.handleMailChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{marginBottom: "16px"}}>
                                <div className="col-auto my-1">
                                    <select className="custom-select my-1 mr-sm-2" id="inlineFormCustomSelectPref"
                                            onChange={this.handleAccessChange}>
                                        <option defaultValue="USER">User</option>
                                        <option value="MODERATOR">Moderator</option>
                                    </select>
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
                                    onClick={this.handleAdd}
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

                <main role="main" className="container">
                    <div className="my-3 p-3 bg-white rounded shadow-sm">
                        <h5 className="inline pb-2 mb-0">Пользователи</h5>
                        <div className="inline">
                            <FontAwesomeIcon
                                className="tool"
                                onClick={this.handleOpenDialog}
                                transform="grow-9 left-2 up-2.2"
                                data-toggle="modal"
                                data-target="#exampleModal1"
                                icon={faUserPlus}
                            />
                        </div>
                        <div className="border-bottom border-gray pb-2 mb-0" />
                        <div>
                            {this.state.users.map(user => <UserItem user={user} group={this.props.group} />)}
                        </div>
                    </div>
                </main>

            </div>
        );
    }
}

export default UsersView;
