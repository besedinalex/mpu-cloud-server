import React, {Component} from "react";

import {getGroups} from "../../services/groups";

import HeaderComponent from "../HeaderComponent";
import ModelsView from "../ModelsView/ModelsView";
import UsersView from "../UsersComponent/UsersView";

class GroupView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groupId: this.props.match.params.id,
            title: "",
            desc: "",
        };
    }

    componentDidMount = () => this.getGroupData();

    getGroupData = () => getGroups().then(res => res.data.map(group => {
        if (group.group_id == this.state.groupId) {
            this.setState({title: group.title, desc: group.desc});
        }
    }));

    render() {
        return (
            <div>
              <HeaderComponent />
                <main role="main" class="container margin-after-header">
                    <div className="jumbotron" style={{background: "white"}}>
                        <h1>{this.state.title}</h1>
                        <p>{this.state.desc}</p>
                    </div>
                    <ModelsView groupModels={true} groupId={this.state.groupId} />
                    <UsersView groupId={this.state.groupId}/>
                </main>
            </div>
        );
    }
}

export default GroupView;
