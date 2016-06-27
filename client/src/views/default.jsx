// Default layout template
var React = require('react');

var Default = React.createClass({

    render: function() {

        return(
            <html>
            <head>
                <meta charSet="utf-8"></meta>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
                <title>RMNP Campsite Availability</title>
                <link href="campsite-status.css" rel="stylesheet" type="text/css"/>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css"/>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css"/>
            </head>
            <body>
            <div id="root"></div>
            <script src="js/bundle.js"></script>
            </body>
            </html>
        );
    }
});

module.exports = Default;