var
  MultiLineError = require('./test-utils').MultiLineError,
  fs = require('fs'),
  util = require('util'),
  validator = require('w3c-css'),
  linter = require('stylelint')
;

var cleanMessage = function (message) {
  message = message.replace(/\s+/g, ' ');
  return message;
};

var shouldIncludeError = function (message, line) {
  // Caused by @viewport
  if (message == 'Parse Error' && line == 1) return false;

  if (message.match(/at-rule @.*viewport/i)) return false;

  if (message.match(/text-size-adjust/i)) return false;

  // Works around validator's calc() bug
  if (message.match(/value error.*parse error/i)) return false;

  return true;
};

/*
  +++++++++++++++++++++++++++++++++++++++++++++++
  TESTS
  +++++++++++++++++++++++++++++++++++++++++++++++
*/

describe('# css/main.css', function () {
  var exists;

  try {
    exists = fs.statSync('css/main.css').isFile();
  } catch (e) {
    exists = false;
  }

  /* FILE EXISTS ++++++++++++++++++++++++++++++++ */

  it('exists', function (done) {
    if (!exists) {
      throw new MultiLineError('File missing', ['The file `css/main.css` is missing or misspelled.']);
    }

    done();
  });

  if (!exists) return;

  /* VALIDATION ++++++++++++++++++++++++++++++++ */

  it('is valid CSS', function(done) {
    validator.validate({text: fs.readFileSync('css/main.css', 'utf8'), warning: 'no'}, function (err, data) {
      var prettyErrors = [];

      if (data.errors && data.errors.length > 0) {
        data.errors.forEach(function (item) {
          var message = cleanMessage(item.message);

          if (shouldIncludeError(message, item.line)) {
            prettyErrors.push(util.format('Line %d: %s', item.line, message));
          }
        });

        if (prettyErrors.length > 0) {
          throw new MultiLineError('Validation', prettyErrors);
        }
      }

      done();
    });
  });

  /* BEST PRACTICES & INDENTATION ++++++++++++++++++++++++++++++++ */

  it('follows best practices & indentation rules', function () {
    return linter.lint({files: 'css/main.css'}).then(function (data) {
        var prettyErrors = [];

        if (data.results) {
          data.results[0].warnings.forEach(function (item) {
            prettyErrors.push(util.format('Line %d: %s', item.line, item.text));
          });

          if (prettyErrors.length > 0) {
            throw new MultiLineError('Best Practices', prettyErrors);
          }
        }
      });
  });

});

