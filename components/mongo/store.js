const debug = require('debug')('store:mongo');

module.exports = () => {
  let mongo;
  const start = async ({ mongodb }) => {
    mongo = mongodb;
    return {
      mongo,
    };
  };

  const stop = async () => {
    debug('Closing CosmoDB/MongoDB connection...');
    await mongo.close();
  };

  return { start, stop };
};
