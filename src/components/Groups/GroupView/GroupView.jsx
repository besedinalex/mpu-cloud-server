import React, {Component} from "react";
import {Redirect} from "react-router-dom";

import {getGroups} from "../../../services/groups";

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
            redirect: false
        };
    }

    componentDidMount = () => this.getGroupData();

    getGroupData = () => getGroups()
        .then(res => {
            let found = false;
            res.data.map(group => {
                if (group.group_id === this.state.groupId) {
                    this.setState({title: group.title, desc: group.description});
                    found = true;
                }
            });
            if (!found)
                this.setState({redirect: true});
        });

    render() {
        if (this.state.redirect) {
            return <Redirect to="/groups" />;
        }
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
