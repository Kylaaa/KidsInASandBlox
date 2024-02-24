import React from 'react';
import "./scopeGroup.css";

export default function ScopeGroup(props) {
	let permission = props.permission;
	let eventList = props.events;

	// eventData : 
	// - name
	// - description
	let boxes = eventList.map((eventData) =>
		<div class="scope-group-item">
			<input class="scope-group-input" type="checkbox" name="{eventData.name}" checked/>
			<label class="scope-group-label" for="{eventData.name}">
				<span class="scope-group-title">{eventData.name}</span>
				<span class="scope-group-description">{eventData.description}</span>
			</label>
		</div>
	);

	return (
		<div class="scope-group">
			<h3>{permission}</h3>
			{boxes}
		</div>
	);
}