import React from 'react';

export default function scopeGroup(props) {
	let permission = props.permission;
	let eventList = props.events;

	// eventData : 
	// - name
	// - description
	// 
	let boxes = eventList.map((eventData) =>
		<React.Fragment>
			<input type="checkbox" name="{eventData.name}" checked/>
			<label for="{eventData.name}">
				<span class="scope-title">{eventData.name}</span> - {eventData.description}
			</label>
		</React.Fragment>
	);

	return (
		<div class="scope-group">
			<h3>these are a scope group</h3>
			{boxes}
		</div>
	);
}