import React from 'react';
import { Link } from "react-router-dom";
import { useExtendClass } from "./hooks.js";


/* Component Definitions */
export function List(props) {
    return (
        <div className={useExtendClass("list-group", props.className)}>
            {props.children}
        </div>
    );
}


export function FlushedList(props) {
    return (
        <List className={useExtendClass("list-group-flush", props.className)}>
            {props.children}
        </List>
  );
}


export function ListItem(props) {  
    return (
        <div className={useExtendClass("list-group-item", props.className)}>
            {props.children}
        </div>
    );
}


export function ListLink(props) {  
    return (
        <Link to={props.url} 
            className={useExtendClass("list-group-item list-group-action", props.className)}>
            {props.children}
        </Link>
    );
}


export function ListButton(props) {
    const { className, handleClick, ...otherProps } = props;

    return (
        <button type="button" onClick={handleClick} { ...otherProps }
            className={useExtendClass("list-group-item list-group-action", className)}>
            {props.children}
        </button>
    );
}