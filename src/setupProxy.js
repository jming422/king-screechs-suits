const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  // Proxy api requests
  const apiProxy = proxy('/api', {
    changeOrigin: true,
    autoRewrite: true,
    target: 'http://localhost:5000',
  });
  app.use(apiProxy);
};
