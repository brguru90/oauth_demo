


const  { createProxyMiddleware }  = require("http-proxy-middleware");
const http = require("http");
var keepAliveAgent = new http.Agent({ keepAlive: true });
module.exports = function (app) {
  app.use(
    createProxyMiddleware("/oauth_provider_api", {
      target: "http://localhost:8000",
      changeOrigin: true,
      pathRewrite: {
        "^/oauth_provider_api": "/", 
      },
      logLevel: 'debug',
    })
  );
  app.use(
    createProxyMiddleware("/oauth_client_api", {
      target: "http://localhost:7000",
      changeOrigin: true,
      // agent: keepAliveAgent,
      pathRewrite: {
        "^/oauth_client_api": "/",
      },
      logLevel: 'debug',
    })
  );

 

};
