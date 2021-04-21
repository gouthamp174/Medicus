import React from 'react';
import { AppLogo } from '../../components/utils.js';
import { SessionContext } from '../../context/context.js';


export default class HeaderBar extends React.Component {
  render() {
    return (
      <header className="row md-bg-1">
        <nav className="col navbar navbar-expand-md navbar-dark md-bg-1">
          <a className="navbar-brand d-inline d-md-none" href="#">
            <AppLogo />
          </a>
        </nav>
      </header>
    );
  }
}
