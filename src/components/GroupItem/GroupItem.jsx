import React, { Component } from 'react';

class GroupItem extends Component {
    state = {  }
    render() { 
        return (
            <tr>
                <td>{this.props.group.title}</td>
                <td>{this.props.group.name}</td>
                <td>{this.props.group.date}</td>
            </tr>
        );

    
}}
 
export default GroupItem;