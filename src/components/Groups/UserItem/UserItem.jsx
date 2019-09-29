import React, {Component} from "react";

import {deleteGroupUser} from "../../../services/groups";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserMinus} from "@fortawesome/free-solid-svg-icons";

class UserItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: [],
            isMouseOver: false
        };
    }

    handleMouseOver = () => this.setState({isMouseOver: true});

    handleMouseOut = () => this.setState({isMouseOver: false});

    deleteUser = event => {
        event.preventDefault();
        deleteGroupUser(this.props.user.user_id, this.props.group)
            .then(window.location.reload());
    };

    render() {
        return (
            <div className="container" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
                <div className="media text-muted pt-3 hasHover">
                    <img
                        src="https://image.flaticon.com/icons/svg/145/145842.svg"
                        style={{position: "relative", margin: "2px"}}
                        width="38px"
                        alt=""
                    />
                    <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                        <div className="d-flex justify-content-between align-items-center w-100">
                            <strong className="text-gray-dark">
                                {this.props.user.firstName} {this.props.user.lastName}
                            </strong>
                            <div className="tools" style={{position: "absolute", right: "30%"}}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginTop: "4px"
                                    }}
                                    hidden={!this.state.isMouseOver}
                                >
                                    <FontAwesomeIcon
                                        icon={faUserMinus}
                                        className="tool"
                                        transform="grow-10 left-2 up-2.2"
                                        onClick={this.deleteUser}
                                    />
                                </div>
                            </div>
                            <span style={{paddingRight: "7px"}}>
                                {this.props.user.access}
                            </span>
                        </div>
                        <span className="d-block" style={{textAlign: "left"}}>
                            {this.props.user.email}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserItem;
