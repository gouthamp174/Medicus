import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useExtendClass } from '../../components/hooks';
import { LgIcon, XlIcon } from '../../components/icons';
import { Col, Row, RowDivider } from '../../components/layout';
import { Nav, NavBar, NavBrand } from '../../components/navs';


function AppLogo(props) {
    return (
        "Medicus"
    );
}


function SectionDivider(props) {
    return (
        <RowDivider className="px-1" />
    );
}


function LinkSection(props) {
    return (
        <Row>
            <Col className="my-2 px-0">
                {props.children}
            </Col>
        </Row>
    );
}


function Links(props) {
    return (
        <Nav className="md-links flex-column">
            {props.children}
        </Nav>
    );
}


function Link(props) {
    return (
        <NavLink
            to={props.path}
            exact={props.exact}
            className="nav-link md-link px-2 my-1 d-flex align-items-center"
            onClick={props.handleClick}
        >
            <XlIcon className="px-1">{props.icon}</XlIcon>
            <p className="my-0 pl-2 text-truncate">{props.title}</p>
        </NavLink>
    );
}


function TopLinks(props) {
    const links = [];
    links.push({ path: "/", exact: true, title: "Dashboard", icon: "dashboard" });
    links.push({ path: "/appointments?view=waiting", title: "Waiting Room", icon: "queue" });
    links.push({ path: "/appointments", title: "Appointments", icon: "date_range" });

    if (props.session.isPhysician) {
        links.push({ path: "/users", title: "Search Patient", icon: "person_search" });
    } else {
        links.push({ path: "/appointments?view=new", title: "New Appointment", icon: "post_add" });
        links.push({ path: "/users", title: "Search Physician", icon: "person_search" });
    }

    return (
        <Links>
            {links.map((link, index) => (
                <Link
                    key={index}
                    path={link.path}
                    exact={link.exact}
                    icon={link.icon}
                    title={link.title}
                    handleClick={props.handleClick}
                />
            ))}
        </Links>
    );
}


function ExtraLinks(props) {
    const links = [];
    links.push({ path: "/settings", title: "Settings", icon: "settings" });
    links.push({ path: "/help", title: "Help Center", icon: "help_outline" });
    links.push({ path: "/contact", title: "Contact Us", icon: "contact_support" });

    return (
        <Links>
            {links.map((link, index) => (
                <Link
                    key={index}
                    path={link.path}
                    exact={link.exact}
                    icon={link.icon}
                    title={link.title}
                    handleClick={props.handleClick}
                />
            ))}
        </Links>
    );
}


function DefaultLinks(props) {
    const dispatch = useDispatch();

    async function signOut(e) {
        e.preventDefault();
        try {
            const response = await fetch(`/api/auth/signout`, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${props.session.authToken}`
                }
            });
        
            let data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            dispatch({
                type: "session/reset"
            });
        } catch (err) {
            console.error(`Failed to sign out. ${err}`);
        }
    }

    const links = [];
    links.push({ path: "/signOut", title: "Sign Out", icon: "logout", handleClick: signOut});

    return (
        <Links>
            {links.map((link, index) => (
                <Link
                    key={index}
                    path={link.path}
                    exact={link.exact}
                    icon={link.icon}
                    title={link.title}
                    handleClick={(link.handleClick) ? link.handleClick : props.handleClick}
                />
            ))}
        </Links>
    );
}


function SideBarCloseButton(props) {
    return (
        <button id={props.id} type="button" data-dismiss="modal" aria-label="Close"
            class={useExtendClass("p-2 d-flex align-items-center", props.className)}>
            <LgIcon>clear</LgIcon>
        </button>
    );
}


export default function SideBar(props) {
    const session = useSelector(s => s.session);

    async function handleClick(e) {
        if (props.handleClick) {
            props.handleClick();
        }
    }

    return (
        <div id={props.id} className={useExtendClass("md-sdbar", props.className)}>
            <Row>
                <Col className="px-0">
                    <NavBar className="navbar-expand navbar-dark justify-content-between my-1">
                        <NavBrand isLink={true} url="/" >
                            <AppLogo />
                        </NavBrand>
                        <SideBarCloseButton 
                            id="sdbarClose01"
                            className="md-btn d-md-none"
                        />
                    </NavBar>
                </Col>
            </Row>
            <LinkSection>
                <TopLinks
                    session={session}
                    handleClick={handleClick}
                />
            </LinkSection>
            <SectionDivider />
            <LinkSection>
                <ExtraLinks
                    handleClick={handleClick}
                />
            </LinkSection>
            <SectionDivider />
            <LinkSection>
                <DefaultLinks
                    session={session}
                    handleClick={handleClick}
                />
            </LinkSection>
        </div>
    );
}


export function ModalSideBar(props) {
    const modalRef = useRef(null);

    async function handleClick(e) {
        const modalCloseButton = document.getElementById("sdbarClose01");
        if (modalCloseButton) {
            modalCloseButton.click();
        }
    }

    return (
        <div ref={modalRef} id={props.id} tabindex="-1" role="dialog"
            className="md-mdl-sdbar modal fade" aria-hidden="true">
            <div className="modal-dialog h-100 my-0 ml-0 d-flex" role="document">
                <div className="modal-content flex-grow-1">
                    <div className="modal-body p-0 d-flex">
                        <SideBar 
                            className="container-fluid flex-grow-1"
                            handleClick={handleClick}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}