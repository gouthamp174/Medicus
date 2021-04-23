import React from 'react';
import { FluidContainer, Row, Col } from "../../../components/layout.js";
import { getDateTillMonth } from '../../../components/dates.js';
import { Form, FormRow, FormGroup, FormSubmit, FormLabel } from "../../../components/form.js";
import { Widget, TitleBar, TitleButton, WidgetBody, WidgetList, WidgetListItem,
  WidgetDropdown, WidgetDropdownItem } from '../../../components/widget.js';


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

class NoteItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async handleDelete(e) {
    event.preventDefault();
    try {
      await this.props.handleDelete(this.props.note.id);
    } catch (err) {
      console.error(`Failed to delete note- ${this.props.note.id}. ${err}`);
    }
  }

  render() {
    const date = new Date(this.props.note.date);
    return (
      <WidgetListItem>
        <FluidContainer>
          <Row>
            <Col className="align-self-center">
              <Row>
                <Col className="text-truncate">{this.props.note.title}</Col>
                <Col className="col-auto">{`${getDateTillMonth(date)}`}</Col>
              </Row>
            </Col>
            <Col className="col-auto px-2">
              <WidgetDropdown>
                <WidgetDropdownItem name="Delete" handleClick={this.handleDelete} />
              </WidgetDropdown>
            </Col>
          </Row>
          <Row>
            <Col className="text-truncate">{this.props.note.content}</Col>
          </Row>
        </FluidContainer>
      </WidgetListItem>
    );
  }
}


export default class NotesWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      errorMessage: "",
      title: "",
      content: "",
      notes: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clickedEdit = this.clickedEdit.bind(this);
    this.clickedCancel = this.clickedCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await fetch(`/api/appointments/${this.props.id}/notes`, {
        headers: {
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      this.setState({
        notes: data
      });
    } catch (err) {
      console.error(`Failed to load notes. ${err}`);
    }
  }

  async handleChange(e) {
    event.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  async clickedEdit(e) {
    event.preventDefault();
    this.setState({
      editMode: true
    });
  }

  async clickedCancel(e) {
    event.preventDefault();
    this.setState({
      editMode: false,
      title: "",
      content: ""
    });
  }

  async handleDelete(noteId) {
    try {
      const response = await fetch(`/api/appointments/${this.props.id}/notes/${noteId}`, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      const newNotes = this.state.notes.filter(note => {
        return note.id !== noteId;
      });

      this.setState({
        notes: newNotes
      });
    } catch (err) {
      console.error(`Failed to delete note ${noteId}. ${err}`);
    }
  }

  async handleSubmit(e) {
    event.preventDefault();
    try {
      const newNote = {
        title: this.state.title,
        content: this.state.content,
        date: new Date()
      };

      const response = await fetch(`/api/appointments/${this.props.id}/notes`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.session.authToken}`
        },
        body: JSON.stringify(newNote)
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      newNote.id = data.id;
      const newNotes = this.state.notes;
      newNotes.push(newNote);

      this.setState({
        editMode: false,
        title: "",
        content: "",
        notes: newNotes
      });
    } catch (err) {
      console.error(`Failed to update notes. ${err}`);
      this.setState({
        errorMessage: `${err}`
      });
    }
  }

  render() {
    const noteItems = []
    if (this.state.notes && this.state.notes.length) {
      for (const [idx, note] of this.state.notes.entries()) {
        let noteItem = (
          <NoteItem
            key={idx}
            session={this.props.session}
            note={note}
            handleDelete={this.handleDelete}
          />
        );

        noteItems.push(noteItem);
      }
    } else {
      let noteItem = (
        <DefaultNoteItem key="default" />
      );
      noteItems.push(noteItem);
    }

    return (
      <Widget>
        <TitleBar title="Notes">
          {(this.state.editMode) ?
            <TitleButton name="Cancel" icon="clear" handleClick={this.clickedCancel} /> :
            <TitleButton name="Edit" icon="edit" handleClick={this.clickedEdit} />
          }
        </TitleBar>
        {this.state.editMode &&
          <WidgetBody>
            <Form className="container-fluid" handleSubmit={this.handleSubmit}>
              {(this.state.errorMessage) &&
                <FormRow className="justify-content-center">
                  <div className="alert alert-danger" role="alert">{this.state.errorMessage}</div>
                </FormRow>
              }
              <FormRow className="my-2">
                <FormLabel for="noteWidget1" className="col-sm-4">Title</FormLabel>
                <FormGroup className="col-sm-8">
                  <input id="noteWidget1" type="text" name="title" className="form-control"
                    value={this.state.title} onChange={this.handleChange}
                      placeholder="Add new title">
                  </input>
                </FormGroup>
              </FormRow>
              <FormRow className="my-2">
                <FormLabel for="noteWidget2" className="col-sm-4">Content</FormLabel>
                <FormGroup className="col-sm-8">
                  <textarea id="noteWidget2" type="text" name="content" className="form-control"
                    rows="3" value={this.state.content} onChange={this.handleChange}
                      placeholder="Add new content">
                  </textarea>
                </FormGroup>
              </FormRow>
              <FormRow className="my-2 justify-content-center">
                <FormSubmit className="col-auto col-md-4">Add</FormSubmit>
              </FormRow>
            </Form>
          </WidgetBody>
        }
        <WidgetList>
          {noteItems}
        </WidgetList>
      </Widget>
    );
  }
}
