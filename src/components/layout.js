import React from 'react';


export function Container(props) {
  let className="container"
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return (
    <div className={className}>{props.children}</div>
  );
}

export function FluidContainer(props) {
  let className="container-fluid"
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return (
    <div className={className}>{props.children}</div>
  );
}

export function Row(props) {
  let className="row"
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return (
    <div className={className}>{props.children}</div>
  );
}

export function Col(props) {
  let className="col"
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return (
    <div className={className}>{props.children}</div>
  );
}

export function RowDivider(props) {
  return (
    <Row className={props.className}>
      <Col className="px-0">
        <div className="border-top" />
      </Col>
    </Row>
  );
}
