import React, {Component} from "react";
import {Redirect} from 'react-router-dom';
import $ from "jquery";
import {getGroupFiles, getUserFiles, uploadFile} from "../../../services/files";
import HeaderComponent from "../../header-component";
import FileItemComponent from "../file-item-component/file-item-component";
import "./files-view.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUpload, faSearch} from "@fortawesome/free-solid-svg-icons";
import FileItemCardComponent from "../file-item-card-component";
import AppsIcon from '@material-ui/icons/Apps';
import ListIcon from '@material-ui/icons/List';
import NotificationsComponent, {notify} from "../../notifications-component";

export default class FilesView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            models: [],
            isDialogOpen: false,
            title: "",
            desc: "",
            filename: "Выберите файл",
            isUploaded: false,
            redirect: false,
            modelId: null,
            listIcon: AppsIcon,
            gridIcon: ListIcon,
            filterText: ""
        };
        this.fileInput = React.createRef();
    }

    componentDidMount = () => this.getModels();

    getModels = () => {
        if (this.props.groupId !== undefined) {
            getGroupFiles(this.props.groupId).then(res => this.setState({models: res.data.reverse()}));
        } else {
            getUserFiles().then(res => this.setState({models: res.data.reverse()}));
        }
    };

    marginAfterHeader = () => this.props.groupId !== undefined ? "container" : "container margin-after-header";

    handleCloseDialog = () => this.setState({isDialogOpen: false});

    handleOpenDialog = () => this.setState({isDialogOpen: true});

    handleOpenSearchBar = () => {
        let searchBar = document.querySelector('.searchBarBefore');
        if (searchBar.classList.contains("searchBarAfter")) {
            this.setState({filterText: ""});
            searchBar.classList.remove("searchBarAfter");
        } else {
            searchBar.classList.add("searchBarAfter");
        }
    };

    handleSearchBarChange = (e) => this.setState({filterText: e.target.value});

    handleTitleChange = (e) => this.setState({title: e.target.value});

    handleDescChange = (e) => this.setState({desc: e.target.value});

    handleInputChange = (e) => this.setState({filename: e.target.value});

    handleUpload = () => {
        if (this.state.filename === 'Выберите файл') {
            notify('Вы не выбрали файл для загрузки');
            return;
        }
        this.setState({isUploaded: true});
        const groupId = this.props.groupId === undefined ? 'NULL' : this.props.groupId;
        uploadFile(this.state.title, this.state.desc, this.fileInput.current.files[0], groupId)
            .then(data => this.setState({redirect: true, modelId: data.data}))
            .catch(() => {
                this.setState({filename: 'Выберите файл'});
                this.setState({isUploaded: false});
                notify('Не удалось загрузить файл');
            })
            .finally(() => $("#exampleModal").modal("hide"));
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to={`/model/${this.state.modelId}`} />;
        }
        return (
            <div>
                <div
                    hidden={!this.state.isDialogOpen} className="modal fade"
                    id="exampleModal" tabIndex="-1" role="dialog"
                    aria-labelledby="exampleModalLabel" aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Добавить файл
                                </h5>
                                <button
                                    onClick={this.handleCloseDialog} type="button"
                                    className="close" data-dismiss="modal" aria-label="Close"
                                >
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="input-group" style={{marginBottom: "16px"}}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Название</span>
                                    </div>
                                    <input
                                        name="author" type="text" className="form-control"
                                        onChange={this.handleTitleChange} required
                                    />
                                </div>
                                <div className="form-group" style={{textAlign: "left"}}>
                                    <label className="text-left" htmlFor="exampleFormControlTextarea1">
                                        Описание
                                    </label>
                                    <textarea
                                        name="desc" className="form-control"
                                        id="exampleFormControlTextarea1" rows="5"
                                        onChange={this.handleDescChange} required
                                    />
                                </div>
                                <div className="custom-file">
                                    <div className="input-group">
                                        <div className="custom-file">
                                            <input
                                                ref={this.fileInput} className="custom-file-input"
                                                name="model" id="inputGroupFile04"
                                                type="file" required onChange={this.handleInputChange}
                                            />
                                            <label className="custom-file-label text-left" htmlFor="inputGroupFile04">
                                                {this.state.filename}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    onClick={this.handleCloseDialog} type="button"
                                    className="btn btn-secondary" data-dismiss="modal"
                                >
                                    Отмена
                                </button>
                                {this.state.isUploaded ? (
                                    <button className="btn btn-primary" type="button" disabled>
                                        <span
                                            style={{marginRight: "8px"}}
                                            className="spinner-border spinner-border-sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        {" "}
                                        Загрузка...
                                    </button>
                                ) : (
                                    <button type="button" className="btn btn-primary" onClick={this.handleUpload}>
                                        Отправить
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <HeaderComponent />

                <main role="main" className={this.marginAfterHeader()}>
                    <div className="my-3 p-3 bg-white rounded shadow-sm">
                        <div className="border-bottom border-gray pb-2 mb-0">
                            <div className="container">
                                <div className="row">
                                    <div className="col-sm">
                                        <div className="media-body mb-0 small lh-125 float-left">
                                            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                                <li className="nav-item" onClick={this.changeIconFirst}>
                                                    <a className="nav-link active" id="pills-home-tab"
                                                       data-toggle="pill" href="#pills2-home"
                                                       role="tab" aria-controls="pills-home" aria-selected="true">
                                                        <ListIcon style={{fontSize: 30}} />
                                                    </a>
                                                </li>
                                                <li className="nav-item" onClick={this.changeIconSecond}>
                                                    <a className="nav-link" id="pills-profile-tab" data-toggle="pill"
                                                       href="#pills2-profile"
                                                       role="tab" aria-controls="pills-profile" aria-selected="false">
                                                        <AppsIcon style={{fontSize: 30}} />
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="col-sm">
                                        <h2>Файлы</h2>
                                    </div>

                                    <div className="col-sm">
                                        <div className="float-right">
                                            <div className="row">
                                                <div className="col-6 p-0 searchBarBefore">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={this.state.filterText}
                                                        onChange={this.handleSearchBarChange}
                                                    />
                                                </div>
                                                <div className="p-0" style={{'zIndex': '100'}}>
                                                    <FontAwesomeIcon
                                                        className="tool"
                                                        onClick={this.handleOpenSearchBar}
                                                        transform="grow-10"
                                                        data-toggle="modal"
                                                        icon={faSearch}
                                                    />
                                                    <FontAwesomeIcon
                                                        className="tool" onClick={this.handleOpenDialog}
                                                        transform="grow-10" data-toggle="modal"
                                                        data-target="#exampleModal" icon={faUpload}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="tab-content" id="pills-tabContent">
                            <div
                                className="tab-pane fade show active" id="pills2-home"
                                role="tabpanel" aria-labelledby="pills-home-tab"
                            >
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th scope="col">Название</th>
                                        <th scope="col" />
                                        {this.props.groupModels ? <th scope="col">Пользователь</th> : null}
                                        <th scope="col">Тип</th>
                                        <th scope="col">Вес</th>
                                        <th scope="col">Загружено</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.models
                                        .filter(model => {
                                            // remove names that do not match
                                            return model.title.toLowerCase().indexOf(this.state.filterText.toLowerCase()) >= 0
                                        })
                                        .map((model, i) => (
                                            <FileItemComponent
                                                id={model.file_id} filename={model.title} type={model.type}
                                                sizeKB={model.sizeKB} createdTime={model.createdTime}
                                                name={this.props.name} groupId={this.props.groupId} key={i}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div
                                className="tab-pane fade" id="pills2-profile"
                                role="tabpanel" aria-labelledby="pills-profile-tab"
                            >
                                <table className="table">
                                    <tbody>
                                    {this.state.models
                                        .filter(model => {
                                            // remove names that do not match
                                            return model.title.toLowerCase().indexOf(this.state.filterText.toLowerCase()) >= 0
                                        })
                                        .map((model, i) => (
                                            <FileItemCardComponent
                                                id={model.file_id} filename={model.title} name={this.props.name}
                                                groupId={this.props.groupId} key={i} type={model.type}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
                <NotificationsComponent />
            </div>
        );
    }
}
