// Create a basic Hapi.js server
require('babel-register')({
    presets: ['es2015', 'react']
});
var Hapi = require('hapi');
var dateFormat = require('dateformat');
var format = "dd mmm HH:MM:ss";
var util = require('util');

var campsiteAvailability = require('./campsite-status.json');

// Basic Hapi.js connection stuff
var server = new Hapi.Server();
server.connection({
    host: '0.0.0.0',
    port: process.env.PORT || 8000
});

var validateAvailability = (data) => {
    /*
     should have cgSiteData array with 139 entries and
     allDates array with 133 entries

     each cgSiteData.status should have the same number
     of entries as allDates (133)
     */

    var isValid = true;
    if (!data.cgSiteData) {
        console.error("didn't find cgSiteData in availability file");
        isValid = false;
    }
    if (data.cgSiteData.length != 139) {
        console.error(`wrong number of site in cgSiteData ${data.cgSiteData.length} not 139`);
        isValid = false;
    }
    if (!data.allDates) {
        console.error("didn't find allDates in availability file");
        isValid = false;
    }
    var dateCount = data.allDates.length;



    return isValid;
};

if (!validateAvailability(campsiteAvailability)) {
    console.error('found issues with the campsite availability, bailing');
    process.exit(1);
} else {
    console.log('campsite availability file looks good');
}
// Register the inert and vision Hapi plugins
// As of Hapi 9.x, these two plugins are no longer
// included in Hapi automatically
// https://github.com/hapijs/hapi/issues/2682
server.register([{
    register: require('inert')
}, {
    register: require('vision')
}], function (err) {

    if (err) return console.error(err);

    // Add the React-rendering view engine
    server.views({
        engines: {
            jsx: require('hapi-react-views')
        },
        relativeTo: __dirname,
        path: 'src/views'
    });

    // Add a route to serve static assets (CSS, JS, IMG)
    server.route({
        method: 'GET',
        path: '/campsite-availability',
        handler: (request, reply) => {
            reply(campsiteAvailability);
        }
    });

    // Add a route to serve static assets (CSS, JS, IMG)
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'public',
                index: ['index.html']
            }
        }
    });

    // Add main app route
    server.route({
        method: 'GET',
        path: '/',
        handler: {
            view: 'default'
        }
    });

    server.route({
        method: 'POST',
        path: '/update-campsite-availability',
        handler: (request, reply) => {
            // console.log('got it ' + util.inspect(request.payload));
            const  newCampsiteAvailability = request.payload;
            if (validateAvailability(newCampsiteAvailability)) {
                campsiteAvailability = newCampsiteAvailability;
                reply('Updated availability.');
            } else {
                reply('Rejected new availability.')
            }
        }
    });

    server.start(function () {
        console.log(dateFormat(new Date(), format) + ' - Server started at: ' + server.info.uri);
    });

});