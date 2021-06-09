import React from 'react';
import { useExtendClass } from './hooks';


export function Icon(props) {
    return (
        <i className={useExtendClass("material-icons", props.className)}>
            {props.children}
        </i>
    );
}


export function SmIcon(props) {
    return (
        <Icon className={useExtendClass("md-16", props.className)}>
            {props.children}
        </Icon>
    );
}


export function MdIcon(props) {
    return (
        <Icon className={useExtendClass("md-18", props.className)}>
            {props.children}
        </Icon>
    );
}


export function LgIcon(props) {
    return (
        <Icon className={useExtendClass("md-20", props.className)}>
            {props.children}
        </Icon>
    );
}


export function XlIcon(props) {
    return (
        <Icon className={useExtendClass("md-24", props.className)}>
            {props.children}
        </Icon>
    );
}