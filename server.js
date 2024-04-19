// import the Express.js module
const express = require('express');
const my_application = express();

// import the initialization_database.js file to set default structure of DB
// const db_initialization = require('./src/models/initialize_database.js');

// set up Handlebars as template engine, with partials & helpers
const handlebars = require('express-handlebars');
const customHelpers = require('./helpers/custom_helpers.js');
const partials = require('./helpers/partials_setup.js');
my_application.engine('handlebars', handlebars.engine({
    defaultLayout: false,
    helpers: customHelpers
}));
my_application.set('view engine', 'handlebars'); 

// point to the views folder for Handlebars
const path = require('path');
const path_to_views = path.join(__dirname, 'src', 'views');
my_application.set('views', path_to_views);

// routes get imported here
const router = require('./src/routing/routes');

// route Module mounted below, string is left empty if you want don't want application name after domain name and before tail
my_application.use('', router);

// ensure static assets can be accessed
const path_to_views_js = path.join(__dirname, 'src', 'views_js');

// serve static assets from the 'views_js' directory
my_application.set('views_js', path_to_views_js);
my_application.use('/src/views_js', express.static(path_to_views_js));
my_application.use('/assets', express.static('assets'));

// last step, start the Express server
const port = process.env.PORT || 3000; // Use Heroku's port or 3000 if there is no PORT env
my_application.listen(port, () => {
    console.log(`Server is running on port: ${port}`); // Updated message
});


