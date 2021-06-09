import React, { useState } from 'react';
import { Form, FormButton, FormGroup, FormRow } from '../../../../components/form';
import { LgIcon } from '../../../../components/icons';
import { Col, Footer } from '../../../../components/layout';
import { Username } from '../../../../components/users';


function SendMessageForm(props) {
    const [fields, setFields] = useState({
        content: ""
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
            const timestamp = new Date();
      
            await props.channel.emit('chat', {
                chatId: props.chat.id,
                sender: Username({ user: props.session }),
                timestamp: timestamp,
                content: fields.content
            });

            setFields({
                ...fields,
                content: ""
            });
        } catch (err) {
            console.error(`Failed to send chat message. ${err}`);
        }
    }

    return (
        <Form autoComplete="off" handleSubmit={handleSubmit}>
            <FormRow>
                <FormGroup className="col my-2">
                    <input type="text" name="content" aria-label="Input chat message"
                        className="form-control" value={fields.content} onChange={handleChange}
                        placeholder="" disabled={props.isDisabled}>
                    </input>
                </FormGroup>
                <FormGroup className="col-auto my-2">
                    <FormButton type="submit" className="md-btn p-2 d-flex align-items-center"
                        disabled={props.isDisabled}>
                        <LgIcon>send</LgIcon>
                    </FormButton>
                </FormGroup>
            </FormRow>
        </Form>
    );
}


export default function SendMessageBar(props) {
    return (
        <Footer className="md-sbar p-2 justify-content-center">
            <Col>
                <SendMessageForm
                    session={props.session}
                    chat={props.chat}
                    channel={props.channel}
                />
            </Col>
        </Footer>
    );
}