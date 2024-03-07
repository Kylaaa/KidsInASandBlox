/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: Endpoints to authenticate the Twitch session
 */

const express = require('express');

function createRoutes(authController) {
    const router = express.Router();

    // WHEN FUNCTIONS ARE PASSED TO HIGHER ORDER FUNCTIONS, THE
    // 'this' KEYWORD LOSES SCOPE AND BECOMES UNDEFINED.
    // DO NOT PASS RAW CLASS FUNCTIONS TO THE ROUTER
    router.get('/login',            (req, res)=> authController.loginUI(req, res));
    router.post('/login',           (req, res)=> authController.login(req, res));
    router.get('/login/config',     (req, res)=> authController.getAuthConfig(req, res));
    router.get('/process-login',    (req, res)=> authController.processLogin(req, res));
    router.get('/setToken',         (req, res)=> authController.setToken(req, res));
    router.get('/session/init', async (req, res)=> await authController.fetchUserData(req, res));
    return router;
}

module.exports = createRoutes;