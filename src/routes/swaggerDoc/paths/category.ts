const categoryList = {
  tags: ['Categories'],
  summary: 'Category List',
  description: 'Category List',
  operationId: 'CategoriesList',
  parameters: [
    {
      in: 'query',
      name: 'category',
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
      description: 'Returns list of Categories',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
export { categoryList };
