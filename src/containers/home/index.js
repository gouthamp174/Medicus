import React from 'react';
import { Switch, Route } from "react-router-dom";
import { SessionContext } from '../../context/context.js';
import { FluidContainer, Row, Col } from "../../components/layout.js";

import SideBar from './sideBar.js';
import DashboardApp from "../dashboard";
import UserApp from '../users';
import AppointmentApp from '../appointments';
import ChatApp from '../chats';
import SettingsApp from "../settings";


export default class HomeApp extends React.Component {
  constructor(props) {
    super(props);

    this.routes = [
      {
        path: "/",
        exact: true,
        component: DashboardApp
      },
      {
        path: "/users",
        component: UserApp
      },
      {
        path: "/appointments",
        component: AppointmentApp
      },
      {
        path: "/chats",
        component: ChatApp
      },
      {
        path: "/settings",
        component: SettingsApp
      }
    ]
  }

	render() {
		return (
			<FluidContainer className="h-100">
        <Row className="h-100">
          <SessionContext.Consumer>
            {sessionCtx => (
              <SideBar session={sessionCtx.session} signOut={sessionCtx.signOut} />
            )}
          </SessionContext.Consumer>
          <Col className="col-md-9 offset-md-3 col-xl-10 offset-xl-2 h-100 px-0">
            <Switch>
              {this.routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  children={(props) => (
                    <route.component {...props} />
                  )}
                />
              ))}
            </Switch>
          </Col>
        </Row>
			</FluidContainer>
		);
	}
}
