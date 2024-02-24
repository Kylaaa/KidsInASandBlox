/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: Endpoints to authenticate the Twitch session
 */

const express = require('express');
const config = require('./../config/app.config.json');

function createRoutes(routePath, authController) {
    const router = express.Router();

    // WHEN FUNCTIONS ARE PASSED TO HIGHER ORDER FUNCTIONS, THE
    // 'this' KEYWORD LOSES SCOPE AND BECOMES UNDEFINED.
    // DO NOT PASS RAW CLASS FUNCTIONS TO THE ROUTER
    router.get('/login/config', (req, res)=> authController.getLoginPageConfiguration(req, res));
    router.get('/login',        (req, res)=> authController.loginUI(req, res));
    router.post('/login',       (req, res)=> authController.login(req, res));
    router.get('/handleLogin',  (req, res)=> authController.authenticate(`/${routePath}/setToken`, req, res));
    router.get('/setToken',     (req, res)=> authController.setToken(req, res));
    return router;
}

module.exports = createRoutes;