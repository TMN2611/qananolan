const collectionsRouter = require('./collections');
const siteRouter = require('./site');
const productsRouter = require('./products');
const searchsRouter = require('./search');
const apisRouter = require('./apis');
const ordersRouter = require('./order');

function route(app) {
  // http method

  app.use('/collections', collectionsRouter);
  app.use('/products', productsRouter);
  app.use('/search', searchsRouter);
  app.use('/apis', apisRouter);
  app.use('/order', ordersRouter);

  app.use('/', siteRouter);
}

module.exports = route;
