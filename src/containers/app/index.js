import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Link, Route, Redirect } from 'react-router-dom';
import { SessionContext } from '../../context/context';

import WelcomeApp from '../welcome';
import HomeApp from '../home';


// Main Entry point function
class App extends React.Component {
	constructor(props) {
		super(props);

		this.setSession = this.setSession.bind(this);
		this.signIn = this.signIn.bind(this);
		this.signOut = this.signOut.bind(this);

		const {authToken="", username="", firstName="", lastName="", isPhysician=false, profilePhotoId=null} = sessionStorage;
		this.state = {
			session: {
				authToken: authToken,
				username: username,
				firstName: firstName,
				lastName: lastName,
				isPhysician: (isPhysician === "true" || isPhysician === true) ? true: false,
				profilePhotoId: profilePhotoId
			},
			setSession: this.setSession,
			signIn: this.signIn,
			signOut: this.signOut
		}
	}

	async setSession(sessionInfo) {
		const prevSession = this.state.session;
		this.setState({
			session: Object.assign(prevSession, sessionInfo)
		});

		for (const attr in sessionInfo) {
			sessionStorage.setItem(`${attr}`, sessionInfo[attr]);
		}
	}

	async signIn(username, password) {
		try {
			const response = await fetch(`/api/auth/signin`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      await this.setSession({
        authToken: data.authToken,
				username: data.username,
				firstName: data.firstName,
        lastName: data.lastName,
				isPhysician: data.isPhysician,
        profilePhotoId: data.profilePhotoId
      });
		} catch (err) {
			console.error(`Failed to sign in. ${err}`);
			throw(err);
		}
	}

	async signOut(e) {
		event.preventDefault();
		try {
			const response = await fetch(`/api/auth/signout`, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.state.session.authToken}`
        }
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      await this.setSession({
        authToken: "",
				username: "",
				firstName: "",
        lastName: "",
				isPhysician: false,
        profilePhotoId: null
      });
		} catch (err) {
			console.error(`Failed to sign out. ${err}`);
			throw(err);
		}
	}

	render() {
		const isAuthenticated = (this.state.session.authToken && this.state.session.authToken.length !== 0) ? true: false;

		return (
			<SessionContext.Provider value={this.state}>
				<Switch>
					<Route exact path="/auth" render={(props) => {
						if (isAuthenticated) {
							return (
								<Redirect to="/" />
							)
						} else {
							return (
								<WelcomeApp {...props}
									isAuthenticated={isAuthenticated}
								/>
							)
						}
					}}
					/>
					<Route path="/" render={(props) => {
						if (!isAuthenticated) {
							return (
								<Redirect to="/auth" />
							)
						} else {
							return (
								<HomeApp {...props}
									session={this.state.session}
									setProfilePhoto={this.setProfilePhoto}
									isAuthenticated={isAuthenticated}
								/>
							)
						}
					}}
					/>
				</Switch>
			</SessionContext.Provider>
		)
	}
}

// Rendering the entire react application
ReactDOM.render(
	<Router>
		<App />
	</Router>,
	document.getElementById('root')
);
