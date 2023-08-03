import paths from './paths';
import tags from './tags';

const apiDocumentation = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'open-stroke api Documentation',
    description: 'open-stroke api Documentation in swagger',
    termsOfService: 'https://wayrabbit.com/',
    contact: {
      name: 'wayRabbit',
      email: 'hetal@wayrabbit.com',
      url: 'https://wayrabbit.com/',
    },
  },
  servers: [
    {
      url: 'http://localhost:8002/',
      description: 'Local Server',
    },
    {
      url: 'https://openstroke-api-hgsvh.ondigitalocean.app/',
      description: 'Production Server',
    },
  ],
  tags: tags,
  paths: paths,

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
export { apiDocumentation };
