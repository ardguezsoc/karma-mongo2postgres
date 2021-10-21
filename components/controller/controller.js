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

    const runCollection = collectionName => async (query = {}) => {
      let item;
      let doc;
      try {
        const collection = await database.collection(collectionName);
        // const query = { timestamp: { $gt: new Date('2021-06-01') } };
        // const query = { };
        const options = { };
        // const options = { limit: 1};

        const cursor = collection.find(query, options);

        const size = await cursor.count();
        if (size === 0) {
          logger.warn(`No documents found for collection ${collectionName}!`);
        }
        logger.info(`There are ${size} ${collectionName} documents`);

        let counter = 0;

        // eslint-disable-next-line no-restricted-syntax
        for await (const document of cursor) {
          // logger.info('-----------------------------------------------');
          // logger.info(JSON.stringify(document, null, 2));
          doc = document;

          const { mapping, getArray, insertQueryName } = collections[collectionName];
          item = mapping(document);
          if (item) {
            await pg.query(insertQueryName, getArray(item));
          }
          counter += 1;
          if (counter % 100 === 0) {
            logger.info(`${counter} ${collectionName} documents inserted`);
          }
        }
        logger.info(`FINISH: ${counter} ${collectionName} documents inserted`);
      } catch (err) {
        logger.error(err);
        logger.info(JSON.stringify(item, null, 4));
        logger.info(JSON.stringify(doc, null, 4));
      }
    };

    const run = async () => {
      await runCollection('organization')();
      await runCollection('karma')();
      await runCollection('users')();
      await runCollection('history')({ timestamp: { $gt: new Date('2021-09-01') } });
    };

    return {
      run,
    };
  };

  return { start };
};
