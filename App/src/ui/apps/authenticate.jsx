import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import "./authenticate.css";

class ProcessLoginApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading : true,
			errMessage : null
		};

		this.gotoLogin = ()=>{
			let loginUrl = props.loginUrl;
			window.location.href = loginUrl;
		};

		this.parseUrlArgs = ()=>{
			let setTokenUrl = props.setTokenUrl;
			return new Promise((resolve, reject) => {
				// check if any url arguments were passed in
				// - on a successful authentication, parse the document hash for the access token
				// ex) http://localhost:3000/#access_token=73d0f8mkabpbmjp921asv2jaidwxn&scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls&state=c3ab8aa609ea11e793ae92361f002671&token_type=bearer

				// - on a rejected authentication, parse out the query params
				// ex) http://localhost:3000/?error=access_denied&error_description=The+user+denied+you+access&state=c3ab8aa609ea11e793ae92361f002671
				if (window.location.search) {
					this.gotoLogin();
					reject();
				}
				else if (window.document.location.hash !== "") {
					let hash = window.document.location.hash.substring(1);
					fetch(setTokenUrl + "?" + hash).then((response)=>{
						return response.json();
					}).then(resolve);
				}
				else {
					this.gotoLogin();
					reject();
				}
			});
		};

		this.initSession = ()=>{
			let initUrl = props.initSessionUrl;
			return fetch(initUrl).then((response)=>{
				return response.json();
			});
		};

		this.connectToTwitch = ()=>{
			let connectUrl = props.connectUrl;
			return fetch(connectUrl, {
				method: 'POST'
			}).then((response)=>{
				return response.json();
			});
		};

		this.subscribeToEvents = ()=>{
			let subscribeUrl = props.subscribeUrl;
			return fetch(subscribeUrl, {
				method: 'POST'
			}).then((response)=>{
				return response.json();
			});
		};

		this.fetchNextRequest = ()=>{
			if (this.currentRequest >= this.requests.length) {
				this.gotoLogin();
				return;
			}

			return new Promise((resolve, reject)=>{
				this.setState({
					isLoading : true
				});

				this.requests[this.currentRequest]().then((response)=>{
					if (response.success) {
						this.currentRequest++;
						resolve();
					}
					else {
						this.setState({
							isLoading : false,
							errMessage : response.message
						});
						reject();
					}
				}, (err)=>{
					this.setState({
						isLoading : false,
						errMessage : err.message
					});
					reject();
				});
			}).then(()=>{
				return this.fetchNextRequest();
			}).catch((err)=>{
				// handle any rejected promises
			});
		};

		this.renderLoadingPage = ()=>{
			return (
				<React.Fragment>
					<h1>One moment while we configure some things...</h1>
					<p>Please don't close this window just yet.</p>
				</React.Fragment>
			);
		};

		this.renderRetryPage = (retryFunction, errMessage)=>{
			return (
				<React.Fragment>
					<h1>{errMessage}</h1>
					<button class="loginapp-submit" onClick={retryFunction}>Retry</button>
				</React.Fragment>
			);
		};

		this.currentRequest = 0;
		this.requests = [
			this.parseUrlArgs,
			this.initSession,
			this.connectToTwitch,
			this.subscribeToEvents
		];
	}

	componentDidMount() {
		this.fetchNextRequest.bind(this)();
	}

	render() {
		let isLoading = this.state.isLoading;
		let errMessage = this.state.errMessage;

		if (isLoading) {
			return this.renderLoadingPage();
		}

		let retryFunction = this.fetchNextRequest.bind(this);
		return this.renderRetryPage(retryFunction, errMessage);
	}
}

let domNode = document.getElementById('root');
let root = ReactDOM.createRoot(domNode);
root.render(<ProcessLoginApp
	loginUrl="http://localhost:3000/auth/login"
	setTokenUrl="http://localhost:3000/auth/setToken"
	initSessionUrl="http://localhost:3000/auth/session/init"
	connectUrl="http://localhost:3000/events/connect"
	subscribeUrl="http://localhost:3000/events/subscribe"
/>);