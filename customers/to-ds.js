/* Handles communication with the google datastore */

'use strict';

const express = require('express');
const {Datastore} = require('@google-cloud/datastore');

const ds = new Datastore();
const kind = 'Customer';


// Handle indexing and transformation to datastore format
function googlify(obj, exclude) {
    exclude = exclude || [];
    const toReturn = [];
    Object.keys(obj).forEach(i => {
      if (obj[i] === undefined) {
        return;
      }
      toReturn.push({
        name: i,
        value: obj[i],
        excludeFromIndexes: exclude.indexOf(i) !== -1,
      });
    });
    return toReturn;
}

// Insert into datastore
function insert(data, cb) {

  let key = ds.key(kind); // Let the datastore generate a key for us with limited scope

  const entity = {
    key: key,
    data: googlify(data, ['firstName']), // Don't index on firstName (arbitrarily)
  };
  ds.save(entity, err => {
    data.id = entity.key.id;
    cb(err, err ? null : data);
  });
  return;
}

// Get by ID
function get(id, cb) {
  const key = ds.key([kind, parseInt(id, 10)]);

  ds.get(key, (err, entity) => {
    if (!err && !entity) {
      err = {
        code: 404,
        message: 'Not found',
      };
    }
    if (err) {
      cb(err);
      return;
    }
    entity.id = entity[Datastore.KEY].id;
    cb(null, entity);
  });

  return;
}

// Get all customers
function list(cb) {
  var query = ds.createQuery([kind]);
  ds.runQuery(query, (err, customers) => cb(err, customers, ds.KEY));
  return;
}


module.exports = {
  insert,
  get,
  list
};
