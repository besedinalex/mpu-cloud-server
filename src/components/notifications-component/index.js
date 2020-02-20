import React, { Component, Fragment } from "react";
import styled from "styled-components";
import ee from "event-emitter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  position: absolute;
  top: ${props => props.top}px;
  right: 16px;
  z-index: 99999999;
  transition: top 0.5s ease;
  > i {
    margin-left: 10px;
    color: #491217; !important
  }
`;
const emitter = new ee();

export const notify = msg => {
  emitter.emit("notification", msg);
};

export default class NotificationsComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      top: -100,
      msg: ""
    };

    this.timeout = null;
    emitter.on("notification", msg => {
      this.onShow(msg);
    });
  }

  //Если открыто, то закрыть с ускоренной анимацией и открыть затем.
  onShow = msg => {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.setState({ top: -100 }, () => {
        this.timeout = setTimeout(() => {
          this.showNotification(msg);
        }, 500);
      });
    } else {
      this.showNotification(msg);
    }
  };

  //Открыть уведомление с анимацией
  showNotification = msg => {
    this.setState(
      {
        top: 16,
        msg
      },
      () => {
        this.timeout = setTimeout(() => {
          this.setState({
            top: -100
          });
        }, 3000);
      }
    );
  };
  render() {
    return (
      <Fragment>
        <Container top={this.state.top}>
          {this.state.msg}
          <i>
            <FontAwesomeIcon icon={faBell} transform="grow-10" />
          </i>
        </Container>
      </Fragment>
    );
  }
}
