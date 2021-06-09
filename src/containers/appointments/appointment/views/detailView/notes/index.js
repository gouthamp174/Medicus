import React, { useState } from 'react';
import { useCompareUsers } from '../../../../../../components/hooks';
import { AutoLoader} from '../../../../../../components/loaders';
import { TitleBar, TitleToggler, Widget, 
    WidgetCollapsible } from '../../../../../../components/widgets';

import AddSection from './addSection';
import ListSection from './listSection';


export default function NoteSection(props) {
    const [state, setState] = useState({
        notes: [],
        limit: 10
    });

    async function appendNotes() {
        try {
            const url = `/api/appointments/${props.appointment.id}/notes`;

            const searchParams = new URLSearchParams();
            searchParams.append('page', Math.ceil(state.notes.length / state.limit));
            searchParams.append('limit', state.limit);
            
            const response = await fetch(`${url}?${searchParams.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${props.session.authToken}`
                }
            });

            let newNotes = await response.json();
            if (!response.ok) {
                throw new Error(newNotes.message);
            }

            setState(prevState => {
                const updatedNotes = [...prevState.notes, ...newNotes];

                return {
                    ...prevState,
                    notes: updatedNotes
                }
            })
        } catch (err) {
            console.error(`Failed to append more notes. ${err}`);
        }
    }

    async function appendNote(newNote) {
        setState(prevState => {
            const newNotes = [newNote, ...prevState.notes];

            return {
                ...prevState,
                notes: newNotes
            }
        });
    }

    async function deleteNote(id) {
        try {
            const response = await fetch(`/api/appointments/${props.appointment.id}/notes/${id}`, {
                method: 'DELETE',
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

            setState(prevState => {
                const newNotes = state.notes.filter(note => {
                    return note.id !== id;
                });

                return {
                    ...prevState,
                    notes: newNotes
                }
            });
        } catch (err) {
            console.error(`Failed to delete note- ${id}. ${err}`);
        }
    }


    // Now render view
    const isCurrentUserPhysician = useCompareUsers(props.session, props.appointment.physician);

    return (
        <>
            <Widget>
                <TitleBar title="Notes">
                    {isCurrentUserPhysician &&
                        <TitleToggler 
                            target="apptNoteAdd01"
                            expandIcon="add"
                            collapseIcon="clear"
                        />
                    }
                </TitleBar>
                <WidgetCollapsible id="apptNoteAdd01">
                    <AddSection 
                        session={props.session}
                        appointment={props.appointment}
                        appendNote={appendNote}
                    />
                </WidgetCollapsible>
                <ListSection 
                    session={props.session}
                    notes={state.notes}
                    deleteNote={deleteNote}
                />
            </Widget>
            <AutoLoader callback={appendNotes} />
        </>
    );
}