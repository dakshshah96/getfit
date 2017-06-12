const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

// // image rule for late use if needed
// const images = {
//   test: /\.(png|jpg)$/,
//   loader: 'file-loader'
// };

// This is our JavaScript rule that specifies what to do with .js files
const javascript = {
  test: /\.(js)$/, // match anything that ends in `.js`
  use: [{
    loader: 'babel-loader',
    options: { presets: ['es2015'] } // pass options
  }],
};

// post css loader
const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins() { return [autoprefixer({ browsers: 'last 3 versions' })]; }
  }
};

// sass/css loader. handles files that are require('something.scss')
const styles = {
  test: /\.(scss)$/,
  // here we pass the options as query params b/c it's short.
  // remember above we used an object for each loader instead of just a string?
  // We don't just pass an array of loaders, we run them through the extract plugin so they can be outputted to their own .css file
  use: ExtractTextPlugin.extract(['css-loader?sourceMap', postcss, 'sass-loader?sourceMap'])
};

// this one will compress the crap out of JS uglify
const uglify = new webpack.optimize.UglifyJsPlugin({ // eslint-disable-line
  compress: { warnings: false }
});

// put it all together
const config = {
  entry: {
    // just one entry. add more here if needed
    App: './public/javascripts/fit-app.js'
  },
  // specify which type of source map to use
  devtool: 'source-map',
  // output everything to files
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: '[name].bundle.js'
  },

  // pass defined rules here
  module: {
    rules: [javascript, styles]
  },
  plugins: [
    // output css to a separate file
    new ExtractTextPlugin('style.css'),
  ]
};

// supress API deprecation warnings
process.noDeprecation = true;

module.exports = config;