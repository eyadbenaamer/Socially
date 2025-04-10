const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/storage",
    createProxyMiddleware({
      target: `${process.env.REACT_APP_APP_URL}`,
      changeOrigin: true,
    })
  );
};
