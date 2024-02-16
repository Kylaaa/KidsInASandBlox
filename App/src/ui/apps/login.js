import React, { useState } from 'react';
import ReactDOM from 'react-dom';

let ScopeGroup = require('../components/scopeGroup.js');

function LoginApp(props) {
	let submissionUrl = props.submissionUrl;
	let eventData = props.eventData;

	console.log(submissionUrl, eventData);

	// transform the event data
	let permissions = {};
	// example) "channel.follow" : {"name":"channel.follow","description":"","version":1,"scope":"","condition":["broadcaster_user_id"]}
	eventsData.forEach((event) => {
		if (!permissions[event.scope]) {
			permissions[event.scope] = [];
		}

		permissions[event.scope].push(event);
	})

	let scopes = [];
	for (let [permission, events] of Object.entries(permissions)) {
		scopes.insert(<ScopeGroup
			permission = 
		></ScopeGroup>);
	})

	return (
		<React.Fragment>
			<h1> What events would you like to observe? </h1>
			<p> In order to subscribe to events, certain permissions are required. Each event can be found inside the permission required for it. </p>
			<form action={submissionUrl}>
				<div class="scope-group">
					<h3>these are a scope group</h3>
					<input type="checkbox" name="test" checked/>
					<label for="test">this is a </label>
				</div>
				<input type="submit" value="Submit" />
			</form>
		</React.Fragment>
	);
}

//let [eventData, updateEventData] = useState([]);

// pull down configuration
var req = new XMLHttpRequest();
req.open("GET", `http://localhost:3000/auth/login/config`, true);
req.onreadystatechange = ()=>{
	if (req.readyState === XMLHttpRequest.DONE) {
		console.log(req.responseText);
		let response = JSON.parse(req.responseText);
		//updateEventData(response.eventData);
	}
};
req.send();


const domNode = document.getElementById('root');
const root = ReactDOM.createRoot(domNode);
root.render(<LoginApp
	submissionUrl="http://localhost:3000/auth/login"
	eventData={[]} //{eventData}
/>);