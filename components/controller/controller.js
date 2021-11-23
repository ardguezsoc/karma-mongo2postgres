const debug = require('debug')('karma-mongo2postgres:controller');

module.exports = () => {
  const start = async ({
    logger, config, store, pg,
  }) => {
    debug('Initializing controller dependencies...');
    const { databaseName } = config;
    const { mongo } = store;
    const database = mongo.db(databaseName);

    const collections = {
      organization: {
        insertQueryName: 'insert-organization',
        mapping: doc => ({
          slackId: doc._id.id,
          name: doc._id.name,
        }),
        getArray: item => [
          item.slackId,
          item.name,
        ],
      },
      karma: {
        insertQueryName: 'insert-user',
        mapping: doc => ({
          slackId: doc.slack,
          organization: doc._id.orgId,
          email: doc._id.email,
        }),
        getArray: item => [
          item.slackId,
          item.organization,
          item.email,
        ],
      },
      users: {
        insertQueryName: 'insert-info-user',
        mapping: doc => ({
          slackId: doc.user.id,
          organization: doc.organization.id,
          name: doc.payload.name,
          firstName: doc.payload.first_name,
          lastName: doc.payload.last_name,
          realName: doc.payload.real_name,
          realNameNormalized: doc.payload.real_name_normalized,
          displayName: doc.payload.display_name,
          displayNameNormalized: doc.payload.display_name_normalized,
          image: doc.payload.image_original,
          color: doc.payload.color,
        }),
        getArray: item => [
          item.slackId,
          item.organization,
          item.name,
          item.firstName,
          item.lastName,
          item.realName,
          item.realNameNormalized,
          item.displayName,
          item.displayNameNormalized,
          item.image,
          item.color,
        ],
      },
      history: {
        insertQueryName: 'insert-history',
        mapping: doc => ['increase', 'decrease'].includes(doc.command) && doc.output.success && ({
          slackId: doc._id,
          command: doc.command,
          timestamp: doc.timestamp,
          organizationSlackId: doc.input.organization.id,
          organizationName: doc.input.organization.name,
          fromUser: doc.input.payload.from.id,
          toUser: doc.input.payload.to.id,
          amount: doc.input.payload.amount,
          value: doc.command === 'increase'
            ? doc.input.payload.amount
            : doc.command === 'decrease'
              ? doc.input.payload.amount * (-1)
              : 0,
        }),
        getArray: item => [
          item.command,
          item.slackId,
          item.timestamp,
          item.organizationSlackId,
          item.organizationName,
          item.fromUser,
          item.toUser,
          item.amount,
          item.value,
        ],
      },
    };

    const runCollection = collectionName => async (query = {}, options = {}) => {
      const collection = await database.collection(collectionName);
      // const query = { timestamp: { $gt: new Date('2021-06-01') } };
      // const options = { limit: 1};
      const documents = await collection.find(query, options);
      const count = await documents.count();
      if (count === 0) {
        logger.warn(`No documents found for collection ${collectionName}!`);
      }
      logger.info(`There are ${count} ${collectionName} documents`);

      await Promise.all(documents.map(async documentDAO => {
        const { mapping, getArray, insertQueryName } = collections[collectionName];
        const documentBO = mapping(documentDAO);
        if (documentBO) {
          await pg.query(insertQueryName, getArray(documentBO));
        } else {
          throw new Error(`Unknow "mapping" property for document: ${JSON.stringify(documentDAO, null, 4)}`);
        }
      }));
    };

    const run = async () => {
      try {
        await runCollection('organization')();
        await runCollection('karma')();
        await runCollection('users')();
        await runCollection('history')({ timestamp: { $gt: new Date('2021-09-01') } });
      } catch (error) {
        logger.error(error);
        process.exit(-1); // "echo $?" for debuging exit codes
      }
    };

    return {
      run,
    };
  };

  return { start };
};
