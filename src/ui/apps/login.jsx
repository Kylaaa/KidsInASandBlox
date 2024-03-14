import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import "./login.css";
import ScopeGroup from '../components/scopeGroup.js';

class LoginApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasLoaded : false,
			isAuthenticated: false,
			eventData : {}
		}

		this.fetchConfiguration = (setState, configUrl)=>{
			return fetch(configUrl).then((response) => {
				return response.json();
			}).then((data) => {
				setState({
					hasLoaded : true,
					eventData : data.eventData,
					isAuthenticated : data.isAuthenticated
				});
			});
		};

		this.renderWaitingForResponse = ()=>{
			return (
				<React.Fragment>
					<h1> Hold, gotta check something real quick...</h1>
				</React.Fragment>
			);
		};

		this.renderAuthenticatedPage = ()=>{
			return (
				<React.Fragment>
					<h1>You're all set!</h1>
					<p>Feel free to close this page.</p>
				</React.Fragment>
			)
		};

		this.renderLoginForm = (submissionUrl, eventData)=>{
			let scopes = Object.keys(eventData).map((permission, index) => (
				<ScopeGroup
					permission = { permission === "" ? "No Permissions Required" : permission }
					events = { eventData[permission] }
				/>
			));

			// TODO : read up on Forms special cases : https://legacy.reactjs.org/docs/forms.html
			return (
				<React.Fragment>
					<h1> What events would you like to observe? </h1>
					<p> In order to subscribe to events, certain permissions are required. Each event can be found inside the permission required for it. </p>
					<form action={submissionUrl} method="POST">
						{scopes}
						<input class="loginapp-submit" type="submit" value="Log In With Twitch..." />
					</form>
				</React.Fragment>
			);
		};
	}

	componentDidMount() {
		let configUrl = this.props.configUrl;
		let setState = this.setState.bind(this);
		this.fetchConfiguration(setState, configUrl);
	}

	render() {
		let submissionUrl = this.props.submissionUrl;
		let hasLoaded = this.state.hasLoaded;
		let isAuthenticated = this.state.isAuthenticated;
		let eventData = this.state.eventData;

		if (!hasLoaded) {
			return this.renderWaitingForResponse();
		}

		if (!isAuthenticated) {
			return this.renderLoginForm(submissionUrl, eventData);
		}

		return this.renderAuthenticatedPage();
	}
}

let domNode = document.getElementById('root');
let root = ReactDOM.createRoot(domNode);
root.render(<LoginApp
	submissionUrl="http://localhost:3000/auth/login"
	configUrl="http://localhost:3000/auth/login/config"
/>);