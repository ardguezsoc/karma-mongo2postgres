const mockDb = mongoAPI => ({
  cleanDb: async () => {
    const collections = await mongoAPI.listCollections().toArray();
    // eslint-disable-next-line no-restricted-syntax
    for (const collection of collections) {
      // eslint-disable-next-line no-await-in-loop
      await mongoAPI.collection(collection.name).deleteMany({});
      // eslint-disable-next-line no-await-in-loop
      await mongoAPI.collection(collection.name).dropIndexes({});
    }
  },
  insertDb: async () => {
    await mongoAPI.collection('history').insertOne(
      { command: 'increase' },
    );
  },
});

module.exports = { mockDb };
