import React, {Component} from 'react';

class GroupView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groupId: this.props.match.params.id
        }
    }

    render() {
        return (
            <div>{this.state.groupId}</div>
        );
    }
}

export default GroupView;