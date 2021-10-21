require('dotenv').config();

const System = require('systemic');
const { join } = require('path');

module.exports = () => new System({ name: 'karma-mongo2postgres' })
  .bootstrap(join(__dirname, 'components'));
