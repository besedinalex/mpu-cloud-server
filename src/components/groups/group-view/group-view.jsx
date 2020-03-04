import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {getGroup} from "../../../services/groups";
import HeaderComponent from "../../header-component";
import FilesView from "../../files/files-view/files-view";
import UsersView from "../users-view";

export default class GroupView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groupId: Number(this.props.match.params.id),
            title: '',
            desc: '',
            redirect: false,
            group: {}
        };
    }

    componentDidMount = () => this.getGroupData();

    getGroupData = () => getGroup(this.state.groupId)
        .then(res => {
            const group = res.data[0];
            if (group === undefined) {
                this.setState({redirect: true});
            } else {
                this.setState({group: group})
            }
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
                        <h1 className="display-4">{this.state.group.title}</h1>
                        <p className="lead">{this.state.group.description}</p>
                    </div>
                    <div className="media-body mb-0 small lh-125 ">
                        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist" style={{marginLeft: "10%"}}>
                            <li className="nav-item">
                                <a className="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home"
                                   role="tab" aria-controls="pills-home" aria-selected="true">Модели</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile"
                                   role="tab" aria-controls="pills-profile" aria-selected="false">Пользователи</a>
                            </li>
                        </ul>
                    </div>
                    <div className="tab-content" id="pills-tabContent">
                        <div
                            className="tab-pane fade show active" id="pills-home"
                            role="tabpanel" aria-labelledby="pills-home-tab"
                        >
                            <FilesView groupId={this.state.groupId} />
                        </div>
                        <div
                            className="tab-pane fade" id="pills-profile"
                            role="tabpanel" aria-labelledby="pills-profile-tab"
                        >
                            <UsersView group={this.state.groupId} />
                        </div>
                    </div>

                </main>
            </div>
        );
    }
}
