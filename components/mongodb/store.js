const debug = require('debug')('store:mongo');

module.exports = () => {
  let mongoClient;
  const start = async ({ config, mongo }) => {
    mongoClient = mongo;
    return {
      mongo: mongoClient.db(config.databaseName),
    };
  };

  const stop = async () => {
    debug('Closing CosmoDB/MongoDB connection...');
    await mongoClient.close();
  };

  return { start, stop };
};
