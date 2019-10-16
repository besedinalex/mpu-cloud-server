import React, {Component} from "react";
import {Link} from "react-router-dom";

import {isAuthenticated} from "../../services/authentication";

import './LandingView.css';
import HeaderComponent from "../HeaderComponent";

class LandingView extends Component {
    state = {
        isAuthenticated: isAuthenticated
    };

    render() {
        const loggedIn = this.state.isAuthenticated;

        const carouselContent = [
            {
                text: 'Храните все модели в одном месте',
                desc: 'Все ваши разработки будут в одном месте. Вы можете получить к ним доступ в в любое время любом месте прямо в вашем браузере.',
                img: 'https://image.flaticon.com/icons/svg/1055/1055686.svg'
            },
            {
                text: 'Поддерживает более 18 форматов',
                desc: 'Конвертирует ваши модели из множества форматов, например таких как ACIS, IGES, JT, Parasolid, STEP, STL, VRML, GRDECL, C3D в GLTF. Вы также можете загрузить модель к себе в любом из этих форматов',
                img: 'https://image.flaticon.com/icons/svg/2205/2205505.svg'
            },
            {
                text: 'Группы',
                desc: 'Объединяйтесь в группы для совместной работы над общими проектами.',
                img: 'https://image.flaticon.com/icons/svg/1039/1039369.svg'
            },
            {
                text: 'Доступ с любого устройства',
                desc: 'Вы можете смотреть, вращать и показывать свои работы с любого устройства на котором есть веб браузер.',
                img: 'https://image.flaticon.com/icons/svg/344/344516.svg'
            }
        ];

        const carouselScrolling = carouselContent.map((item, i) => {
            return (
                <li data-target="#myCarousel" data-slide-to={i} className={i === 0 ? 'active' : null} key={i} />
            );
        });

        const carouselItems = carouselContent.map((item, i) => {
            return (
                <div className={i === 0 ? 'carousel-item active' : 'carousel-item'} key={i}>
                    <svg className="bd-placeholder-img" width="100%" height="100%"
                         xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
                         focusable="false" role="img">
                        <rect width="100%" height="100%" fill="#79ccf0" />
                    </svg>
                    <div className="container">
                        <div className="carousel-caption">
                        <object width="25%" height="25%" type="image/svg+xml" data={item.img} id="object" class="icon"/>
                            <h1>{item.text}</h1>
                            <p>{item.desc}</p>
                        </div>
                    </div>
                </div>
            );
        });

        return (
            <div>
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
                        {carouselScrolling}
                    </ol>
                    <div className="carousel-inner">
                        {carouselItems}
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
