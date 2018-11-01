module.exports = {
  mode: 'development',
  entry: './example/app.js',
  output: {
    path: __dirname + '/example',
    filename: 'bundle.js',
    publicPath: '/example/'
  },
  module: {
    rules: [
      { test: /\.m?js$/, exclude: /node_modules/, use: 'babel-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' }
    ]
  },
  devtool: 'source-map'
};
