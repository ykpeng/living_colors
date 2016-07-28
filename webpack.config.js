module.exports = {
  entry: "./lib/cellular_automaton.js",
  output: {
  	filename: "./lib/bundle.js"
  },
  devtool: 'source-map',
  resolve: {
  extensions: ["", ".js", ".jsx" ]
  }
};
