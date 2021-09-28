const path = require('path');
const fs = require('fs');

const resolve = (dir) => path.resolve(__dirname, dir);

module.exports = {
  webpack(config, env) {
    config.resolve.alias = {
      'containers': resolve('src/containers'),
      'pages': resolve('src/views/pages'),
      'images': resolve('src/views/images'),
      'sass': resolve('src/views/sass/main.sass'),
      'utils': resolve('src/utils'),
      'errorMsg': resolve('src/errorMsg'),
    };

    if (config.optimization.minimizer) {
      config.optimization.minimizer.forEach((minimizer) => {
        if (minimizer.constructor.name === 'TerserPlugin') {
          minimizer.options.terserOptions.compress.drop_console = true;
        }
      });
    }

    return config;
  },
  devServer(configFunction) {
    // Return the replacement function for create-react-app to use to generate the Webpack
    // Development Server config. "configFunction" is the function that would normally have
    // been used to generate the Webpack Development server config - you can use it to create
    // a starting configuration to then modify instead of having to create a config from scratch.
    return (proxy, allowedHost) => {
      // Create the default config by calling configFunction with the proxy/allowedHost parameters
      const config = configFunction(proxy, allowedHost);

      // Return your customised Webpack Development Server config.
      return config;
    };
  },
};

/*
module.exports = function (config, env) {
  config.resolve.alias = {
    'containers': resolve('src/containers'),
    'pages': resolve('src/views/pages'),
    'images': resolve('src/views/images'),
    'sass': resolve('src/views/sass/main.sass'),
    'utils': resolve('src/utils'),
    'errorMsg': resolve('src/errorMsg'),
  };

  if (config.optimization.minimizer) {
    config.optimization.minimizer.forEach((minimizer) => {
      if (minimizer.constructor.name === 'TerserPlugin') {
        minimizer.options.terserOptions.compress.drop_console = true;
      }
    });
  }

  setTimeout(() => {
    console.log(config);
    console.log(env);
  }, 15000);

  return config;
};
*/
