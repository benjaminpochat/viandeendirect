const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = function override(config, env) {
  config.resolve.fallback = {'querystring': require.resolve("querystring-es3")}
  return config
}
