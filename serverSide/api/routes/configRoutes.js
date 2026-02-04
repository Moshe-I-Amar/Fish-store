const indexRoutes = require('../../api/routes/index');
const categoryRoutes = require('../../api/routes/categories');
const productRoutes = require('../../api/routes/products');
const userRoutes = require('../../api/routes/users');



exports.routesInit = (app) => {
  app.use('/', indexRoutes)
  app.use('/categories', categoryRoutes)
  app.use('/products', productRoutes)
  app.use('/users', userRoutes)
}