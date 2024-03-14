import React from 'react';
import "./scopeGroup.css";

class ScopeGroup extends React.Component {
	constructor(props) {
		super(props);

		let boxState = {};
		for (let [index, eventData] of Object.entries(props.events)){
			boxState[eventData.id] = {
				checked : true
			};
		}
		this.state = boxState;

		this.toggleBox = (id)=>{
			console.log(`Toggling box for ${id}`);
			let toggleState = {};
			toggleState[id] = {
				checked : !this.state[id].checked
			}
			this.setState(toggleState);
		};

		this.toggleGroup = ()=>{
			let totalChecked = 0;
			for (let [id, boxData] of Object.entries(this.state)) {
				if (boxData.checked){
					totalChecked++;
					break;
				}
			}

			// if nothing is checked, toggle the group on, otherwise disable the group
			let isChecked = (totalChecked == 0);
			console.log(`Toggling group to ${isChecked}`);
			let boxState = {};
			for (let [id, boxData] of Object.entries(this.state)) {
				boxState[id] = {
					checked : isChecked
				}
			}
			this.setState(boxState);
		};
	}

	render(){
		let props = this.props;
		let permission = props.permission;
		let eventList = props.events;
		let checkedState = this.state;
		let toggleGroup = this.toggleGroup.bind(this);
		let toggleBox = this.toggleBox.bind(this);

		// eventData : 
		// - name
		// - description
		let boxes = eventList.map((eventData) =>
			<div class="scope-group-item">
				<input class="scope-group-input"
					type="checkbox"
					name={eventData.id}
					value={eventData.scope}
					checked={checkedState[eventData.id].checked}
					onClick={ ()=>{ toggleBox(eventData.id); } }/>
				<label class="scope-group-label" for={eventData.id}>
					<span class="scope-group-title" onClick={()=>{ toggleBox(eventData.id)} }>{eventData.name}</span>
					<span class="scope-group-description" onClick={ ()=>{ toggleBox(eventData.id)} }>{eventData.description}</span>
				</label>
			</div>
		);

		return (
			<div class="scope-group">
				<h3 onClick={()=>{ toggleGroup(); }}>{permission}</h3>
				{boxes}
			</div>
		);
	}
}

export default ScopeGroup;