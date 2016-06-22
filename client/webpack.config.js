var glob = require("glob");

var entry = glob.sync("./src/app/!(__unit__)*/*.jsx").concat(glob.sync("./src/app/!(__unit__)*.jsx"));

console.log(entry);
module.exports = {
    entry: entry,
    output: {
        path: __dirname + '/public/js',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                exclude: /unit|node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
};