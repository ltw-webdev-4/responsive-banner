var util = require('util');

function MultiLineError(name, message) {
  Error.call(this);

  this.name = name;
  this.message = message.join('\n     ');
}

util.inherits(MultiLineError, Error);

module.exports = {
  MultiLineError: MultiLineError
};
