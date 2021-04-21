import React from 'react';

export function Icon(props) {
  let className = "material-icons";
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return (
    <i className={className}>{props.children}</i>
  );
}

export function SmIcon(props) {
  let className = "md-16";
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return (
    <Icon className={className}>{props.children}</Icon>
  );
}

export function MdIcon(props) {
  let className = "md-18";
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return (
    <Icon className={className}>{props.children}</Icon>
  );
}

export function LgIcon(props) {
  let className = "md-20";
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return (
    <Icon className={className}>{props.children}</Icon>
  );
}
