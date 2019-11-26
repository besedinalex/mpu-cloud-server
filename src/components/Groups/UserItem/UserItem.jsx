import React, {Component} from "react";
import {Redirect} from "react-router-dom";

import {deleteGroupUser} from "../../../services/groups";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserMinus} from "@fortawesome/free-solid-svg-icons";

class UserItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMouseOver: false,
            redirect: false
        };
    }

    handleMouseOver = () => this.setState({isMouseOver: true});

    handleMouseOut = () => this.setState({isMouseOver: false});

    // handleMouseClick = () => this.setState({redirect: true});

    deleteUser = event => {
        event.preventDefault();
        deleteGroupUser(this.props.user.user_id, this.props.group)
            .then(window.location.reload());
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to={`/profile/${this.props.user.user_id}`} />;
        }
        return (
            <div className="container" onClick={this.handleMouseClick} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
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
                            <div className="tools float-left" style={{position:"absolute", right:"30%" }}>
                                <div className="icons" hidden={!this.state.isMouseOver}>
                                    <FontAwesomeIcon
                                        icon={faUserMinus}
                                        className="tool"
                                        transform="grow-10"
                                        onClick={this.deleteUser}
                                    />
                                </div>
                            </div>
                            <span style={{paddingRight: "7px"}}>
                                {this.props.user.access}
                            </span>
                        </div>
                        <span className="d-block text-left">
                            {this.props.user.email}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserItem;
