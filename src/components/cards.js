import React from 'react';
import { useExtendClass } from "./hooks.js";


export function Card(props) {
    const { className, ...otherProps } = props;
    return (
        <div className={useExtendClass("card", className)} { ...otherProps } >
            {props.children}
        </div>
    );
}


export function CardHeader(props) {
    const { className, ...otherProps } = props;
    return (
        <div className={useExtendClass("card-header", className)} { ...otherProps } >
            {props.children}
        </div>
    );
}


export function CardBody(props) {
    const { className, ...otherProps } = props;
    return (
        <div className={useExtendClass("card-body", className)} { ...otherProps } >
            {props.children}
        </div>
    );
}


export function CardFooter(props) {
    const { className, ...otherProps } = props;
    return (
        <div className={useExtendClass("card-footer", className)} { ...otherProps } >
            {props.children}
        </div>
    );
}


export function BodyCard(props) {
    const { className, ...otherProps } = props;
    return (
        <div className={useExtendClass("card card-body", className)} { ...otherProps } >
            {props.children}
        </div>
    );
}
