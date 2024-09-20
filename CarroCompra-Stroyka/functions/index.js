const functions = require('firebase-functions');
const express = require('express');

// Usa `import()` en lugar de `require()`
let app;

async function createServer() {
  const { AppServerModule } = await import('../dist/stroyka/server/main.js');
  const { ngExpressEngine } = await import('@nguniversal/express-engine');
  const server = express();

  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule
  }));

  server.set('view engine', 'html');
  server.set('views', '../dist/stroyka/browser');

  server.get('*', (req, res) => {
    res.render('index', { req });
  });

  return server;
}

exports.ssrFunction = functions.https.onRequest(async (req, res) => {
  if (!app) {
    app = await createServer();
  }
  return app(req, res);
});
