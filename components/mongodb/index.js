const Systemic = require('systemic');
const initPg = require('./initMongo');
const initStore = require('./store');

module.exports = new Systemic({ name: 'mongo' })
  .add('mongo', initPg({ configPath: 'connection' }))
  .dependsOn('config', 'logger')
  .add('store', initStore())
  .dependsOn('config', 'logger', 'mongo');
