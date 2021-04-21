import React from 'react';
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { SessionContext } from '../../context/context.js';

import { PhysiciansView, PatientsView } from "./usersView.js";
import UserView from "./userView.js";


export default class UserApp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SessionContext.Consumer>
        {sessionCtx => (
          <Switch>
            <Route
              path={this.props.match.path}
              exact={true}
              render={(props) => {
                if (sessionCtx.session.isPhysician) {
                  return (
                    <PatientsView {...props} session={sessionCtx.session} />
                  );
                } else {
                  return (
                    <PhysiciansView {...props} session={sessionCtx.session} />
                  );
                }
              }}
            />
            <Route
              path={`${this.props.match.path}/:username`}
              render={(props) => (
                <UserView
                  {...props}
                  key={props.match.params.username}
                  username={props.match.params.username}
                  session={sessionCtx.session}
                />
              )}
            />
          </Switch>
        )}
      </SessionContext.Consumer>
    );
  }
}
