'use strict';

const express = require('express');
const app = express();

// Use the api, mounted on /api/customers
app.use('/customers', require('./customers/api'));

// Use pug to make some nice buttons
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Google datastore demo by Jakob K 🐍'
  });
});

// Add a customer (front end)
app.get('/customers/add', (req, res) => {
  res.render('customers/addform.pug', {
    customer: {}, // Default empty form
  });
});

// List customers (front end)
app.get('/customers/list', (req, res, next) => {
  res.render('customers/list.pug');
});

// Get customer by ID (front end)
app.get('/customers/fetch', (req, res, next) => {
  res.render('customers/getform.pug', {
    customer: {}, // Default empty form
  });
});


// 404 handler
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// Other error handler
app.use((err, req, res) => {
  console.error(err);
  res.status(500).send(err.response || 'Something unexpected has happened');
});


const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit');
});


module.exports = app;
