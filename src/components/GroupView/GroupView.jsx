import React, {Component} from "react";

import ModelsView from "../ModelsView/ModelsView";
import UsersView from "../UsersComponent/UsersView";

import LabelBottomNavigation from "../../services/bottomNavigation";

import {makeStyles} from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FolderIcon from '@material-ui/icons/Folder';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import HeaderComponent from "../HeaderComponent";

class GroupView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groupId: this.props.match.params.id,
            models: [],
            isDialogOpen: false,
            title: "",
            desc: "",
            filename: "",
            isUploaded: false
        };
        const useStyles = makeStyles({
            root: {
                width: 500,
            },
        });
        this.getNavigation = this.getNavigation.bind(this);
    }


    getNavigation = () =>
        LabelBottomNavigation();


    render() {
        return (
            <div>
              <HeaderComponent />
                <main role="main" class="container margin-after-header">
                    <div class="jumbotron" style={{background: "white"}}>
                        <h1>Группа #{this.state.groupId}</h1>
                        <p>
                            Этот шаблон <strong>фиксированной панели навигации</strong> создан
                            для наглядного примера. Меню растянуто на всю ширину экрана и{" "}
                            <strong>всегда</strong> прижато к верхней части страницы.
                        </p>
                    </div>


                    <button onClick={this.getNavigation}>Hook doesn't work</button>
                    <ModelsView groupModels={true} groupId={this.state.groupId} />
                    <UsersView />
                </main>
            </div>
        );
    }
}

export default GroupView;
