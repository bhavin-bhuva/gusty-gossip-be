const security = [
  {
    bearerAuth: [],
  },
];

const plansList = {
  tags: ['Plans'],
  summary: 'Plans List',
  description: 'Plans List',
  operationId: 'plansList',
  responses: {
    '200': {
      description: 'Returns list of Plans',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
const getPlanSubscribe = {
  tags: ['Plans'],
  description: 'Subscribe Plan',
  operationId: 'getPlanSubscribe',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      in: 'query',
      name: 'plan',
      required: true,
      schema: {
        type: 'string',
        example: 'pro',
      },
    },
    {
      in: 'query',
      name: 'opt',
      required: true,
      schema: {
        type: 'string',
        example: 'monthly',
      },
    },
  ],
  responses: {
    '200': {
      description: 'Returns stripe subscription checkout url',
    },
    '400': {
      description: 'Already subscribed to a plan',
    },
    '404': {
      description: 'Plan not found.',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
const getPlanUnsubscribe = {
  tags: ['Plans'],
  description: 'Subscribe Plan',
  operationId: 'getPlanSubscribe',
  security: [
    {
      bearerAuth: [],
    },
  ],
  responses: {
    '200': {
      description: 'Returns OK or unsubscribed successfully',
    },
    '400': {
      description: 'Not subscribed or no active plan',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
const getIconPurchase = {
  tags: ['Plans'],
  description: 'Purchases Icons',
  operationId: 'getPlanSubscribe',
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
        example: '639c69415f688622f78a285a',
      },
    },
  ],
  responses: {
    '200': {
      description: 'Returns stripe purchase checkout url',
    },
    '400': {
      description: 'Already purchased',
    },
    '404': {
      description: 'User , Product or Plan not found.',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const getCreateProductStripe = {
  tags: ['Plans'],
  description: 'Create Stripe Product',
  operationId: 'getCreateProductStripe',
  security: [
    {
      bearerAuth: [],
    },
  ],
  requestBody: {
    content: {
      'application/x-www-form-urlencoded': {
        schema: {
          type: 'object',
          properties: {
            name: {
              required: true,
              schema: {
                type: 'string',
                minimum: 1,
                example: 'PRO - MONTHLY',
              },
            },
            price: {
              required: true,
              schema: {
                type: 'number',
                minimum: 1,
                example: 199,
              },
            },
            currency: {
              required: true,
              schema: {
                type: 'string',
                minimum: 1,
                example: 'inr',
              },
            },
            recurring: {
              required: true,
              schema: {
                type: 'boolean',
                enum: [false, true],
                example: true,
              },
            },
            interval: {
              required: false,
              schema: {
                type: 'string',
                minimum: 1,
                enum: ['day', 'week', 'month', 'year'],
                example: 'month',
              },
            },
            planName: {
              required: true,
              schema: {
                type: 'string',
                minimum: 1,
                example: 'pro',
              },
            },
            priceName: {
              required: true,
              schema: {
                type: 'string',
                minimum: 1,
                example: 'pro_monthly',
              },
            },
          },
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'Returns Ok',
    },
    '404': {
      description: 'Plan not found',
    },
    '401': {
      description: 'Not authorised',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
export { plansList, security, getPlanSubscribe, getPlanUnsubscribe, getIconPurchase, getCreateProductStripe };
