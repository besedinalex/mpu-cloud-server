import React, { Component } from "react";

import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends, faFile  } from "@fortawesome/free-solid-svg-icons";

class UsersView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <main role="main" class="container">
          <div class="my-3 p-3 bg-white rounded shadow-sm">
            <h6 class="border-bottom border-gray pb-2 mb-0">Suggestions</h6>
            <div class="media text-muted pt-3">
              <svg
                class="bd-placeholder-img mr-2 rounded"
                width="32"
                height="32"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
                focusable="false"
                role="img"
                aria-label="Placeholder: 32x32"
              >
                <title>Placeholder</title>
                <rect fill="#007bff" width="100%" height="100%" />
                <text fill="#007bff" dy=".3em" x="50%" y="50%">
                  32x32
                </text>
              </svg>
              <div class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                <div class="d-flex justify-content-between align-items-center w-100">
                  <strong class="text-gray-dark">Full Name</strong>
                  <a href="#">Follow</a>
                </div>
                <span class="d-block">@username</span>
              </div>
            </div>
            <div class="media text-muted pt-3">
              <svg
                class="bd-placeholder-img mr-2 rounded"
                width="32"
                height="32"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
                focusable="false"
                role="img"
                aria-label="Placeholder: 32x32"
              >
                <title>Placeholder</title>
                <rect fill="#007bff" width="100%" height="100%" />
                <text fill="#007bff" dy=".3em" x="50%" y="50%">
                  32x32
                </text>
              </svg>
              <div class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                <div class="d-flex justify-content-between align-items-center w-100">
                  <strong class="text-gray-dark">Full Name</strong>
                  <a href="#">Follow</a>
                </div>
                <span class="d-block">@username</span>
              </div>
            </div>
            <div class="media text-muted pt-3">
              <svg
                class="bd-placeholder-img mr-2 rounded"
                width="32"
                height="32"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
                focusable="false"
                role="img"
                aria-label="Placeholder: 32x32"
              >
                <title>Placeholder</title>
                <rect fill="#007bff" width="100%" height="100%" />
                <text fill="#007bff" dy=".3em" x="50%" y="50%">
                  32x32
                </text>
              </svg>
              <div class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                <div class="d-flex justify-content-between align-items-center w-100">
                  <strong class="text-gray-dark">Full Name</strong>
                  <a href="#">Follow</a>
                </div>
                <span class="d-block">@username</span>
              </div>
            </div>
            <small class="d-block text-right mt-3">
              <a href="#">All suggestions</a>
            </small>
          </div>
        </main>
      </div>
    );
  }
}
export default UsersView;
