const security = [
  {
    bearerAuth: [],
  },
];
const tagList = {
  tags: ['Tags'],
  summary: 'Tag List',
  description: 'Tga List',
  operationId: 'TagsList',

  parameters: [
    {
      in: 'query',
      name: 'tag',
      required: false,
      schema: {
        type: 'string',
        minimum: 1,
        example: 'stroke',
      },
      description: 'search',
    },
  ],
  responses: {
    '200': {
      description: 'Returns list of Tags',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
export { tagList, security };
