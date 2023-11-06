const express = require('express');

function createRoutes(appController) {
	const router = express.Router();
	router.get('/authenticate', appController.authenticate);

	router.get('/changes', appController.getChanges);

	router.post('/login', appController.authenticate);
	router.put('/subscribe', appController.subscribe);
	router.delete('/subcribe', appController.unsubscribe);

	return router;
}

module.exports = createRoutes;