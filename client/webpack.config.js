var glob = require("glob");

var entry = glob.sync("./src/app/!(__unit__)*/*.js").concat(glob.sync("./src/app/!(__unit__)*.js"));

console.log(`entry: ${entry}`);
module.exports = {
    entry: entry,
    output: {
        path: __dirname + '/public/js',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /unit|node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
};