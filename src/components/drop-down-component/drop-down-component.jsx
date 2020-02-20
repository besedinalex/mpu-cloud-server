import React, {Component} from "react";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";

export default class DropDownComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleClose = (event) => {
        if (event.target.textContent != "") {
            this.props.updateFormatData(event.target.textContent);
            return;
        }
    };

    render() {
        return (
            <div style={{position: 'absolute', display: 'flex'}}>
                <Paper>
                    <MenuList id="menu-list-grow">
                        <MenuItem onClick={this.handleClose}>STEP</MenuItem>
                        <MenuItem onClick={this.handleClose}>STL</MenuItem>
                        <MenuItem onClick={this.handleClose}>ACIS</MenuItem>
                        <MenuItem onClick={this.handleClose}>IGES</MenuItem>
                        <MenuItem onClick={this.handleClose}>VRML</MenuItem>
                    </MenuList>
                </Paper>
            </div>
        );
    }
}
