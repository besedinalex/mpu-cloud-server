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
    this.getGUsers = this.getGUsers.bind(this);
  }

  componentDidMount = () => this.getGUsers();

  getGUsers = () => {
      console.log(this.props);
      
  };


  render() {
    return (
      <div class="media text-muted pt-3">
        <svg class="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect fill="#007bff" width="100%" height="100%" /><text fill="#007bff" dy=".3em" x="50%" y="50%">32x32</text></svg>
        <div class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
          <div class="d-flex justify-content-between align-items-center w-100">
            <strong class="text-gray-dark">{this.props.user.firstName} {this.props.user.lastName}</strong>
          </div>
          <span class="d-block" style = {{textAlign:"left"}}>{this.props.user.email}</span>
        </div>
      </div>
    );
  }
}

export default UsersView;
