import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavItem } from '../../../components/navs';
import { TitleBar, TitleButton, TitleButtons, Widget, WidgetBody } from '../../../components/widgets';


export default function DeleteUserWidget(props) {
    const session = useSelector(s => s.session);
    const dispatch = useDispatch();

    const [validateMode, setValidateMode] = useState(false);

    async function toggleValidateMode(e) {
        e.preventDefault();
        setValidateMode(!validateMode);
    }

    async function clickedAccept(e) {
        e.preventDefault();
        try {
            const deleteResponse = await fetch(`/api/users/${session.username}`, {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.authToken}`
                }
            });

            let data = await deleteResponse.json();
            if (!deleteResponse.ok) {
                throw new Error(data.message);
            }

            const signOutResponse = await fetch(`/api/auth/signout`, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.authToken}`
                }
            });

            data = await signOutResponse.json();
            if (!signOutResponse.ok) {
                throw new Error(data.message);
            }

            dispatch({
                type: "session/reset"
            });
        } catch (err) {
            console.error(`Failed to delete user. ${err}`);
        }
    }

    return (
        <Widget>
            <TitleBar title="Delete Account">
                {
                    (validateMode) ?
                    <>
                        <TitleButtons>
                            <NavItem>
                                <TitleButton name="Accept" icon="check" handleClick={clickedAccept} />
                            </NavItem>
                            <NavItem>
                                <TitleButton name="Cancel" icon="clear" handleClick={toggleValidateMode} />
                            </NavItem>
                        </TitleButtons>
                    </> :
                    <>
                        <TitleButton name="Delete" icon="delete" handleClick={toggleValidateMode} />
                    </>
                }
            </TitleBar>
            {validateMode &&
                <WidgetBody>
                    <div class="alert alert-danger" role="alert">
                        Once your account is deleted, all your information is removed from our website and it cannot be retrieved back. 
                        Please reconsider once before proceeding. We're sad to see you leave.
                    </div>
                </WidgetBody>
            }
        </Widget>
    );
}