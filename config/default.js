module.exports = {
  server: {
    host: '0.0.0.0',
    port: 4000,
  },
  mongodb: {
    url: process.env.MONGODB_CONNECTIONSTRING,
    options: {
      poolSize: 5,
      useUnifiedTopology: true,
    },
    showConnectionString: true,
  },
  store: {
    databaseName: 'kaas-prod',
  },
  pg: {
    connection: {
      user: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT || 5432,
      max: 10,
      migrations: [{ directory: 'sql/migrations', filter: '\\.sql$' }],
      idleTimeoutMillis: 30000,
      sql: 'sql/queries',
      ssl: true,
    },
  },
  controller: {
    databaseName: 'kaas-prod',
  },
  routes: {
    admin: {
      swaggerOptions: {
        swaggerDefinition: {
          info: {
            description: 'Documentation for karma-mongo2postgres',
            title: 'karma-mongo2postgres',
            version: '1.0.0',
          },
          host: process.env.SERVICE_ENV || 'localhost:4000',
          basePath: '/v1',
          produces: ['application/json'],
          schemes: ['http'],
          securityDefinitions: {
            JWT: {
              type: 'apiKey',
              in: 'header',
              name: 'Authorization',
              description: '',
            },
          },
        },
      },
    },
  },
  logger: {
    transport: 'console',
    include: [
      'tracer',
      'timestamp',
      'level',
      'message',
      'error.message',
      'error.code',
      'error.stack',
      'request.url',
      'request.headers',
      'request.params',
      'request.method',
      'response.statusCode',
      'response.headers',
      'response.time',
      'process',
      'system',
      'package.name',
      'service',
    ],
    exclude: ['password', 'secret', 'token', 'request.headers.cookie', 'dependencies', 'devDependencies'],
  },
};
