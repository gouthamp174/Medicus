import React from 'react';
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { SessionContext } from '../../context/context.js';
import { FluidContainer, Row, Col } from "../../components/layout.js";
import { TopBar } from '../home/topbar.js';

import SettingsView from "./settingsView.js";


export default class SettingsApp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FluidContainer className="h-100 overflow-y d-flex flex-column">
        <TopBar title="Settings" />
        <Row className="flex-grow-1">
          <Col className="py-3">
            <SessionContext.Consumer>
              {sessionCtx => (
                <Switch>
                  <Route
                    path={this.props.match.path}
                    exact={true}
                    render={(props) => (
                      <SettingsView {...props} session={sessionCtx.session} setSession={sessionCtx.setSession} />
                    )}
                  />
                </Switch>
              )}
            </SessionContext.Consumer>
          </Col>
        </Row>
      </FluidContainer>
    );
  }
}
