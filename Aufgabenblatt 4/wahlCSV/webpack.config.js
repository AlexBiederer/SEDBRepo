var path = require('path');


module.exports = {
  context: __dirname,
  entry: ["./app/js/index.js"],
    devtool: 'source-map',
  output: {
    path: path.join(__dirname, "/dist/js"),
    publicPath: "/dist/js",
    filename: "tubeD3.js"
  },
  devServer: {
    stats: 'errors-only',
    contentBase: "./",
    inline: true // Important for source-maps
  }
}
