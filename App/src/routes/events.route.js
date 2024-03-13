/**
 * @swagger
 * tags:
 *  name: Events
 *  description: Endpoints for accessing the events from Twitch.
 * components:
 *  schemas:
 *    TwitchEvent:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: a unique identifier for this event, useful for de-duping across requests
 *        name:
 *          type: string
 *          description: the subscription_type of the event, ex) 'channel.update'
 *        data:
 *          type: object
 *          description: a JSON object containing all of the relevant information from this event
 *        received_date:
 *          type: string
 *          format: date-time
 *          description: the date-time that Twitch received the event
 * 
 *    ListOfEvents:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *          description: Whether the request succeeded.
 *        events:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/TwitchEvent'
 *          description: The list of Twitch events received in chronological order.
 * 
 * /events/all:
 *  get:
 *    summary: Gets all of the events received in the current session
 *    tags: [Events]
 *    responses:
 *      200:
 *        description: The complete list of events.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ListOfEvents'
 * 
 * /events/between:
 *  get:
 *    summary: Gets all of the events received between the start and end dates
 *    tags: [Events]
 *    parameters:
 *      - in: query
 *        name: start
 *        schema:
 *          type: string
 *          format: date-time
 *        required: true
 *        description: The starting datetime to fetch events between.
 *        example: "2024-01-01T00:01:00Z"
 *      - in: query
 *        name: end
 *        schema:
 *          type: string
 *          format: date-time
 *        required: true
 *        description: The ending datetime to fetch events between.
 *        example: "2024-12-31T23:59:59Z"
 *    responses:
 *      200:
 *        description: The list of events.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ListOfEvents'
 *      400:
 *        description: Invalid dates for start or end.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorWithMessage'
 */

const express = require('express');

function createRoutes(eventsController) {
    const router = express.Router();

    // WHEN FUNCTIONS ARE PASSED TO HIGHER ORDER FUNCTIONS, THE
    // 'this' KEYWORD LOSES SCOPE AND BECOMES UNDEFINED.
    // DO NOT PASS RAW CLASS FUNCTIONS TO THE ROUTER
    router.get(`/all`,          async (req, res)=> await eventsController.all(req, res));
    router.get(`/between`,      async (req, res)=> await eventsController.between(req, res));
    router.post(`/connect`,     async (req, res)=> await eventsController.connectToTwitch(req, res));
    router.post(`/subscribe`,   async (req, res)=> await eventsController.subscribeToAll(req, res));

    return router;
}

module.exports = createRoutes;