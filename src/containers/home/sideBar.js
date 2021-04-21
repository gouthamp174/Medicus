import React from 'react';
import { Switch, Link } from "react-router-dom";
import { Row, Col, RowDivider } from "../../components/layout.js";
import { NavList, NavListItem } from "../../components/list.js";
import { AppLogo } from "../../components/utils.js";
import { SideBarLink, SignOutLink } from "./links.js";


export default class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.sidebarRef = React.createRef();

    this.links = []
    this.links.push({path: "/", exact: true, title: "Dashboard", icon: "dashboard"});
    this.links.push({path: `/users/${this.props.session.username}`, title: "Profile", icon: "account_circle"});

    if (!this.props.session.isPhysician) {
      this.links.push({path: "/users", title: "Find your Physician", icon: "search"});
      this.links.push({path: "/appointments?view=new", title: "New Appointment", icon: "post_add"});
    } else {
      this.links.push({path: "/users", title: "Find your Patient", icon: "search"});
    }

    this.links.push({path: "/appointments?view=waiting", title: "Waiting Room", icon: "alarm"});
    this.links.push({path: "/appointments", title: "Appointments", icon: "date_range"});
    this.links.push({path: "/appointments?view=payments", title: "Payments", icon: "payments"});


    this.handleClick = this.handleClick.bind(this);
  }

  async handleClick() {
    // For smaller screen sizes, when sidebar extends to entire screeen, close sidebar
    this.sidebarRef.current.classList.remove('show');

    // Continue with default link behavior.
  }

  render() {
    return (
      <div ref={this.sidebarRef} id="sidebar1" className="col col-md-3 col-xl-2 h-100 md-sdbar md-bg-1 collapse no-collapse-md">
        <header className="row navbar navbar-dark my-1">
          <Link to="/" className="navbar-brand">
            <AppLogo />
          </Link>
          <button className="btn btn-sm d-md-none" type="button" data-toggle="collapse" data-target="#sidebar1" aria-controls="sidebar1" aria-expanded="false" aria-label="Toggle Side bar navigation">
            <i className="material-icons md-24">clear</i>
          </button>
        </header>
        <Row className="flex-grow-1">
          <Col>
            <Switch>
              <NavList className="flex-column">
                {this.links.map((link, index) => (
                  <SideBarLink
                    key={index}
                    path={link.path}
                    exact={link.exact}
                    icon={link.icon}
                    title={link.title}
                    handleClick={this.handleClick}
                  />
                ))}
              </NavList>
            </Switch>
          </Col>
        </Row>
        <RowDivider />
        <Row>
          <Col>
            <NavList className="flex-column my-1">
              <SideBarLink path="/settings" exact={false} icon="settings" title="Settings" />
              <SideBarLink icon="logout" title="Sign Out" handleClick={this.props.signOut} />
            </NavList>
          </Col>
        </Row>
      </div>
    );
  }
}
