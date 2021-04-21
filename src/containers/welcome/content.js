import React from 'react';
import { FluidContainer, Row, Col, RowDivider } from "../../components/layout.js";
import { InfoWidget } from "../../components/widget.js";
import { SessionContext } from '../../context/context.js';

import SignInForm from "./signInForm.js";
import RegisterForm from './registerForm.js';


function ContentMedia() {
  return (
    <FluidContainer className="container-fluid">
      <h1 className="md-fg-0 text-center font-weight-bold">medicus</h1>
      <h4 className="md-fg-0 text-center">Your Physician. Any time. Any where.</h4>
    </FluidContainer>
  );
}


export default class ContentBar extends React.Component {
  render() {
    return (
      <Row className="justify-content-center flex-grow-1 md-bg-1">
        <Col className="col col-lg-11 col-xl-10 d-flex align-items-start align-items-md-center">
          <Row className="flex-grow-1">
            <Col className="col-md-8 d-none d-md-inline align-self-center">
              <ContentMedia />
            </Col>
            <Col className="col-12 col-md-4 py-3">
              <SessionContext.Consumer>
                {sessionCtx => (
                  <InfoWidget>
                    <FluidContainer>
                      <Row>
                        <Col className="px-0">
                          <SignInForm signIn={sessionCtx.signIn}/>
                        </Col>
                      </Row>
                      <RowDivider className="my-2" />
                      <Row className="mt-3">
                        <Col className="px-0">
                          <RegisterForm signIn={sessionCtx.signIn}/>
                        </Col>
                      </Row>
                    </FluidContainer>
                  </InfoWidget>
                )}
              </SessionContext.Consumer>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
