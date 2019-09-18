import React, {Component} from "react";
import {Link} from "react-router-dom";

import {isAuthenticated} from "../../services/authentication";

import HeaderComponent from "../HeaderComponent";

import './LandingView.css';

class LandingView extends Component {
    state = {
        isAuthenticated: isAuthenticated()
    };

    render() {
        const loggedIn = this.state.isAuthenticated;
        const carouselItems = [
            {
                text: 'Храни все модели в одном месте',
                desc: 'Все ваши разработки будут в одном месте. Вы можете получить к ним доступ в в любое время любом месте прямо в вашем браузере.',
                img: '',
                id: 0
            },
            {
                text: 'GLTF',
                desc: 'Конвертирует ваши модели из множества распространненых форматов (например, из STEP) в GLTF.',
                img: ''
            },
            {
                text: 'Доступ с любого устройства',
                desc: 'Вы можете смотреть, вращать и показывать свои работы с любого устройства на котором есть веб браузер.',
                img: ''
            }
        ];
        return (
            <div className="margin-for-header">
                <HeaderComponent />
                <div className="position-relative overflow-hidden p-3 p-md-3 text-center bg-light">
                    <div className="col-md-5 p-lg-5 mx-auto my-5">
                        <h1 className="display-4 font-weight-normal">MPU Cloud</h1>
                        <p className="lead font-weight-normal">Лучшее облачное хранилище для инженеров.</p>
                        <div>
                            <Link hidden={loggedIn} className="btn btn-outline-info mx-1" to="/signup">Зарегистрироваться</Link>
                            <Link hidden={loggedIn} className="btn btn-outline-dark mx-1" to="/login">Войти</Link>
                            <Link hidden={!loggedIn} className="btn btn-outline-primary" to="/models">Ваши модели</Link>
                        </div>
                    </div>
                </div>

                <div id="myCarousel" className="carousel slide" data-ride="carousel">
                    <ol className="carousel-indicators">
                        <li data-target="#myCarousel" data-slide-to="0" className="active"/>
                        <li data-target="#myCarousel" data-slide-to="1" />
                        <li data-target="#myCarousel" data-slide-to="2" />
                    </ol>
                    <div className="carousel-inner">
                        {carouselItems.map(item => {
                            const itemClass = item.id === 0 ? 'carousel-item active' : 'carousel-item';
                            return (
                                <div className={itemClass}>
                                    <svg className="bd-placeholder-img" width="100%" height="100%"
                                         xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
                                         focusable="false" role="img">
                                        <rect width="100%" height="100%" fill="#777"/>
                                    </svg>
                                    <div className="container">
                                        <div className="carousel-caption">
                                            <h1>{item.text}</h1>
                                            <p>{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <a className="carousel-control-prev" href="#myCarousel" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true" />
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href="#myCarousel" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true" />
                        <span className="sr-only">Next</span>
                    </a>
                </div>

                <div className="position-relative overflow-hidden p-3 p-md-3 text-center bg-light">
                    <div className="col-md-5 p-lg-5 mx-auto my-5">
                        <h1 className="display-5 font-weight-normal">Начните пользоваться сегодня!</h1>
                    </div>
                </div>
            </div>
        );
    }
}

export default LandingView;
