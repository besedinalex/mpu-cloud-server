import React, {Component} from "react";

import {getUser} from "../../services/profile";
import {getGroups} from "../../services/groups";

import HeaderComponent from "../HeaderComponent";

class ProfileView extends Component {
    state = {
        user: {},
        groups: []
    };

    componentDidMount = () => this.getData();

    getData = () => {
        getUser().then(res => this.setState({user: res.data[0]}));
        getGroups().then(res => this.setState({groups: res.data}));
    };

    render() {
        return (
            <div>
                <HeaderComponent />
                <main role="main" className="container margin-after-header">
                    <div className="bg-white rounded shadow-sm">
                        <div className="media  pt-3">
                            <div className="p-1 ml-4 bg-secondary rounded-circle">
                                <svg
                                    className="bd-placeholder-img  rounded-circle border border-secondary"
                                    width="128"
                                    height="128"
                                    xmlns="https://image.flaticon.com/icons/svg/145/145842.svg"
                                    preserveAspectRatio="xMidYMid slice"
                                    focusable="false"
                                    role="img"
                                    aria-label="Placeholder: 32x32"
                                >
                                    <title>Placeholder</title>
                                    <rect fill="#007bff" width="100%" height="100%" />
                                    <text fill="#007bff" dy=".3em" x="50%" y="50%">
                                        128x128
                                    </text>
                                </svg>
                            </div>
                            <div className="md-2 p-3 font-weight-bold ml-3 ">
                                {this.state.user.firstName} {this.state.user.lastName}
                            </div>
                        </div>

                        <div>
                            <table className="table my-3">
                                <thead>
                                <tr>
                                    <th scope="col" style={{width: "33%"}} />
                                    <th scope="row" className="font-weight-bold" colSpan="2" style={{textAlign: "center"}}>
                                        Информация
                                    </th>
                                    <th scope="col" style={{width: "33%"}} />
                                </tr>
                                </thead>

                                <tbody>
                                <tr>
                                    <td className="font-weight-bold">Время регистрации:</td>
                                    <td colSpan="2" />
                                    <td>{this.state.user.createdTime}</td>
                                </tr>
                                <tr>
                                    <td className="font-weight-bold">Email:</td>
                                    <td colSpan="2" />
                                    <td>{this.state.user.email}</td>
                                </tr>
                                <tr>
                                    <td className="font-weight-bold">Группы:</td>
                                    <td colSpan="2" />
                                    <td>1,2,3</td>
                                    {/*{this.state.groups}*/}
                                </tr>
                                </tbody>

                            </table>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}

export default ProfileView; 
