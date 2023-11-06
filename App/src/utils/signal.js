const signal = {
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

module.exports = function(name) {
	var newSignal = Object.create(signal);
	newSignal.name = name;
	return newSignal;
};
