/**
 * @swagger
 * tags:
 *  name: App
 *  description: Endpoints regarding the state of the app
 * /app/status:
 *  get:
 *    summary: Returns the status of your connection to Twitch.
 *    tags: [App]
 *    responses:
 *      200:
 *        description: 
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                authenticated:
 *                  type: boolean
 *                connected:
 *                  type: boolean
 *              
 * /app/connect:
 *  get:
 *    summary: Opens a window to authenticate with Twitch and connect to events
 *    tags: [App]
 *    responses:
 *      202:
 *        description: A webview will open shortly.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 */

const express = require('express');

function createRoutes(appController) {
    const router = express.Router();

    // WHEN FUNCTIONS ARE PASSED TO HIGHER ORDER FUNCTIONS, THE
    // 'this' KEYWORD LOSES SCOPE AND BECOMES UNDEFINED.
    // DO NOT PASS RAW CLASS FUNCTIONS TO THE ROUTER
    router.get(`/status`,   (req, res)=> appController.checkStatus(req, res));
    router.get(`/connect`,  (req, res)=> appController.connectToTwitch(req, res));

    return router;
}

module.exports = createRoutes;