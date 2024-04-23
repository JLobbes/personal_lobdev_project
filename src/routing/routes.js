// access the Express.js router module to create local router
const express = require('express');
const router = express.Router();

// import the bodyParser module to parse incoming requests
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// import controllers

// define the routes desired using the router object, url is end url
router.get('/', (request, response) => {
    response.render('../views/index.handlebars');
});

// package routes as module and export
module.exports = router;