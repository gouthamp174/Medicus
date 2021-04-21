import React from 'react';

/* Component Definitions */
export function Card(props) {
  return (
    <div className={(props.className) ? `card ${props.className}`: "card"}>
      {props.children}
    </div>
  );
}

export function CardHeader(props) {
  return (
    <div className={(props.className) ? `card-header ${props.className}`: "card-header"}>
      {props.children}
    </div>
  );
}

export function CardBody(props) {
  return (
    <div className={(props.className) ? `card-body ${props.className}`: "card-body"}>
      {props.children}
    </div>
  );
}

export function CardFooter(props) {
  return (
    <div className={(props.className) ? `card-footer ${props.className}`: "card-footer"}>
      {props.children}
    </div>
  );
}

export function BodyCard(props) {
  return (
    <div className={(props.className) ? `card card-body ${props.className}`: "card card-body"}>
      {props.children}
    </div>
  );
}
