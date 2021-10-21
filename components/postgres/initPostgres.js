const initHandyPg = require('handy-postgres');

module.exports = ({ configPath }) => {
  let handyPg;
  const start = async ({ config, logger }) => {
    handyPg = initHandyPg({ logger, configPath });
    const api = await handyPg.start(config);
    return api;
  };
  const stop = () => handyPg.stop();
  return { start, stop };
};
