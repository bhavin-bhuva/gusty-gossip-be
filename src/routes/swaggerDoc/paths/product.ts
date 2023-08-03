const security = [
  {
    bearerAuth: [],
  },
];
const suggestionSearch = {
  tags: ['Products'],
  description: 'Search product by category and tags',
  operationId: 'searchProduct',
  parameters: [
    {
      in: 'query',
      name: 'word',
      required: false,
      schema: {
        type: 'string',
        minimum: 1,
        example: 'home',
      },
      description: 'search',
    },
  ],
  responses: {
    '200': {
      description: 'Display suggestions of icons names or returns empty array',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const SearchRelativePro = {
  tags: ['Products'],
  description: 'Search product by Id',
  operationId: 'SearchRelativePro',
  parameters: [
    {
      in: 'query',
      name: 'id',
      required: false,
      schema: {
        type: 'string',
        example: '6425662e101ed5d226e923c2',
      },
      description: 'search',
    },
    {
      in: 'query',
      name: 'rmId',
      required: false,
      schema: {
        type: 'string',
        example: '6425662e101ed5d226e923c2',
      },
      description: 'search',
    },
    {
      in: 'query',
      name: 'page',
      required: false,
      schema: {
        type: 'number',
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
        example: 10,
      },
      description: 'limit',
    },
  ],
  responses: {
    '200': {
      description: 'Display all relative products of icons names or returns empty array',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
const productDownload = {
  tags: ['Products'],
  description: 'Downloading products',
  operationId: 'productDownload',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      in: 'path',
      name: 'id',
      required: true,
      schema: {
        type: 'string',
        example: '638ecc411acb237220940c31',
      },
      description: 'productId',
    },
    {
      in: 'query',
      name: 'type',
      required: true,
      schema: {
        type: 'string',
        example: 'svg',
      },
    },
    {
      in: 'query',
      name: 'size',
      required: false,
      schema: {
        type: 'string',
        example: '512',
      },
    },
    {
      in: 'query',
      name: 'fill',
      required: false,
      schema: {
        type: 'string',
        example: 'blue',
      },
    },
    {
      in: 'query',
      name: 'bgColor',
      required: false,
      schema: {
        type: 'string',
        example: 'black',
      },
    },
    {
      in: 'query',
      name: 'strokeWidth',
      required: false,
      schema: {
        type: 'string',
        example: '5',
      },
    },
    {
      in: 'query',
      name: 'strokeColor',
      required: false,
      schema: {
        type: 'string',
        example: 'yellow',
      },
    },
  ],
  responses: {
    '200': {
      description: 'Product download link',
    },
    '403': {
      description: 'Not subscribed',
    },
    '410': {
      description: 'Subscription expired',
    },
    '400': {
      description: 'Downloading limit is reached',
    },
  },
};

const productEdit = {
  tags: ['Products'],
  description: 'customize product',
  operationId: 'productEdit',
  requestBody: {
    content: {
      'application/x-www-form-urlencoded': {
        schema: {
          type: 'object',
          properties: {
            id: {
              required: true,
              schema: {
                type: 'string',
                minimum: 1,
                example: '637f17ad8dc4694fb1ff3890',
              },
            },
            size: {
              required: false,
              schema: {
                type: 'number',
                minimum: 1,
                example: '512',
              },
            },
            fill: {
              required: false,
              schema: {
                type: 'string',
                minimum: 1,
                example: 'red',
              },
            },
            bgColor: {
              required: false,
              schema: {
                type: 'string',
                minimum: 1,
                example: 'black',
              },
            },
            strokeColor: {
              required: false,
              schema: {
                type: 'string',
                minimum: 1,
                example: 'yellow',
              },
            },
            strokeWidth: {
              required: false,
              schema: {
                type: 'number',
                minimum: 1,
                example: '2',
              },
            },
          },
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'Preview PNG Download',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const popularProducts = {
  tags: ['Products'],
  summary: 'Popular Products Listing',
  description: 'Popular Products List',
  operationId: 'popularProducts',
  responses: {
    '200': {
      description: 'Returns list of Popular Products or empty array',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
const downloadSvg = {
  tags: ['Products'],
  description: 'download SVG',
  operationId: 'downloadSvg',
  parameters: [
    {
      in: 'path',
      name: 'id',
      required: true,
      schema: {
        type: 'string',
        example: '638ecc411acb237220940c31',
      },
      description: 'productId',
    },
  ],
  responses: {
    '200': {
      description: 'SVG Download',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const downloadPng = {
  tags: ['Products'],
  description: 'download PNG',
  operationId: 'downloadPng',
  parameters: [
    {
      in: 'path',
      name: 'id',
      required: true,
      schema: {
        type: 'string',
        example: '638ecc411acb237220940c31',
      },
      description: 'productId',
    },
  ],
  responses: {
    '200': {
      description: 'PNG Download',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
const exmplDownload = {
  tags: ['Products'],
  description: 'Download Private File',
  operationId: 'exmplDownload',
  responses: {
    '200': {
      description: 'Returns downloadable file',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
export {
  suggestionSearch,
  security,
  productDownload,
  productEdit,
  popularProducts,
  SearchRelativePro,
  downloadSvg,
  downloadPng,
  exmplDownload,
};
