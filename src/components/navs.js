import React from 'react';
import { Link } from 'react-router-dom';
import { useExtendClass } from "./hooks.js";


export function Nav(props) {
    const className = useExtendClass("nav", props.className);

    if (props.asList) {
        return (
            <ul className={className}>{props.children}</ul>
        );
    } else {
        return (
            <nav className={className}>{props.children}</nav>
        );
    }
}


export function NavItem(props) {
    return (
        <li className={useExtendClass("nav-item", props.className)}>
            {props.children}
        </li>
    );
}


export function NavBar(props) {
    return (
        <nav className={useExtendClass("navbar", props.className)}>{props.children}</nav>
    );
}


export function NavBrand(props) {
    let className = useExtendClass("navbar-brand", props.className);
    if (props.isLink) {
        return(
            <Link to={props.url} className={className} >{props.children}</Link>
        );
    } else {
        return (
            <span className={className}>{props.children}</span>
        );
    }
}


export function NavToggler(props) {
    const toggleType = (props.toggleType) ? props.toggleType: "collapse";
    return (
        <button type="button" data-toggle={toggleType} data-target={`#${props.target}`} 
            className={useExtendClass("navbar-toggler", props.className)}
            aria-controls={`${props.target}`} aria-expanded="false" aria-label={props.label}>
            {props.children}
        </button>
    );
}


export function NavCollapsible(props) {
    return (
        <div id={`${props.id}`} className={useExtendClass("collapse navbar-collapse", props.className)}>
            {props.children}
        </div>
    );
}


export function NavLinks(props) {
    return (
        <ul className={useExtendClass("navbar-nav", props.className)}>
            {props.children}
        </ul>
    );
}


export function NavDropdown(props) {
    return (
        <NavItem className={useExtendClass("dropdown", props.className)}>
            {props.children}
        </NavItem>  
    );
}


export function NavLink(props) {
    return (
        <NavItem className="d-flex align-items-center">
            <Link to={props.path} exact={props.exact} role={props.role}
                className={useExtendClass("nav-link w-100", props.className)}
                onClick={props.handleClick} data-toggle="tooltip" title={props.tooltip}>
                {props.children}
            </Link>
        </NavItem>  
    );
}


export function NavDropdownLink(props) {
    return (
        <Link href="#" id={props.id} role="button"
            className={useExtendClass("nav-link dropdown-toggle", props.className)} 
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {props.children}
        </Link>
    );
}


export function NavDropdownMenu(props) {
    return (
        <div className={useExtendClass("dropdown-menu", props.className)} aria-labelledby={props.labelledby}>
            {props.children}
        </div>
    );
}

export function NavDropdownMenuHeader(props) {
    return (
        <h6 class={useExtendClass("dropdown-header", props.className)}>
            {props.children}
        </h6>
    );
}


export function NavDropdownMenuItem(props) {
    return (
        <Link to={props.path} exact={props.exact}
            className={useExtendClass("dropdown-item", props.className)}
                onClick={props.handleClick} data-toggle="tooltip" title={props.title}>
            {props.children}
        </Link>
    );   
}
