// Create a basic Hapi.js server
require('babel-register')({
    presets: ['es2015', 'react']
});
const Hapi = require('hapi');
const dateFormat = require('dateformat');
const format = "dd mmm HH:MM:ss";
const util = require('util');
const agent = require('superagent');

// Basic Hapi.js connection stuff
const server = new Hapi.Server();
server.connection({
    host: '0.0.0.0',
    port: process.env.PORT || 8000
});

// Register the inert and vision Hapi plugins
// As of Hapi 9.x, these two plugins are no longer
// included in Hapi automatically
// https://github.com/hapijs/hapi/issues/2682
server.register([{
    register: require('inert')
}, {
    register: require('vision')
}], function(err) {

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
        method: 'GET',
        path: '/api/availability',
        handler: (request, reply) => {
            agent.get('http://localhost:8080/api/availability')
                .end((err, res) => {
                    reply(res.body);
                });
        }
    })

    server.start(function() {
        console.log('proxying to java server at http://localhost:8080');
        console.log(dateFormat(new Date(), format) + ' - Server started at: ' + server.info.uri);
    });

});