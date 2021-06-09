import React from 'react';
import { Dropdown, DropdownButton, DropdownMenu, DropdownMenuButton, 
    DropdownMenuDivider } from '../../../components/dropdown';
import { LgIcon } from '../../../components/icons';


function ButtonGroup(props) {
    if (!props.buttons || props.buttons.length === 0) {
        return null;
    }

    return (
        <>
            {props.buttons.map((buttonInfo, idx) => (
                <DropdownMenuButton
                    key={idx}
                    {...buttonInfo}
                >
                    {buttonInfo.title}
                </DropdownMenuButton>
            ))}
        </>
    );
}


function DefaultButtonGroup(props) {
    const defaultButtons = [];
    if (props.status === "Accepted" || (props.status === "Done" && props.paymentBalance !== 0)) {
        defaultButtons.push(
            { 
                title:"Delete", icon:"delete_outline", disabled: true,
                handleClick: props.handleDelete
            }
        );
    } else {
        defaultButtons.push(
            { 
                title:"Delete", icon:"delete_outline", disabled: false, 
                handleClick: props.handleDelete
            }
        );
    }

    return (
        <ButtonGroup buttons={defaultButtons} />
    );
}


function StatusButtonGroup(props) {
    const statusButtons = [];
    if (props.status === "Pending" && props.isCurrentUserPhysician) {
        statusButtons.push(
            {
                title:"Accept", icon:"check", value:"Accepted", 
                disabled: false, handleClick: props.handleStatus
            },
            {
                title: "Reject", icon: "clear", value: "Rejected",
                disabled: false, handleClick: props.handleStatus
            }
        );
    } else if (props.status === "Accepted") {
        statusButtons.push(
            {
                title:"End", icon:"stop", value:"Done",
                disabled: false, handleClick: props.handleStatus
            }
        );
    }

    return (
        <ButtonGroup buttons={statusButtons} />
    );
}


export default function ManageBar(props) {
    let isCurrentUserPhysician = false;
    if (props.session && props.appointment) {
        const currentUsername = props.session.username;
        const physicianUsername = props.appointment.physician.username;
        isCurrentUserPhysician = (currentUsername === physicianUsername) ? true: false;
    }

    return (
        <Dropdown className="md-mgbar">
            <DropdownButton id="manageApptBar01" className="md-toggle p-2 d-flex align-items-center">
                <LgIcon>more_horiz</LgIcon>
            </DropdownButton>
            <DropdownMenu labelledBy="manageApptBar01" className="dropdown-menu-right">
                <StatusButtonGroup
                    status={props.appointment.status}
                    isCurrentUserPhysician={isCurrentUserPhysician}
                    handleStatus={props.handleStatus}
                />
                <DropdownMenuDivider />
                <DefaultButtonGroup
                    status={props.appointment.status}
                    paymentBalance={props.appointment.paymentBalance}
                    handleDelete={props.handleDelete}
                />
            </DropdownMenu>
        </Dropdown>
    );
}