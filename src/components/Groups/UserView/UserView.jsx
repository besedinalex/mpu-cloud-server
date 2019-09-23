import React, { Component } from "react";

import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends, faFile } from "@fortawesome/free-solid-svg-icons";

class UsersView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: []
    };
  }

  render() {
    return (
      <div class="media text-muted pt-3">
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
            <span>{this.props.user.access}</span>
          </div>
          <span class="d-block" style={{ textAlign: "left" }}>
            {this.props.user.email}
          </span>
        </div>
      </div>
    );
  }
}

export default UsersView;
