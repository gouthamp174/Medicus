import React from 'react';
import { Switch, Route } from "react-router-dom";
import { SessionContext } from '../../context/context.js';

import AppointmentView from './appointmentView.js'
import NewAppointmentView from './newAppointmentView.js';
import { AllAppointmentsView, WaitingRoomView, PaymentsView } from './appointmentsView.js';


export default class AppointmentApp extends React.Component {
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
                <AppointmentView {...props} session={sessionCtx.session} />
              )}
            />
            <Route
              path=""
              render={(props) => {
                if (props.location.search) {
                  let searchParams = new URLSearchParams(this.props.location.search);

                  if (searchParams.has("view")) {
                    const viewName = searchParams.get("view");

                    if (viewName === "new") {
                      let physician = "";
                      if (searchParams.has("physician")) {
                        physician = searchParams.get("physician");
                      }

                      return (
                        <NewAppointmentView {...props} session={sessionCtx.session} physician={physician} />
                      );
                    } else if (viewName === "waiting") {
                      return (<WaitingRoomView {...props} session={sessionCtx.session} />);
                    } else if (viewName === "payments") {
                      return (<PaymentsView {...props} session={sessionCtx.session} />);
                    }
                  }
                }

                return (<AllAppointmentsView {...props} session={sessionCtx.session} />);
              }}
            />
          </Switch>
        )}
      </SessionContext.Consumer>
    );
  }
}
