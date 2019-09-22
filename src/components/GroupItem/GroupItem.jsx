import React, {Component} from "react";
import {Redirect} from "react-router-dom";

class GroupItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: false
        };
    }

    handleGroupClick = () => this.setState({redirect: true});

    render() {
        if (this.state.redirect) {
            return <Redirect to={`/group/${this.props.group.group_id}`} />;
        } else {
            return (
                <tr>
                    <td onClick={this.handleGroupClick} className="filename">
                        <img
                            src="https://image.flaticon.com/icons/svg/356/356480.svg"
                            width="35px"
                            alt=""
                        /> {this.props.group.title}
                    </td>
                    <td />
                    <td>
                        {this.props.group.firstName + " " + this.props.group.lastName}
                    </td>
                    <td>{new Date(this.props.createdDate).toString()}</td>
                </tr>
            );
        }
    }
}

export default GroupItem;
