const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cookieParser = require('cookie-parser');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const basePath = process.env.REACT_APP_BASE_DOC ? process.env.REACT_APP_BASE_DOC : '';



const options = {
  target: process.env.REACT_APP_AUTH_BASE_URL,
  changeOrigin: true,
  pathRewrite: {
    "[a-zA-Z0-9/]*/api/wrapper/auth" : "/api/v1/auth",
    "[a-zA-Z0-9/]*/api/wrapper/collect" : "/collect",
    "[a-zA-Z0-9/]*/api/wrapper/status" : "/status"
  }
}
const proxy = createProxyMiddleware(options);
app
  .prepare()
  .then(() => {
    const server = express();

    server.use(basePath+'/api/wrapper', proxy);
    server.use( cookieParser());

    server.get('*', (req, res) => {
      return handle(req, res);
    });
    server.post('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });