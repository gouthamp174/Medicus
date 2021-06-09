import React from 'react';
import { NavLink } from 'react-router-dom';
import { useExtendClass } from '../../components/hooks';
import { Nav } from '../../components/navs';


export function SubtitleBarLink(props) {
    return (
        <NavLink
            to={props.path}
            exact={props.exact}
            className={useExtendClass("nav-link md-sbtbar-link mx-1", props.className)}
        >
            {props.title}
        </NavLink>
    );
}


export default function SubtitleBar(props) {
    return (
        <Nav className="nav-pills p-1 md-sbtbar">
            {props.children}
        </Nav>
    );
}