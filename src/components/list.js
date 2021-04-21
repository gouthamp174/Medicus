import React from 'react';
import { Link } from "react-router-dom";


/* Component Definitions */
export function List(props) {
  let className="list-group";
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return (
    <div className={className}>
      {props.children}
    </div>
  );
}

export function FlushedList(props) {
  let className="list-group-flush";
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return (
    <List className={className}>
      {props.children}
    </List>
  );
}

export function ListItem(props) {
  let className="list-group-item";
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return (
    <div className={className}>
      {props.children}
    </div>
  );
}

export function ListLink(props) {
  let className="list-group-item list-group-action";
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return (
    <Link to={props.url} className={className}>
      {props.children}
    </Link>
  );
}


export function NavList(props) {
  let className="nav";
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return (
    <ul className={className}>
      {props.children}
    </ul>
  );
}


export function NavListItem(props) {
  let className="nav-item";
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return (
    <li className={className}>
      {props.children}
    </li>
  );
}
