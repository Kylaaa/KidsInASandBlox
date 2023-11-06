/*
 * A service that holds onto the list of observed events.
 */




function pushEvent(evt){
	events.push(evt);
};

function getEvents() {

	return events;
};

module.exports = {
	pushEvent : pushEvent,
	getEvents : getEvents
};