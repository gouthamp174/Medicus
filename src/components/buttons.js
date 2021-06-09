import React from 'react';
import { useExtendClass } from "./hooks.js";


export function ToolTipButton(props) {
    return (
        <button type="button" id={props.id} name={props.name}
            className={useExtendClass("btn", props.className)}
                data-toggle="tooltip" data-placement="bottom" title={props.title}
                    onClick={props.handleClick} disabled={(props.disabled) ? true: false}>
            {props.children}
        </button>
    );
}


export function DropdownButton(props) {
    return (
        <button type="button" id={props.id} name={props.name}
            className={useExtendClass("btn", props.className)} 
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                    disabled={(props.disabled) ? true: false}>
            {props.children}
        </button>
    );
}


export function Button(props) {
    const {propsClassName, ...otherProps} = props;
    const className = useExtendClass("d-flex align-items-center", props.className);
    
    if (props.isDropdown) {
        return <DropdownButton className={className} {...otherProps} />
    } else {
        return <ToolTipButton className={className} {...otherProps} />
    }
}


export function SmButton(props) {
    const {className, ...otherprops} = props;
    return (
        <Button className={useExtendClass("btn-sm", className)} {...otherprops}>
            {props.children}
        </Button>
    );
}


export function LgButton(props) {
    const {className, ...otherprops} = props;
    return (
        <Button className={useExtendClass("btn-lg", props.className)} {...otherprops}>
            {props.children}
        </Button>
    );
}