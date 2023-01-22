var event = {
	"name" : "",
	"callbacks" : [],
	connect : function(callback) {
		this.callbacks.push(callback);
	},
	fire : function(...args) {
		this.callbacks.foreach(function(callback) {
			callback(args);
		})
	}
};

module.exports = {
	createEvent : function(name) {
		var newEvent = Object.create(event);
		newEvent.name = name;
		return newEvent;
	}
};