const functions = require('firebase-functions');
const express = require('express');
const { ngExpressEngine } = require('@nguniversal/express-engine');
const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');
const path = require('path');

const app = express();

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'dist/stroyka/browser')));

// Configuración de Angular Universal
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'dist/stroyka/browser'));

// Todas las rutas son manejadas por SSR
app.get('*', (req: any, res: { render: (arg0: string, arg1: { req: any; }) => void; }) => {
  res.render('index', { req });
});

exports.ssr = functions.https.onRequest(app);
