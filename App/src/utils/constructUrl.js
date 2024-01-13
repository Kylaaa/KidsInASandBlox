module.exports = function(baseUrl, args) {
	var targetUrl = baseUrl;
	for (var key in args) {
		targetUrl += `${key}=${encodeURIComponent(args[key])}&`;
	};
	return targetUrl.substring(0, targetUrl.length - 1);
}