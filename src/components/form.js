import React from 'react';

export function Form(props) {
  let className="";
  if (props.className) {
    className = className.concat(" ", props.className)
  }

  let enctype = "application/x-www-form-urlencoded";
  if (props.enctype) {
    enctype = props.enctype;
  }

  return (
    <form method="post" autoComplete={props.autoComplete} className={className}
      onSubmit={props.handleSubmit} enctype={enctype}>
      {props.children}
    </form>
  );
}

export function FormRow(props) {
  let className="form-row";
  if (props.className) {
    className = className.concat(" ", props.className)
  }

  return (
    <div className={className}>
      {props.children}
    </div>
  );
}

export function FormGroup(props) {
  let className="form-group";
  if (props.className) {
    className = className.concat(" ", props.className)
  }

  return (
    <div className={className}>
      {props.children}
    </div>
  );
}

export function FormGroupRow(props) {
  let className="form-group row";
  if (props.className) {
    className = className.concat(" ", props.className)
  }

  return (
    <div className={className}>
      {props.children}
    </div>
  );
}

export function FormButton(props) {
  let className="btn";
  if (props.className) {
    className = className.concat(" ", props.className)
  }

  return (
    <button type="button" className={className}>
      {props.children}
    </button>
  );
}

export function FormSubmit(props) {
  let className="btn btn-primary";
  if (props.className) {
    className = className.concat(" ", props.className)
  }

  return (
    <button type="submit" className={className} disabled={props.disabled}>
      {props.children}
    </button>
  );
}

export function FormText(props) {
  let className="form-control-plaintext";
  if (props.className) {
    className = className.concat(" ", props.className)
  }

  return (
    <input type="text" id={props.id} className={className} value={props.value} readOnly />
  );
}

export function FormLabel(props) {
  let className="col-form-label";
  if (props.className) {
    className = className.concat(" ", props.className)
  }

  return (
    <label htmlFor={props.for} className={className}>
      {props.children}
    </label>
  );
}

export function FormLegend(props) {
  let className="col-form-label";
  if (props.className) {
    className = className.concat(" ", props.className)
  }

  return (
    <legend htmlFor={props.for} className={className}>
      {props.children}
    </legend>
  );
}
