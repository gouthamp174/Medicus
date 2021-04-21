import React from 'react';
import { Row, Col } from "../../components/layout.js";


export default function FooterBar(props) {
  return (
    <footer className="row md-bg-0 justify-content-center">
      <Col className="col-auto">
        <Row className="pt-1 align-items-center">
          <i className="material-icons md-24">copyright</i>
          <p className="my-2">Copyright by Goutham Prasanna.</p>
        </Row>
      </Col>
    </footer>
  );
}
