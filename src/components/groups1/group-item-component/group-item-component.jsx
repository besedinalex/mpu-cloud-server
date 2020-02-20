import React, {Component} from "react";
import {Redirect} from "react-router-dom";

export default class GroupItemComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: false
        };
    }

    handleGroupClick = () => this.setState({redirect: true});

    render() {
        if (this.state.redirect) {
            return <Redirect to={`/group/${this.props.groupId}`} />;
        } else {
            return (
                <tr>
                    <td onClick={this.handleGroupClick} className="filename">
                        <img
                            src="https://image.flaticon.com/icons/svg/148/148946.svg" width="35px"
                            style={{position: "relative", right: "5px"}} alt=""
                        /> {this.props.title}
                    </td>
                    <td />
                    <td>{this.props.ownerName}</td>
                    <td>{this.props.createdTime}</td>
                </tr>
            );
        }
    }
}
