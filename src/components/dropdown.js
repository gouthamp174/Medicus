import React from 'react';
import { Link } from 'react-router-dom';
import { useExtendClass } from './hooks';


export function Dropdown(props) {
    return (
        <div className={useExtendClass("dropdown", props.className)}>
            {props.children}
        </div>
    );
}


export function DropdownButton(props) {
    return (
        <button type="button" id={props.id} data-toggle="dropdown" 
            className={useExtendClass("btn", props.className)}
            aria-haspopup="true" aria-expanded="false">
            {props.children}
        </button>
    );
}


export function DropdownButtonToggle(props) {
    return (
        <button type="button" id={props.id} data-toggle="dropdown"
            className={useExtendClass("btn dropdown-toggle", props.className)}
            aria-haspopup="true" aria-expanded="false">
            {props.children}
        </button>
    );
}

export function DropdownMenu(props) {
    return (
        <div aria-labelledby={props.labelledBy}
            className={useExtendClass("dropdown-menu", props.className)} >
            {props.children}
        </div>
    );
}

export function DropdownMenuDivider(props) {
    return (
        <div className={useExtendClass("dropdown-divider", props.className)}></div>
    );
}

export function DropdownMenuLink(props) {
    return (
        <Link 
            to={props.url} exact={props.exact}
            className={useExtendClass("dropdown-item", props.className)}
        >
                {props.children}
        </Link>
    );
}

export function DropdownMenuButton(props) {
    return (
        <button type="button" onClick={props.handleClick}
            className={useExtendClass("dropdown-item", props.className)}
                name={props.name} value={props.value} disabled={Boolean(props.disabled)}
        >
            {props.children}
        </button>
    );
}