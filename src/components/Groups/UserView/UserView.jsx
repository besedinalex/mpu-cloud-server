import React, { Component } from "react";
import {token} from "../../../services/authentication";

import {delUser} from "../../../services/groups";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserMinus } from "@fortawesome/free-solid-svg-icons";

class UsersView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      isMouseOver: false
    };
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.delUser = this.delUser.bind(this);
  }


  handleMouseOver(e) {
    this.setState({ isMouseOver: true }); 
  }

  handleMouseOut(e) {
    this.setState({ isMouseOver: false });
  }

  delUser = event => {
    event.preventDefault();
    delUser(this.props.user.user_id, this.props.group).then(this.props.getGUsers(this.props.user.user_id));
};

  render() {
    return (
      <div
        className="container"
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
      >
        <div class="media text-muted pt-3 hasHover">
          <img
            src="https://image.flaticon.com/icons/svg/145/145842.svg"
            style={{ position: "relative", margin: "2px" }}
            width="38px"
            alt=""
          />
          <div class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
            <div class="d-flex justify-content-between align-items-center w-100">
              <strong class="text-gray-dark">
                {this.props.user.firstName} {this.props.user.lastName}
              </strong>

              <div
                className="tools"
                style={{ position: "absolute", right: "30%" }}
              >
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
                    onClick={this.delUser}
                  />
                </div>
              </div>

              <span style={{ paddingRight: "7px" }}>
                {this.props.user.access}
              </span>
            </div>
            <span class="d-block" style={{ textAlign: "left" }}>
              {this.props.user.email}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default UsersView;
