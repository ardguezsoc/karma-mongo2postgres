const supertest = require('supertest');
const system = require('../../system');

describe('Service Tests', () => {
  const constants = {};
  const sys = system();

  beforeAll(async () => {
    const { app } = await sys.start();
    constants.request = supertest(app);
  });

  afterAll(async () => sys.stop());

  describe('/v1/run', () => {
    describe('should fail', () => {
      it('should return NOT_FOUND (404) if the method is wrong', async () => {
        const { status } = await constants.request.post('/v1/run');
        expect(status).toBe(404);
      });
    });

    describe('should not fail', () => {
      it('should return OK (200) and import the data as expected', async () => {
        const { status } = await constants.request.get('/v1/run');
        expect(status).toBe(200);
      });
    });
  });
});
