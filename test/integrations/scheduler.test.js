// Modules
const {
  OK,
  NOT_FOUND,
} = require('http-status-codes');
const supertest = require('supertest');
// LIBs
const system = require('../../system');
const { mockDb } = require('../utils/index');

describe('Run scheduler', () => {
  const constants = {};
  const sys = system();

  beforeAll(async () => {
    const { app, store } = await sys.start();
    constants.request = supertest(app);
    constants.mongoAPI = store.mongo;
    const mongoMock = mockDb(constants.mongoAPI);
    await mongoMock.cleanDb();
    await mongoMock.insertDb();
  });

  afterAll(async () => sys.stop());

  describe('import/export data', () => {
    it('should had imported the movck data', async () => {
      const collection = await constants.mongoAPI.collection('history');
      const documentsAmount = await collection.find().count();
      expect(documentsAmount).toBe(1);
    });
  });

  describe.skip('/v1/run', () => {
    describe('should fail', () => {
      it('should return NOT_FOUND (404) if the method is wrong', async () => {
        const { status } = await constants.request.post('/v1/run');
        expect(status).toBe(NOT_FOUND);
      });
    });

    describe('should not fail', () => {
      it('should return OK (200) and import the data as expected', async () => {
        const { status } = await constants.request.get('/v1/run');
        expect(status).toBe(OK);
      });
    });
  });
});
