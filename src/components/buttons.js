import React from 'react';

export function Button(props) {
  let className = "btn";
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return (
    <button type="button" id={props.id} className={className} name={props.name}
      data-toggle="tooltip" data-placement="bottom" title={props.title}
        onClick={props.handleClick} disabled={(props.disabled) ? true: false}>
      {props.children}
    </button>
  );
}


export function CircularButton(props) {
  let className="btn-round p-1 d-flex align-items-center"
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return(
    <Button id={props.id} className={className} name={props.name} title={props.title}
      handleClick={props.handleClick} disabled={props.disabled}>
      {props.children}
    </Button>
  );
}


export function SmButton(props) {
  let className = "btn-sm";
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return (
    <Button className={className} name={props.name} title={props.title}
      handleClick={props.handleClick} disabled={props.disabled}>
      {props.children}
    </Button>
  );
}

export function LgButton(props) {
  let className = "btn-lg";
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return (
    <Button className={className} name={props.name} title={props.title}
      handleClick={props.handleClick} disabled={props.disabled}>
      {props.children}
    </Button>
  );
}


export function DropdownButton(props) {
  let className = "btn";
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return (
    <button type="button" id={props.id} className={className} name={props.name}
      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
        disabled={(props.disabled) ? true: false}>
      {props.children}
    </button>
  );
}

export function CircularDropdownButton(props) {
  let className="btn-round p-1 d-flex align-items-center"
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return(
    <DropdownButton id={props.id} className={className} name={props.name}
      disabled={props.disabled}>
      {props.children}
    </DropdownButton>
  );
}
