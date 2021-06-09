import React from 'react';
import { MonthDate } from '../../../../../../components/dates';
import { Col, FluidContainer, Row } from '../../../../../../components/layout';
import { Username } from '../../../../../../components/users';
import { WidgetList, WidgetListItem, WidgetDropdown, 
    WidgetDropdownItem } from '../../../../../../components/widgets';


function DefaultNoteItem(props) {
    return (
        <WidgetListItem>
            <FluidContainer>
                <Row>
                    <Col className="md-font-sm text-center text-muted">No note available</Col>
                </Row>
            </FluidContainer>
        </WidgetListItem>
    );
}


function NoteItem(props) {
    async function handleDelete(e) {
        e.preventDefault();
        if (props.handleDelete) {
            props.handleDelete(props.note.id);
        }
    }

    const fromUsername = props.note.fromUsername;
    const currentUsername = Username({ user: props.session });
    const fromCurrentUser = (currentUsername === fromUsername) ? true: false;

    const date = new Date(props.note.date);
    return (
        <WidgetListItem>
            <FluidContainer>
                <Row>
                    <Col className="align-self-center">
                        <Row>
                            <Col className="text-truncate">{props.note.title}</Col>
                            <Col className="col-auto">
                                <MonthDate date={date} />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-truncate">{props.note.content}</Col>
                        </Row>
                    </Col>
                    <Col className="col-auto px-2">
                        {fromCurrentUser &&
                            <WidgetDropdown>
                                <WidgetDropdownItem handleClick={handleDelete}>Delete</WidgetDropdownItem>
                            </WidgetDropdown>
                        }
                    </Col>
                </Row>
            </FluidContainer>
        </WidgetListItem>
    );
}


export default function ListSection(props) {
    return (
        <WidgetList>
            {(props.notes.length !== 0) ?
                <>
                    {props.notes.map((note, index) => (
                        <NoteItem 
                            key={index}
                            session={props.session}
                            note={note}
                            handleDelete={props.deleteNote}
                        />
                    ))}
                </> :
                <DefaultNoteItem />
            }
        </WidgetList>
    );
}