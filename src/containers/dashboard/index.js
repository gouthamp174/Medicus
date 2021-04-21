import React from 'react';
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { SessionContext } from '../../context/context.js';
import { FluidContainer, Row, Col } from "../../components/layout.js";
import { WidgetRow } from "../../components/widget.js";

import { TopBar } from '../home/topbar.js';
import WelcomeWidget from "./widgets/welcomeWidget.js";
import WaitingAppointments from "./widgets/waitingAppointments.js";
import RecentMedicationsWidget from "./widgets/recentMedicationsWidget.js";
import RecentPaymentsWidget from "./widgets/recentPaymentsWidget.js";


export default class DashboardApp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FluidContainer className="h-100 overflow-y d-flex flex-column">
        <TopBar title="Dashboard" />
        <Row className="flex-grow-1">
          <Col className="py-3">
            <SessionContext.Consumer>
              {sessionCtx => (
                <FluidContainer>
                  <WidgetRow>
                    <Col>
                      <WelcomeWidget
                        session={sessionCtx.session}
                      />
                    </Col>
                  </WidgetRow>
                  <WidgetRow>
                    <Col className="col-12 col-md">
                      <WaitingAppointments
                        session={sessionCtx.session}
                      />
                    </Col>
                    {!sessionCtx.session.isPhysician &&
                      <Col className="col-12 col-md">
                        <RecentMedicationsWidget
                          session={sessionCtx.session}
                        />
                      </Col>
                    }
                    <Col className="col-12 col-md">
                      <RecentPaymentsWidget
                        session={sessionCtx.session}
                      />
                    </Col>
                  </WidgetRow>
                </FluidContainer>
              )}
            </SessionContext.Consumer>
          </Col>
        </Row>
      </FluidContainer>
    );
  }
}
