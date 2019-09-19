import React, { Component } from 'react';

class GroupItem extends Component {
    state = {  }
    
    render() { 
        return (
            <tr>
                <td>{this.props.group.title}</td>
                <td>{this.props.group.owner}</td>
                <td>{this.props.group.dateOfCreation}</td>
            </tr>
        );

    
}}
 
export default GroupItem;