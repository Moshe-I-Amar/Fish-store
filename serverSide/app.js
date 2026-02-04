const express = require('express');
const path = require('path');
const cors = require('cors');
const { routesInit } = require('./api/routes/configRoutes');
require('./db/mongooConnect')

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

routesInit(app)




module.exports = app;
