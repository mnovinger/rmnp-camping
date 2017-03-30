// Default layout template
const React = require('react');

const Default = React.createClass({
    render: function() {
        return(
            <html>
                <head>
                    <meta charSet="utf-8"></meta>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
                    <title>RMNP Campsite Availability</title>
                    <link rel="stylesheet" href="css/campsite-status.css" type="text/css"/>
                    <link rel="stylesheet" href="css/bootstrap.min.css" type="text/css"/>
                    <link rel="stylesheet" href="css/bootstrap-theme.min.css" type="text/css"/>
                </head>
                <body>
                    <div id="root"></div>
                    <script src="js/vendor.bundle.js"></script>
                    <script src="js/bundle.js"></script>
                </body>
            </html>
        );
    }
});

module.exports = Default;