/**
 * @swagger
 * tags:
 *  name: App
 *  description: Endpoints regarding the state of the app
 */

const express = require('express');

function createRoutes(appController) {
    const router = express.Router();

    // WHEN FUNCTIONS ARE PASSED TO HIGHER ORDER FUNCTIONS, THE
    // 'this' KEYWORD LOSES SCOPE AND BECOMES UNDEFINED.
    // DO NOT PASS RAW CLASS FUNCTIONS TO THE ROUTER
    router.get('/authenticate', (req, res)=> appController.authenticate(req, res));
    router.post('/login', (req, res)=> appController.authenticate(req, res));
    router.put('/subscribe', (req, res)=> appController.subscribe(req, res));
    router.delete('/unsubcribe', (req, res)=> appController.unsubscribe(req, res));

    return router;
}

module.exports = createRoutes;