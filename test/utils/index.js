const cleanDB = async mongoAPI => {
  const collections = await mongoAPI.listCollections().toArray();
  for (const collection of collections) {
    await mongoAPI.collection(collection.name).deleteMany({});
    await mongoAPI.collection(collection.name).dropIndexes({});
  }
};

module.exports = {
  cleanDB,
};
