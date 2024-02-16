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
    router.get('/isAlive',          (req, res)=> appController.isAlive(req, res));
    router.get(`/checkConnection`,  (req, res)=> appController.checkConnection(req, res));
    router.get(`/connect`,          (req, res)=> appController.connectToTwitch(req, res));

    return router;
}

module.exports = createRoutes;