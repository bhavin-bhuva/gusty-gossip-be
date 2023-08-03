const searchProducts = {
  tags: ['Products'],
  description: 'Search product icon by category ,type and tags',
  operationId: 'searchProducts',
  parameters: [
    {
      in: 'query',
      name: 'word',
      required: true,
      schema: {
        type: 'string',
        minimum: 1,
        example: 'p',
      },
      description: 'search',
    },
    {
      in: 'query',
      name: 'category',
      required: false,
      schema: {
        type: 'string',
        minimum: 1,
        example: 'stroke',
      },
      description: 'category',
    },
    {
      in: 'query',
      name: 'type',
      required: false,
      schema: {
        type: 'string',
        minimum: 1,
        example: 'os',
      },
      description: 'type',
    },
    {
      in: 'query',
      name: 'page',
      required: false,
      schema: {
        type: 'number',
        minimum: 1,
        example: 1,
      },
      description: 'page',
    },
    {
      in: 'query',
      name: 'limit',
      required: false,
      schema: {
        type: 'number',
        minimum: 1,
        example: 10,
      },
      description: 'limit',
    },
  ],
  responses: {
    '200': {
      description: 'Sucessfully found products or no matching product is there',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
const ulistProducts = {
  tags: ['Products'],
  description: 'Fetch all products from the database',
  operationId: 'ulistProducts',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      in: 'query',
      name: 'search',
      required: false,
      schema: {
        type: 'string',
        minimum: 1,
        example: 'sample',
      },
      description: 'search',
    },
    {
      in: 'query',
      name: 'isArchived',
      required: true,
      schema: {
        type: 'boolean',
        enums: [true, false],
        example: true,
      },
      description: 'isArchived',
    },
    {
      in: 'query',
      name: 'page',
      required: true,
      schema: {
        type: 'number',
        minimum: 1,
        example: 1,
      },
      description: 'page',
    },
    {
      in: 'query',
      name: 'limit',
      required: true,
      schema: {
        type: 'number',
        minimum: 1,
        example: 1,
      },
      description: 'limit',
    },
    {
      in: 'query',
      name: 'order',
      required: true,
      schema: {
        type: 'string',
        enums: ['asc', 'desc'],
        example: 'asc',
      },
      description: 'order',
    },
    {
      in: 'query',
      name: 'orderBy',
      required: true,
      schema: {
        type: 'string',
        minimum: 1,
        example: 'name',
      },
      description: 'orderBy',
    },
  ],
  responses: {
    '201': {
      description: 'List of all products',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              _id: {
                type: 'string',
                example: '637f17ad8dc4694fb1ff3890',
              },
              productId: {
                type: 'string',
                example: '637f17ad8dc4694fb1ff3890',
              },
              previewUrl: {
                type: 'string',
                example:
                  'https://open-stroke-assets.nyc3.digitaloceanspaces.com/png/Add-Camera-Stroke-1670302764783.png',
              },
              variantType: {
                type: 'string',
                example: 'curve',
              },
              category: {
                type: 'string',
                example: 'Stroke',
              },
              isArchived: {
                type: 'boolean',
                example: 'false',
              },
              tags: {
                type: 'string',
                example: 'house',
              },
              productDetails: {
                type: 'object',
                example: {
                  label: 'home',
                  tags: 'photography',
                  isFree: 'false',
                },
              },
            },
          },
        },
      },
    },
    '404': {
      description: 'Products not found',
    },
    '401': {
      description: 'Invalid query',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const getCreateProduct = {
  tags: ['Products'],
  description: 'Create Product and its Variants',
  operationId: 'getCreateProduct',
  security: [
    {
      bearerAuth: [],
    },
  ],
  requestBody: {
    content: {
      'multipart/form-data': {
        schema: {
          type: 'object',
          properties: {
            assets: {
              type: 'array',
              items: {
                type: 'file',
                format: 'file',
              },
            },
            document: {
              type: 'JSON Stringify',
              example: '',
            },
          },
        },
      },
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            demo_json: {
              type: 'json',
              example: {
                name: 'Camera',
                label: 'CAMERA',
                category: 'communication,general,photo',
                mainTags: 'camera,smile,communication,help,hangout,care',
                variantType: 'curve',
                isFree: false,
                variantsTags: ['curve,stroke'],
              },
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'Returns OK as successfully submitted',
    },
    '400': {
      description: 'Bad request',
    },
    '401': {
      description: 'You are unauthorized',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
export { searchProducts, ulistProducts, getCreateProduct };
