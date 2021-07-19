const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Proxy api requests
  const apiProxy = createProxyMiddleware('/api', {
    changeOrigin: true,
    autoRewrite: true,
    target: 'http://localhost:5000',
  });
  app.use(apiProxy);
};
