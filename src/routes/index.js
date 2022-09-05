const collectionsRouter = require('./collections');
const siteRouter = require('./site');
const productsRouter = require('./products');

function route(app) {
  // http method

  app.use('/collections', collectionsRouter);
  app.use('/products', productsRouter);
  app.use('/', siteRouter);
}

module.exports = route;
