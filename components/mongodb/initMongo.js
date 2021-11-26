const { MongoClient } = require('mongodb');

module.exports = () => {
  const start = async ({ config, logger }) => {
    const { connectionString } = config;
    try {
      logger.info(`Connecting to ${!connectionString ? 'undefined' : connectionString.split('@')[1]}`);
      return await MongoClient.connect(
        connectionString,
        { useUnifiedTopology: true },
      );
    } catch (err) {
      logger.error(err);
      throw err;
    }
  };

  return { start };
};
