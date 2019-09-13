import React, {Component} from 'react';

class Header extends Component {
    render() {
        return (
            <header className="navbar navbar-expand-lg py-3 navbar-dark bg-dark fixed-top">
                <a className="navbar-brand text-white">MPU Cloud</a>

                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Placeholder</a>
                        </li>
                    </ul>
                    <a className="mx-3" href="#">
                        <button className="btn btn-info">Sign Up</button>
                    </a>
                    <a href="#">
                        <button className="btn btn-light">Log In</button>
                    </a>
                    {/*<a href="#">*/}
                    {/*    <button className="btn btn-primary">Profile</button>*/}
                    {/*</a>*/}
                </div>
            </header>
        );
    }
}

export default Header;
