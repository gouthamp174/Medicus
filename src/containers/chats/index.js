import React from 'react';
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { SessionContext } from '../../context/context.js';

import ChatView from "./chatView.js";


export default class ChatApp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SessionContext.Consumer>
        {sessionCtx => (
          <Switch>
            <Route
              path={`${this.props.match.path}/:id`}
              render={(props) => (
                <ChatView {...props} session={sessionCtx.session} />
              )}
            />
          </Switch>
        )}
      </SessionContext.Consumer>
    );
  }
}
