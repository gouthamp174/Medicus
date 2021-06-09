import React from 'react';
import { useExtendClass } from "./hooks.js";


export function Container(props) {  
    return (
        <div ref={props.ref} id={props.id} className={useExtendClass("container", props.className)}>
            {props.children}
        </div>
    );
}


export function FluidContainer(props) {
    return (
        <div ref={props.ref} id={props.id} className={useExtendClass("container-fluid", props.className)}>
            {props.children}
        </div>
    );
}


export function Row(props) {
    return (
        <div ref={props.ref} id={props.id} className={useExtendClass("row", props.className)}>
            {props.children}
        </div>
    );
}


export function Col(props) {  
    return (
        <div ref={props.ref} id={props.id} className={useExtendClass("col", props.className)}>
            {props.children}
        </div>
    );
}


export function RowDivider(props) {
    return (
        <Row {...props} >
            <Col className="px-0">
                <div className="border-top" />
            </Col>
        </Row>
    );
}


export function Header(props) {
    return (
        <header ref={props.ref} id={props.id} className={useExtendClass("row", props.className)}>
            {props.children}
        </header>
    );
}


export function Footer(props) {
    return (
        <footer ref={props.ref} id={props.id} className={useExtendClass("row", props.className)}>
            {props.children}
        </footer>
    );
}


export function DescriptionList(props) {
    return (
        <dl ref={props.ref} id={props.id} className={useExtendClass("row", props.className)}>
            {props.children}
        </dl>
    );
}


export function DescriptionTerm(props) {
    return (
        <dt ref={props.ref} id={props.id} className={useExtendClass("col", props.className)}>
            {props.children}
        </dt>
    );
}


export function DescriptionDetails(props) {
    return (
        <dd ref={props.ref} id={props.id} className={useExtendClass("col", props.className)}>
            {props.children}
        </dd>
    );
}