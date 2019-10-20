/* Handles calls from the webapp to the API */

'use strict';

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');

const tods = require('./to-ds');
const {Datastore} = require('@google-cloud/datastore');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

// Create Customer
router.post('/add', (req, res, next) => {
  const data = req.body;

  /* Exactly here is where a lot of input checking should be going on */

  tods.insert(data, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect('/');
  });
});

// Show all customers
router.get('/list', (req, res, next) => {
  const list = tods.list((err, entities) => {
    if (err) {
      next(err);
      return;
    }
    // Append explicit id to each entity
    for (var i in entities) {
      entities[i].id = entities[i][Datastore.KEY].id;
    }

    res.render('customers/list.pug/', {
      customers: entities
    });
  });
});

// Show customer by ID

router.post('/fetch', (req, res, next) => {
  const id = parseInt(req.body.id, 10);
  tods.get(id, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.render('customers/show.pug', {
      customer: entity
    });
  });
});

module.exports = router;
