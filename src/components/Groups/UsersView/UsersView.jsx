import React, { Component } from "react";

import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends, faFile } from "@fortawesome/free-solid-svg-icons";

import UserView from "../UserView";

import {
  getGroupUsers
} from "../../../services/groups";


class UsersView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  componentDidMount = () => this.getGUsers();

  getGUsers = () => {

    console.log(this.props.group);

      getGroupUsers(this.props.group).then(res =>{
        this.setState({ users: res.data.reverse()})
          console.log(this.state.users);
          
        })
       
  };


  render() {
    return (
      <div>
        <main role="main" class="container">
          <div class="my-3 p-3 bg-white rounded shadow-sm">
            <h6 class="border-bottom border-gray pb-2 mb-0">Пользователи</h6>
            {this.state.users.map(user => (
                                <UserView user={user} />
                            ))}
            
          </div>
        </main>
      </div>
    );
  }
}

export default UsersView;
