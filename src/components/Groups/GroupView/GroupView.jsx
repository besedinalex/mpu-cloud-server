import React, { Component } from "react";

import { getGroups } from "../../../services/groups";

import HeaderComponent from "../../HeaderComponent";
import ModelsView from "../../ModelsView/ModelsView";
import UsersView from "../UsersView";

class GroupView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groupId: Number(this.props.match.params.id),
            title: '',
            desc: '',
        };
    }

    componentDidMount = () => this.getGroupData();

    getGroupData = () => getGroups().then(res => res.data.map(group => {
        if (group.group_id === this.state.groupId) {
            console.log(group);
            this.setState({ title: group.title, desc: group.description });
        }
    }));

    render() {
        return (
            <div>
                <HeaderComponent />
                <main role="main" className="container margin-after-header">
                    <div className="px-3 mx-auto text-center">
                        <h1 className="display-4">{this.state.title}</h1>
                        <p className="lead">{this.state.desc}</p>
                    </div>
                    <ModelsView groupModels={true} groupId={this.state.groupId} />
                    <UsersView groupId={this.state.groupId} />
                </main>
            </div>
        );
    }
}

export default GroupView;
