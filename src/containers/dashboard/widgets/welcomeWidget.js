import React from 'react';
import { FluidContainer, Row, Col } from "../../../components/layout.js";
import { InfoWidget } from "../../../components/widget.js";
import { getUserFullName } from "../../../components/users.js";


export default function WelcomeWidget(props) {
  return (
    <InfoWidget>
      <FluidContainer>
        <Row className="justify-content-center">
          <Col className="align-items-center">
            {(props.session) ?
              <>
                <h6 className="text-center my-0">{`Welcome ${getUserFullName(props.session)}!`}</h6>
              </> :
              <>
                <p className="text-center my-0">Loading...</p>
              </>
            }
          </Col>
        </Row>
      </FluidContainer>
    </InfoWidget>
  );
}
