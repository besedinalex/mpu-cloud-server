import React, { Component } from "react";

import './LandingView.css';

import Header from "../components/Header";

class LandingView extends Component {
    render() {
        return (
            <body className="margin-for-header">
                <Header />
                <div className="position-relative overflow-hidden p-3 p-md-3 text-center bg-light">
                    <div className="col-md-5 p-lg-5 mx-auto my-5">
                        <h1 className="display-4 font-weight-normal">MPU Cloud</h1>
                        <p className="lead font-weight-normal">Designed to be the best cloud storage for engineers.</p>
                        <div>
                            <a className="btn btn-outline-info mx-1" href="#">Sign Up</a>
                            <a className="btn btn-outline-dark mx-1" href="#">Log In</a>
                        </div>
                    </div>
                    <div className="product-device shadow-sm d-none d-md-block"></div>
                    <div className="product-device product-device-2 shadow-sm d-none d-md-block"></div>
                </div>

                <div id="myCarousel" className="carousel slide" data-ride="carousel">
                    <ol className="carousel-indicators">
                        <li data-target="#myCarousel" data-slide-to="0" className="active"></li>
                        <li data-target="#myCarousel" data-slide-to="1"></li>
                        <li data-target="#myCarousel" data-slide-to="2"></li>
                    </ol>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <svg className="bd-placeholder-img" width="100%" height="100%"
                                 xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
                                 focusable="false" role="img">
                                <rect width="100%" height="100%" fill="#777"/>
                            </svg>
                            <div className="container">
                                <div className="carousel-caption">
                                    <h1>Keep your 3D models in one place</h1>
                                    <p>All your 3D models will be in one place. You can access them anytime anywhere in
                                        the world just from your browser.</p>
                                    <p><a className="btn btn-lg btn-primary" href="#" role="button">Placeholder</a></p>
                                </div>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <svg className="bd-placeholder-img" width="100%" height="100%"
                                 xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
                                 focusable="false" role="img">
                                <rect width="100%" height="100%" fill="#777"/>
                            </svg>
                            <div className="container">
                                <div className="carousel-caption">
                                    <h1>From many to GLTF</h1>
                                    <p>Converts your models from many popular formats (STP, STP, STP) to GLTF.</p>
                                    <p><a className="btn btn-lg btn-primary" href="#" role="button">Placeholder</a></p>
                                </div>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <svg className="bd-placeholder-img" width="100%" height="100%"
                                 xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
                                 focusable="false" role="img">
                                <rect width="100%" height="100%" fill="#777"/>
                            </svg>
                            <div className="container">
                                <div className="carousel-caption">
                                    <h1>View your model from any device</h1>
                                    <p>You can view, rotate, show your model from any device with web browser.</p>
                                    <p><a className="btn btn-lg btn-primary" href="#" role="button">Placeholder</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <a className="carousel-control-prev" href="#myCarousel" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href="#myCarousel" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>

                <div className="position-relative overflow-hidden p-3 p-md-3 text-center bg-light">
                    <div className="col-md-5 p-lg-5 mx-auto my-5">
                        <h1 className="display-5 font-weight-normal">Start using today!</h1>
                    </div>
                    <div className="product-device shadow-sm d-none d-md-block"></div>
                    <div className="product-device product-device-2 shadow-sm d-none d-md-block"></div>
                </div>
            </body>
        );
    }
}

export default LandingView;
