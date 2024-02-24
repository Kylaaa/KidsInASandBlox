import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import "./login.css";
import ScopeGroup from '../components/scopeGroup.js';

class LoginApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			eventData : {}
		}
	}

	componentDidMount() {
		// pull down configuration
		var req = new XMLHttpRequest();
		req.open("GET", this.props.configUrl, true);
		req.onreadystatechange = ()=>{
			if (req.readyState === XMLHttpRequest.DONE) {
				let response = JSON.parse(req.responseText);
				this.setState({
					eventData : response.eventData
				});
			}
		};
		req.send();
	}

	render() {
		let submissionUrl = this.props.submissionUrl;
		let eventData = this.state.eventData;

		let scopes = Object.keys(eventData).map((key, index) => (
			<ScopeGroup
				permission = { key === "" ? "No Permissions Required" : key }
				events = { eventData[key] }
			/>
		));

		// TODO : read up on Forms special cases : https://legacy.reactjs.org/docs/forms.html
		return (
			<React.Fragment>
				<h1> What events would you like to observe? </h1>
				<p> In order to subscribe to events, certain permissions are required. Each event can be found inside the permission required for it. </p>
				<form action={submissionUrl}>
					{scopes}
					<input class="loginapp-submit" type="submit" value="Log In With Twitch..." />
				</form>
			</React.Fragment>
		);
	}
}

let domNode = document.getElementById('root');
let root = ReactDOM.createRoot(domNode);
root.render(<LoginApp
	submissionUrl="http://localhost:3000/auth/login"
	configUrl="http://localhost:3000/auth/login/config"
/>);