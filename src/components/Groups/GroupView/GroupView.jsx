import React, {Component} from "react";
import {Redirect} from "react-router-dom";

import {getGroups, addGroupUser} from "../../../services/groups";

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
            redirect: false,
            group: {}
        };

        addGroupUser(55, 'abc@gmail.com', 'USER').then(this.getGroupData());
    }

    componentDidMount = () => this.getGroupData();

    getGroupData = () => getGroups()
        .then(res => {
            let found = false;
            res.data.map(group => {
                if (group.group_id === this.state.groupId) {
                    this.setState({title: group.title, desc: group.description, group: group});
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
                    <div class="media-body mb-0 small lh-125 ">
                        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist" style={{marginLeft: "10%"}}>
                            <li class="nav-item">
                                <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home"
                                   role="tab" aria-controls="pills-home" aria-selected="true">Модели</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile"
                                   role="tab" aria-controls="pills-profile" aria-selected="false">Пользователи</a>
                            </li>
                        </ul>
                    </div>
                    <div class="tab-content" id="pills-tabContent">
                        <div class="tab-pane fade show active" id="pills-home" role="tabpanel"
                             aria-labelledby="pills-home-tab"><ModelsView groupModels={true}
                                                                          groupId={this.state.groupId}
                                                                          name={this.state.group.firstName + " " + this.state.group.lastName} />
                        </div>
                        <div class="tab-pane fade" id="pills-profile" role="tabpanel"
                             aria-labelledby="pills-profile-tab"><UsersView group={this.state.groupId} /></div>
                    </div>


                </main>

            </div>
        );
    }
}

export default GroupView;
