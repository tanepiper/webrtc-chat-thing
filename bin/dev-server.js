const Path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.config.js');


webpackConfig.module.loaders.map(loader => {
  if (/js|jsx/.test(loader.test)) {
    loader.query.plugins.push(['react-transform', {
      'transforms': [{
        'transform': 'react-transform-hmr',
        // if you use React Native, pass 'react-native' instead:
        'imports': ['react'],
        // this is important for Webpack HMR:
        'locals': ['module']
      }]
      // note: you can put more transforms into array
      // this is just one of them!
    }]);
  }
});

webpackConfig.entry.app.push(
  //`webpack-dev-server/client?localhost:9000`,
  `webpack/hot/dev-server`
);

webpackConfig.plugins.push(
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('development')
    }
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
);

const server = new WebpackDevServer(webpack(webpackConfig), {
  contentBase : Path.resolve(__dirname, '../src'),
  hot    : true,
  quiet  : false,
  noInfo : false,
  lazy   : false,
  stats  : {
    colors : true
  },
  historyApiFallback : true
});

server.listen(9001, 'localhost', () => {
  console.log(`Webpack dev server running at ${'localhost'}: ${9001}`); // eslint-disable-line
});
