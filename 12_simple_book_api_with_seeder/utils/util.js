const bcrypt = require('bcrypt');

const doHash = (value, saltRounds) => {
  return bcrypt.hash(value, saltRounds);
};

const doHashValidation = (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  doHash,
  doHashValidation,
};
