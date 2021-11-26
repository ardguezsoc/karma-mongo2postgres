const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
} = require('http-status-codes');
const system = require('../../../system');
const { cleanDB } = require('../../utils');

describe('Import/Export data', () => {
  const constants = {};

  beforeAll(async () => {
    await cleanDB(mongoAPI);
  });
});
