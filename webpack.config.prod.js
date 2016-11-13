import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
  debug : true,
  devtool : 'source-map',
  noInfo : false,
  sentryDns : 'https://ef6873056df2411b8551ca2e4ee72108:33cca985b2e0477cb8b02a145a087ba9@sentry' +
    '.io/114112',
  entry : {
    vendor: path.resolve(__dirname, 'src/vendor'),
    main: path.resolve(__dirname, 'src/index')
  },
  target : 'web',
  output : {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[chunkhash].js'
  },
  plugins : [
    // Generate an external css file with a hash in the filename
    new ExtractTextPlugin('[name].[contenthash].css'),
    // Hash the file using Md5 so that thier names change when content change.
    new WebpackMd5Hash(),
    // Use CommonsChunkPlugin to create a separate bundle of vendor libraries so
    // that they're cached separately.
    new webpack
      .optimize
      .CommonsChunkPlugin({name: 'vendor'}),
    // Create HTML file that includes reference to bundled JS
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true,
      sentryDns: 'https://ef6873056df2411b8551ca2e4ee72108@sentry.io/114112'
    }),
    // Eliminate duplication package when generating bundle
    new webpack
      .optimize
      .DedupePlugin(),
    // Minify JS
    new webpack
      .optimize
      .UglifyJsPlugin()
  ],
  module : {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel']
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css?sourceMap')
      }
    ]
  }
}
