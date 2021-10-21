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

    app.get('/v1/run', async (/* req, res */) => {
      await controller.run();
    });

    return Promise.resolve();
  };

  return { start };
};
