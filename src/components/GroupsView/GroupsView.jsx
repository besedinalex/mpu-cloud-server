import React, { Component } from 'react';
import HeaderComponent from "../HeaderComponent";
import GroupItem from "../GroupItem";
import axios from 'axios';

class GroupsView extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isDialogOpen: false,
            key: "",
            title: '',
            filename: '',
            groups: []
        };

        this.fileInput = React.createRef();

        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.handleOpenDialog = this.handleOpenDialog.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleFileSelection = this.handleFileSelection.bind(this);
        this.getGroups = this.getGroups.bind(this);
    }
    
    getGroups() {
        axios.get(`http://127.0.0.1:4000/groups?token=${this.props.token}`)
            .then(res => {
                this.setState({ groups: res.data });
            });
    }

    handleCloseDialog() {
        this.setState({ isDialogOpen: false });
    }

    handleOpenDialog() {
        this.setState({ isDialogOpen: true });
    }

    handleTitleChange = ({target:{value}}) => {
        this.setState({
            title:value
        })
    }

    handleFileSelection = ({target:{value}}) => {
        this.setState({
            filename:value
        })
    }

    handleCreate = (e)  => {
        e.preventDefault();
        axios.post(`http://127.0.0.1:4000/groups?token=${this.props.token}&title=${this.state.title}&image=${this.state.file}&dateOfCreation=${this.getCurrentDate()}`)
            .then();
        this.getGroups();
    };
    
    getCurrentDate() {
        const date = new Date();
        return date.getDate().toString() +"."+ (date.getMonth() + 1).toString() +"."+ date.getFullYear().toString();
    }

     componentDidMount(){
         this.getGroups();
    }

    render() { 
        return ( 
            <div>
                <div hidden={!this.state.isDialogOpen} className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Создать новый проект</h5>
                                <button onClick={this.handleCloseDialog} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span>&times;</span>
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="input-group" style={{ marginBottom: '16px' }}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="">Имя проекта</span>
                                    </div>
                                    <input name="author" type="text"  value= {this.state.title} className="form-control" onChange={this.handleTitleChange} required />
                                </div>

                                <div className="custom-file">
                                    <div className="input-group">
                                        <div className="custom-file">
                                            <input ref={this.fileInput} className="custom-file-input" name="model" id="inputGroupFile04" type="file" required="" />
                                            <label style={{ textAlign: 'left' }} className="custom-file-label" htmlFor="inputGroupFile04">Выберете аватар</label>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button onClick={this.handleCloseDialog} type="button" className="btn btn-secondary" data-dismiss="modal">Отмена</button>
                                <button onClick={this.handleCreate} type="button" className="btn btn-primary" data-dismiss="modal">Создать</button>
                            </div>
                        </div>
                    </div>
                </div>

                <HeaderComponent />

                <div className="container margin-after-header">

                    <div style={{ marginBottom: 20 + 'px', display: 'flex', justifyContent: 'space-between' }}>
                    <h3>Группы</h3>
                        <button style={{ height: '42px' }} onClick={this.handleOpenDialog} type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                            Добавить
                        </button>
                    </div>

                    <table className="table">
                        <thead className="thead-dark">
                            <tr>
                                <th>Название</th>
                                <th>Создано</th>
                                <th>Дата создания</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.groups.map(group =>
                                <GroupItem
                                    key={group.key}
                                    group={group}
                                />)}
                        </tbody>
                    </table>
                    <br/>
                    <br/>

                </div>
            </div>
         );
    }
}
 
export default GroupsView;