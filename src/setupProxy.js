const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  // Proxy api requests
  const apiProxy = proxy('/api', {
    changeOrigin: true,
    autoRewrite: true,
    target: 'http://localhost:5000',
  });
  app.use(apiProxy);

  // Proxy websocket requests
  const wsProxy = proxy('/ws', {
    ws: true,
    changeOrigin: true,
    autoRewrite: true,
    target: 'ws://localhost:5000',
  });
  app.use(wsProxy);
};
