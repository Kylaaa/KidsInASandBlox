const express = require('express');

function createRoutes() {
    const router = express.Router();
    router.get('/', (req, res)=> {
        res.redirect("/docs");
    });

    return router;
}

module.exports = createRoutes;