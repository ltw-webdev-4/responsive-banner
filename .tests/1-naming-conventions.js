var
  MultiLineError = require('./test-utils').MultiLineError,
  fs = require('fs'),
  util = require('util'),
  dir = require('node-dir')
;

/*
  +++++++++++++++++++++++++++++++++++++++++++++++
  TESTS
  +++++++++++++++++++++++++++++++++++++++++++++++
*/

describe('# naming conventions', function () {

  it('files follow naming conventions', function (done) {
    dir.files('./', function(err, files) {
      var prettyErrors = [];

      files = files.filter(function (file) {
         return !file.match(/^(?:node_modules|\.|README.md|package.json)/);
      });

      files = files.filter(function (file) {
         return !file.match(/(?:.DS_Store)$/);
      });

      files.forEach(function (file) {
        if (file !== file.replace(/[^a-z0-9\-\.\/]/g, '')) {
          prettyErrors.push(util.format("`%s`: Doesn't follow naming conventions", file));
        }
      });

      if (prettyErrors.length > 0) {
        throw new MultiLineError('Naming Conventions', prettyErrors);
      }

      done();
    });
  });

});
