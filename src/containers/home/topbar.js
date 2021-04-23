import React from 'react';
import { Link } from "react-router-dom";
import { SessionContext } from '../../context/context.js';
import { FluidContainer, Row, Col } from "../../components/layout.js";
import { Form } from '../../components/form.js';
import { LgIcon } from "../../components/icons.js";
import { ProfilePhoto } from "../../components/users.js";
import { TopBarLink, TopbarDropdownMenuLink, SignOutLink } from "./links.js";

// Re export top bar link components.
export { TopBarLink, TopbarDropdownMenuLink };


export class SearchForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: ""
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    event.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    event.preventDefault();

    if (this.props.handleSearch) {
      this.props.handleSearch(this.state.query);
    }
  }

  render() {
    return (
      <Form className="form-inline p-1" handleSubmit={this.handleSubmit}>
        <input type="search" name="query" className="form-control w-100 mr-md-2" placeholder="Search..."
          value={this.state.query} onChange={this.handleChange} aria-label="Search" aria-describedby="">
        </input>
      </Form>
    );
  }
}


export function TopBarButton(props) {
  return (
    <li className="nav-item topbar-link">
      <Link role="button" className="nav-link btn btn-sm btn-white px-2 d-flex align-items-center"
        data-toggle="tooltip" title={props.title} onClick={props.handleClick}>
        <i className="material-icons md-24">{props.icon}</i>
        <h6 className="d-inline d-md-none my-0 align-self-center">{props.title}</h6>
      </Link>
    </li>
  );
}

export function TopBarLinks(props) {
  let className = "navbar-nav";
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return (
    <ul className={className}>
     {props.children}
    </ul>
  );
}

export function TopBar(props) {
  return (
    <header className="row md-tpbar">
      <Col className="p-0">
        <nav className="navbar navbar-expand-md navbar-light rounded justify-content-md-between">
          <button type="button" data-toggle="collapse" data-target="#sidebar1"
            className="navbar-toggler btn-round md-tpbar-btn d-flex align-items-center p-2 d-inline d-md-none"
              aria-controls="sidebar1" aria-expanded="false" aria-label="Toggle Side bar navigation">
            <LgIcon>menu</LgIcon>
          </button>
          <span className="navbar-brand">{props.title}</span>
          <button type="button" data-toggle="collapse" data-target="#topNavbar1"
            className="navbar-toggler btn-round md-tpbar-btn d-flex align-items-center p-2 d-inline d-md-none"
              aria-controls="topNavbar1" aria-expanded="false" aria-label="Toggle Topbar navigation">
            <LgIcon>more_vert</LgIcon>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="topNavbar1">
            {props.children}
            <TopBarLinks className="d-none d-md-inline">
              <AccountDropdown />
            </TopBarLinks>
          </div>
        </nav>
      </Col>
    </header>
  );
}


function AccountDropdown(props) {
  return (
    <SessionContext.Consumer>
      {sessionCtx => (
        <li className="nav-item dropdown md-tpbar-acct">
          <a href="#" id="accountTopBarDropDown01" role="button" data-toggle="dropdown"
            className="nav-link dropdown-toggle d-flex align-items-center"
              aria-haspopup="true" aria-expanded="false">
            <ProfilePhoto
              className="md-pfl-xs md-pfl-round"
              session={sessionCtx.session}
              user={sessionCtx.session}
            />
          </a>
          <div className="dropdown-menu dropdown-menu-right ml-1 px-1" aria-labelledby="accountTopBarDropDown01">
            <TopbarDropdownMenuLink path="/settings" exact={false} icon="settings" title="Settings" />
            <TopbarDropdownMenuLink icon="logout" title="Sign Out" handleClick={sessionCtx.signOut} />
          </div>
        </li>
      )}
    </SessionContext.Consumer>
  );
}
