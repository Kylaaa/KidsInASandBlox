const express = require('express');


function createDebugRoutes(dbService, logsService, twitchService) {
    const router = express.Router();

    router.get(`events/add`, (req, res)=>{
        dbService.addEvent({
            "subscription": {
                "id": "f1c2a387-161a-49f9-a165-0f21d7a4e1c4",
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
                "created_at": "2023-06-29T17:20:33.860897266Z"
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

    router.get(`events/all`, async(req, res)=>{
        let events = await dbService.getAllEvents();
        res.json({ success : true, events : events});
    });

    router.get(`auth/getUser`, async(req, res)=>{
        twitchService.getUserId().then((res)=>{
            
        });
    });
    router.get('events/subscribe', async(req, res)=>{
        twitchService
    });

    return router;
}

module.exports = createDebugRoutes;