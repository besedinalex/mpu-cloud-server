import React, { Component } from 'react';
import {Redirect} from "react-router-dom";

class GroupItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: false
        }
    }

    handleGroupClick = () => this.setState({ redirect: true });
    
    render() {
        if (this.state.redirect) {
            return <Redirect to={`/group/${this.props.group.group_id}`} />;
        } else {
            return (
                <tr onClick={this.handleGroupClick}>
                    <td>{this.props.group.title}</td>
                    <td>{this.props.group.firstName + ' ' + this.props.group.lastName}</td>
                    <td>{this.props.group.dateOfCreation}</td>
                </tr>
            );
        }
    }
}
 
export default GroupItem;