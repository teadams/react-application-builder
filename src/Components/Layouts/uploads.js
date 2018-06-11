var express = require('express');
var uploads = express.Router();
var async = require('async');
const parse = require('csv-parse/lib/sync')
const db = require('../modules/db.js');
const log = require('../modules/log.js');
var metadata_fields = require('../models/fields.js');
metadata_fields = metadata_fields.metadata_fields;
var metadata_object_types = require('../models/object_types')
metadata_object_types = metadata_object_types.metadata_object_types;


uploads.post('/:object_type', (req, res, next) => {
  log.func('db.uploads')
  const object_type = req.params.object_type;
  log.val('object type', object_type)  
  var rows = req.files.file.data.toString();
  rows = parse(rows,  {columns: true});
  async.eachOfLimit(rows, 5, function(row, index, callback) {
      log.val('processing row', row);
      db.persist(object_type, row, 'pretty_name', (err,  db_result) => {
        if (err) {
            log.val("Uploads Error", err.message);
            callback(err);
        } else {
            log.val('DB Success, row', db_result, rows[index]);
            callback();
        }
            
      });
    }, function(err) {
      log.mark('Async callback')
      if( err ) {
          log.mark ('Error Message')
          log.val('Error with upload ', err.message);
          return res.json('Error Uploading File');
      } else {
        console.log('Success');
        return res.json('File Uploaded');
      }
  });

})

module.exports = uploads;
