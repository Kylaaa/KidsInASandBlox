/**
 * @swagger
 * tags:
 *  name: Debug
 *  description: Endpoints regarding the state of the app
 * /debug/events/add:
 *  get:
 *    summary: pushes a sample event to the database
 *    tags: [Debug]
 *    responses:
 *      200:
 *        description: 
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                message:
 *                  type: string
 */

const express = require('express');
const { randomUUID } = require('node:crypto');


function createDebugRoutes(dbService, logsService, twitchService) {
    const router = express.Router();
    router.get("/events/add", (req, res)=>{
        dbService.addEvent({
            "subscription": {
                "id": randomUUID(),
                "type": "channel.update",
                "version": "2",
                "status": "enabled",
                "cost": 0,
                "condition": {
                    "broadcaster_user_id": "1337"
                },
                "transport": {
                    "method": "webhook",
                    "callback": "https://example.com/webhooks/callback"
                },
                "created_at": (new Date()).toISOString()
            },
            "event": {
                "broadcaster_user_id": "1337",
                "broadcaster_user_login": "cool_user",
                "broadcaster_user_name": "Cool_User",
                "title": "Best Stream Ever",
                "language": "en",
                "category_id": "12453",
                "category_name": "Grand Theft Auto",
                "content_classification_labels": [ "MatureGame" ]
            }
        });

        res.json({ success : true, message : "debug event added" });
    });


    router.get("/auth/getUser", async(req, res)=>{
        twitchService.getUserId().then((res)=>{
            
        });
    });

    return router;
}

module.exports = createDebugRoutes;