const {createProxyMiddleware} = require("http-proxy-middleware")
// const streamify = require('stream-array');
const http = require("http")
var keepAliveAgent = new http.Agent({keepAlive: true})
module.exports = function (app) {
    app.use(
        "/oauth_provider_api",
        createProxyMiddleware({
            target: "http://localhost:8000",
            changeOrigin: true,
            agent: keepAliveAgent,
            // ws: true,
            xfwd: true,
            pathRewrite: {
                "^/oauth_provider_api": "/",
            },
        })
    ),
    app.use(
        "/oauth_client_api2",
        createProxyMiddleware({
            target: "http://localhost:7000",
            changeOrigin: true,
            agent: keepAliveAgent,
            // ws: true,
            xfwd: true,
            pathRewrite: {
                "^/oauth_client_api2": "/",
            },
        })
    )
}