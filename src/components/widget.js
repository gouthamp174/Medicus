import React from 'react';
import { FluidContainer, Row } from "./layout.js";
import { Card, CardBody, BodyCard } from "./card.js";
import { List, ListItem } from "./list.js";
import { CircularButton, CircularDropdownButton } from "./buttons.js";
import { SmIcon } from "./icons.js";


/* Component Definitions */
export function WidgetRow(props) {
  return (
    <Row className="mb-2">
      {props.children}
    </Row>
  );
}

export function Widget(props) {
  return (
    <Card className="md-widget mb-3">
      {props.children}
    </Card>
  );
}

export function InfoWidget(props) {
  return (
    <BodyCard className="md-widget mb-2">
      {props.children}
    </BodyCard>
  );
}

export function TitleBar(props) {
  return (
    <nav className="card-header navbar md-title bg-transparent px-3 py-1">
      <h6 className="navbar-brand text-muted my-1 py-0">{props.title}</h6>
      {props.children}
    </nav>
  );
}

export function TitleButtons(props) {
  let className = "nav";
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return (
    <ul className={className}>
     {props.children}
    </ul>
  );
}

export function TitleButton(props) {
  return (
    <button type="button" className="btn btn-sm btn-round px-2 d-flex align-items-center"
      data-toggle="tooltip" title={props.name} onClick={props.handleClick}>
      <SmIcon>{props.icon}</SmIcon>
    </button>
  );
}

export function WidgetBody(props) {
  return (
    <CardBody className="px-3 py-2">
      {props.children}
    </CardBody>
  );
}

export function WidgetList(props) {
  return (
    <List className="list-group-flush">
      {props.children}
    </List>
  )
}

export function WidgetListItem(props) {
  return (
    <ListItem className="p-2">
      {props.children}
    </ListItem>
  )
}

export function WidgetDropdown(props) {
  return (
    <div className="dropdown">
      <CircularDropdownButton id={props.id} className="btn-sm">
        <SmIcon>more_vert</SmIcon>
      </CircularDropdownButton>
      <div className="dropdown-menu dropdown-menu-right" aria-labelledby={props.id}>
        {props.children}
      </div>
    </div>
  );
}

export function WidgetDropdownItem(props) {
  return (
    <button type="button" className="dropdown-item" onClick={props.handleClick}>
      {props.name}
    </button>
  );
}
