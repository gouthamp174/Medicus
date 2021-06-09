import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DropdownButton } from '../../components/buttons';
import { DropdownButtonToggle } from '../../components/dropdown';
import { Form } from '../../components/form';
import { useExtendClass } from '../../components/hooks';
import { LgIcon } from '../../components/icons';
import { Nav, NavBar, NavBrand, NavCollapsible, NavDropdown, NavDropdownLink, NavDropdownMenu, 
    NavDropdownMenuHeader, NavDropdownMenuItem, NavLink, NavLinks, NavToggler } from '../../components/navs';
import { ProfilePhoto } from '../../components/users';


function Toggler(props) {
    const { className, icon, ...otherProps } = props;
    return (
        <NavToggler
            className={useExtendClass("md-btn p-2 mx-1", className)}
            {...otherProps}
        >
            <LgIcon className="d-flex align-items-center">{icon}</LgIcon>
        </NavToggler>
    );
}


function DropdownMenuItem(props) {
    const { title, icon, ...otherProps } = props;
    return (
        <NavDropdownMenuItem
            className="md-mi d-flex align-items-center"
            {...otherProps}
        >
            <LgIcon>{icon}</LgIcon>
            <p className="my-0 pl-2 text-truncate">{title}</p>
        </NavDropdownMenuItem>
    );
}


export function TitleBarLink(props) {
    const { className, title, icon, ...otherProps } = props;
    return (
        <NavLink
            { ...otherProps }
            className={useExtendClass("md-btn mx-1 p-2 d-flex align-items-center", className)}
            tooltip={title}
            role="button"
        >
            <LgIcon>{icon}</LgIcon>
            <p className="my-0 pl-2 text-truncate d-md-none">{title}</p>
        </NavLink>
    );
}


export function TitleBarLinks(props) {
    return (
        <NavLinks>
            {props.children}
        </NavLinks>
    );
}


export function TitleBarSearch(props) {
    const [fields, setFields] = useState({
        query: ""
    });

    async function handleChange(e) {
        setFields({
            ...fields,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (props.handleSearch) {
                props.handleSearch(fields.query);
            }
        } catch (err) {
            console.error(`Failed to handle search query. ${err}`);
        }
    }

    return (
        <Form handleSubmit={handleSubmit}
            className={useExtendClass("form-inline mx-1 my-2 my-lg-0", props.className)} >
            <div className="input-group w-100">
                <input id="titlebarSearch01" type="text" className="form-control" name="query"
                    placeholder={props.placeholder} value={fields.query} onChange={handleChange}
                        aria-label="Search Query" aria-describedby="titlebarSearch02" />
                <div className="input-group-append">
                    <button id="titlebarSearch02" type="button" 
                        className="btn btn-sm btn-outline-secondary" >
                        <LgIcon>search</LgIcon>
                    </button>
                </div>
            </div>
        </Form>
    );
}


export default function TitleBar(props) {
    const session = useSelector(s => s.session);

    return (
        <NavBar className="navbar-expand-md navbar-light row md-tbar sticky-top justify-content-start">
            <Toggler
                target="sideBar01"
                icon="menu"
                toggleType="modal"
            />
            <NavBrand className="mr-auto p-1 font-weight-bold">{props.title}</NavBrand>
            {props.children && 
                <>
                    <Toggler
                        target="titleBarNav01"
                        icon="more_vert"
                    />
                    <NavCollapsible 
                        id="titleBarNav01"
                        className="justify-content-end order-last order-md-4"
                    >
                        {props.children}
                    </NavCollapsible>
                </>
            }
            <Nav className="order-md-last" asList={true}>
                <NotificationDropDown />
                <UserDropdown
                    session={session}
                    user={session}
                />
            </Nav>
        </NavBar>
    );
}


// Session based components.
function UserDropdown(props) {
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

    const menuLinks = [
        {
            path: `/users/${props.user.username}`,
            title: "Profile",
            icon: "person"
        },
        {
            path: "/settings",
            title: "Settings",
            icon: "settings"
        },
        {
            title: "Sign Out",
            icon: "logout",
            handleClick: signOut
        }
    ];

    return (
        <NavDropdown>
            <NavDropdownLink className="px-0 mx-1 d-flex align-items-center">
                <ProfilePhoto 
                    className="md-pfl-xs md-pfl-round"
                    session={props.session} 
                    user={props.user}
                />
            </NavDropdownLink>
            <NavDropdownMenu className="dropdown-menu-right">
                {menuLinks.map((menuLink, index) => (
                    <DropdownMenuItem
                        key={index}
                        path={menuLink.path}
                        exact={menuLink.exact}
                        title={menuLink.title}
                        icon={menuLink.icon}
                        handleClick={menuLink.handleClick}
                    />
                ))}
            </NavDropdownMenu>
        </NavDropdown>
    );
}


function NotificationDropDown(props) {
    return (
        <NavDropdown className="mx-1 my-2">
            <DropdownButtonToggle className="md-btn p-2 d-flex align-items-center">
                <LgIcon>notifications</LgIcon>
            </DropdownButtonToggle>
            <NavDropdownMenu className="dropdown-menu-right">
                <NavDropdownMenuHeader>
                    Coming Soon!
                </NavDropdownMenuHeader>
            </NavDropdownMenu>
        </NavDropdown>
    );
}