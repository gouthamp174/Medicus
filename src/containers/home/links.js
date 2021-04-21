import React from 'react';
import { Link } from "react-router-dom";
import { LgIcon } from "../../components/icons.js";
import { NavListItem } from "../../components/list.js";


export function NavLink(props) {
  let className="d-flex align-items-center";
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return (
    <Link to={props.path} exact={props.exact} className={className}
      onClick={props.handleClick} data-toggle="tooltip" title={props.tooltip}>
      {props.children}
    </Link>
  );
}


export function SideBarLink(props) {
  return (
    <NavListItem className="my-1">
      <NavLink
        className="nav-link px-1"
        path={props.path}
        exact={props.exact}
        handleClick={props.handleClick}
      >
        <LgIcon className="px-1">{props.icon}</LgIcon>
        <h6 className="my-0 pl-1 text-truncate">{props.title}</h6>
      </NavLink>
    </NavListItem>
  );
}


export function TopBarLink(props) {
  return (
    <NavLink
      className="nav-link btn btn-sm md-tpbar-btn m-1 px-2"
      path={props.path}
      exact={props.exact}
      tooltip={props.title}
      handleClick={props.handleClick}
    >
      <LgIcon>{props.icon}</LgIcon>
      <h6 className="ml-1 d-inline d-md-none my-0">{props.title}</h6>
    </NavLink>
  );
}


export function TopbarDropdownMenuLink(props) {
  return (
    <NavLink
      className="dropdown-item"
      path={props.path}
      exact={props.exact}
      handleClick={props.handleClick}
    >
      <LgIcon>{props.icon}</LgIcon>
      <p className="my-0 pl-1 text-truncate">{props.title}</p>
    </NavLink>
  );
}
