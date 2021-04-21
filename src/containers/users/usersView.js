import React from 'react';
import { Link } from "react-router-dom";
import { Row, Col } from "../../components/layout.js";
import { List } from "../../components/list.js";
import { TopBar, SearchForm as TopBarSearch } from '../home/topbar.js';
import User from "./user.js";


function UserList(props) {
  const userItems = []
  for (const [idx, user] of props.users.entries()) {
    const userItem = (
      <User
        key={idx}
        session={props.session}
        username={user.username}
        listView={true}
      />
    );
    userItems.push(userItem);
  }

  return (
    <Col className="py-3">
      <List className="md-list">
        {userItems}
      </List>
    </Col>
  );
}


function DefaultSection(props) {
  return (
    <Col className="py-3 align-self-center">
      <h4 className="text-center text-muted">
        Find using the search bar available at the top.
      </h4>
    </Col>
  );
}


export default class UsersView extends React.Component {
  constructor(props) {
    super(props);
    this.usersRef = React.createRef();

    this.state = {
      search: "",
      limit: 10,
      page: 0,
      users: []
    }

    this.getUsers = this.getUsers.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.appendUsers = this.appendUsers.bind(this);
  }

  async componentDidMount() {
    try {
      this.usersRef.current.addEventListener("scroll", () => {
        if (this.usersRef.current.scrollTop +
            this.usersRef.current.clientHeight >=
              this.usersRef.current.scrollHeight) {
          this.timeoutId = setTimeout(() => {
            this.appendUsers()
          }, 2000);
        }
      });
    } catch (err) {
      console.error(`Failed to load search page: ${err.message}`);
    }
  }

  async getUsers({search, page, limit}) {
    try {
      const view = (this.props.view) ? `view=${this.props.view}&` : '';

      const response = await fetch(`/api/users?${view}search=${search}&page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let users = await response.json();
      if (!response.ok) {
        throw new Error(users.message);
      }

      return users
    } catch (err) {
      console.error(err);
      return []
    }
  }

  async handleSearch(search) {
    try {
      const users = await this.getUsers({search: search, page: 0, limit: this.state.limit});

      this.setState({
        search: search,
        page: Math.ceil(users.length / this.state.limit),
        users: users
      });
    } catch (err) {
      console.error(`Failed to retrieve user results based on search query.`);
    }
  }

  async appendUsers(query) {
    try {
      const users = await this.getUsers({search: this.state.search, page: this.state.page,
        limit: this.state.limit});

      const newUsers = this.state.users;
      const newCount = newUsers.push.apply(newUsers, users);

      this.setState({
        page: Math.ceil(newCount / this.state.limit),
        users: newUsers
      });

    } catch (err) {
      console.error(`Failed to add users on scroll.`);
    }
  }

  render() {
    return (
      <div ref={this.usersRef} className="container-fluid h-100 overflow-y d-flex flex-column">
        <TopBar title={this.props.title}>
          <TopBarSearch handleSearch={this.handleSearch} />
        </TopBar>
        <Row className="flex-grow-1">
          {(this.state.users && this.state.users.length !== 0) ?
            <>
              <UserList session={this.props.session} users={this.state.users} />
            </> :
            <>
              <DefaultSection />
            </>
          }
        </Row>
      </div>
    );
  }
}


export function PhysiciansView(props) {
  return (
    <UsersView
      session={props.session}
      title="Find your Physician"
      view=""
    />
  );
}


export function PatientsView(props) {
  return (
    <UsersView
      session={props.session}
      title="Find your Patient"
      view="patient"
    />
  );
}
