const expressSwaggerGenerator = require('express-swagger-generator');

module.exports = () => {
  const start = async ({
    manifest = {}, app, config, controller,
  }) => {
    const { swaggerOptions } = config;
    const expressSwagger = expressSwaggerGenerator(app);
    const options = {
      swaggerDefinition: {
        ...swaggerOptions.swaggerDefinition,
      },
      basedir: __dirname,
      files: ['./**/**-routes.js'],
    };
    expressSwagger(options);

    /**
     * This endpoint serves the manifest
     * @route GET /__/manifest
     * @group Admin - Everything about admin routes
     * @returns 200 - Sucessful response
    */
    app.get('/__/manifest', (req, res) => res.json(manifest));

    /**
     * This endpoint imports new data from the bot MongoDB to the stats PostgreSQL DB
     * @route GET /var/run
     * @group Admin - Everything about admin routes
     * @returns 200 - Sucessful response
    */
    app.get('/v1/run', async (request, response) => {
      await controller.run();
      response.status(200).send();
    });

    return Promise.resolve();
  };

  return { start };
};
