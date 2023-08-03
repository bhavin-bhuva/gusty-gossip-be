const security = [
  {
    bearerAuth: [],
  },
];

const register = {
  tags: ['Users'],
  description: 'Create User Account',
  operationId: 'registerUser',
  requestBody: {
    content: {
      'application/x-www-form-urlencoded': {
        schema: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              example: 'John',
            },
            lastName: {
              type: 'string',
              example: 'Dou',
            },
            email: {
              type: 'string',
              example: 'john@gmail.com',
            },
            password: {
              type: 'string',
              example: 'sample',
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'Registered',
    },
    '409': {
      description: 'User already exists',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
const loginUser = {
  tags: ['Users'],
  description: 'Login user in the system',
  operationId: 'loginUser',
  requestBody: {
    content: {
      'application/x-www-form-urlencoded': {
        schema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              example: 'john@gmail.com',
            },
            password: {
              type: 'string',
              example: 'sample',
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    '201': {
      description: 'User login successfully!',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              _id: {
                type: 'string',
                example: '6374e19dac314421985f43f5',
              },
              firstName: {
                type: 'string',
                example: 'John',
              },
              lastName: {
                type: 'string',
                example: 'Dou',
              },
              email: {
                type: 'string',
                example: 'john@gmail.com',
              },
              photo: {
                type: 'string',
                example: 'no_image.png',
              },
              role: {
                type: 'string',
                example: 'user',
              },
              token: {
                type: 'string',
                example:
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdF9uYW1lIjoiQmh1dmEiLCJsYXN0X25hbWUiOiJCaGF2aW4iLCJmdWxsX25hbWUiOiJCaHV2YSBCaGF2aW4iLCJlbWFpbCI6ImJoYXZpbi5iMkBnbWFpbC5jb20iLCJyb2xlX25hbWUiOiJ1c2VyIiwiaWF0IjoxNjY1NzQxNjE5LCJleHAiOjE2NjU4MjgwMTl9.CCi2PeTODj4hEDavdwbpC5WHxbe9NLRE79n9aQrciKw',
              },
            },
          },
        },
      },
    },
  },
};

const changePassword = {
  tags: ['Users'],
  description: 'Change password',
  operationId: 'changePassword',
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
            oldPassword: {
              type: 'string',
              example: 'sample',
            },
            password: {
              type: 'string',
              example: 'sample',
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'Password changed',
    },
    '404': {
      description: 'User not found',
    },
    '401': {
      description: 'Password not matched',
    },
    '422': {
      description: 'Same as old',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const getUpdateUser = {
  tags: ['Users'],
  description: 'Update User Profile',
  operationId: 'updateUser',
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
            firstName: {
              type: 'string',
              example: 'John',
            },
            lastName: {
              type: 'string',
              example: 'Dou',
            },
            title: {
              type: 'string',
              example: 'mr',
            },
            zipCode: {
              type: 'string',
              example: '000000',
            },
            city: {
              type: 'string',
              example: 'delhi',
            },
            state: {
              type: 'string',
              example: 'uttar pradesh',
            },
            country: {
              type: 'string',
              example: 'india',
            },
            renewAccount: {
              type: 'boolean',
              example: false,
            },
            newCollection: {
              type: 'boolean',
              example: false,
            },
          },
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'Response contains updated information of user',
    },
    '404': {
      description: 'User not found',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
const getVerifyEmail = {
  tags: ['Users'],
  description: 'User Email Verification',
  operationId: 'getVerifyEmail',
  requestBody: {
    content: {
      'application/x-www-form-urlencoded': {
        schema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              example: 'john@gmail.com',
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'User Email Verification send successfully!',
    },
    '400': {
      description: 'User email must be valid formate',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const socialAuth = {
  tags: ['Users'],
  description: 'Login with google',
  operationId: 'googleAuth',
  requestBody: {
    content: {
      'application/x-www-form-urlencoded': {
        schema: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              example: 'Anjali',
            },
            lastName: {
              type: 'string',
              example: 'Srivastava',
            },
            photo: {
              type: 'string',
              example: 'no_image.png',
            },
            email: {
              type: 'string',
              example: 'as@gmail.com',
            },
            type: {
              type: 'string',
              example: 'CUSTOM',
            },
          },
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'User log in Successfully',
    },

    '500': {
      description: 'Internal server error',
    },
  },
};
const downloadHistory = {
  tags: ['Users'],
  description: 'User download history',
  operationId: 'downloadHistory',
  security: [
    {
      bearerAuth: [],
    },
  ],
  responses: {
    '200': {
      description: 'User history found successfully',
    },
    '404': {
      description: 'User email not found',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
const listUsers = {
  tags: ['Users'],
  description: 'Fetch all users from the database',
  operationId: 'listUsers',
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
        example: 'john',
      },
      description: 'search',
    },
    {
      in: 'query',
      name: 'page',
      required: true,
      schema: {
        type: 'number',
        minimum: 1,
        example: '1',
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
        example: '10',
      },
      description: 'limit',
    },
    {
      in: 'query',
      name: 'order',
      required: true,
      schema: {
        type: 'string',
        minimum: 1,
        enum: ['desc', 'asc'],
        example: 'desc',
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
        example: 'fullName',
      },
      description: 'orderBy',
    },
    {
      in: 'query',
      name: 'isArchived',
      required: true,
      schema: {
        type: 'boolean',
        minimum: 1,
        enum: [false, true],
      },
      description: 'isArchived',
    },
  ],
  responses: {
    '201': {
      description: 'List of all users',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              fullName: {
                type: 'string',
                example: 'Admin Stroke',
              },
              email: {
                type: 'string',
                example: 'a.st@gmail.com',
              },
              country: {
                type: 'string',
                example: 'sample',
              },
              state: {
                type: 'string',
                example: 'Gujrat',
              },
              city: {
                type: 'string',
                example: 'Ahemdabad',
              },
              last_activity: {
                type: 'string',
                example: '2022-10-13T10:37:35.764Z',
              },
            },
          },
        },
      },
    },
  },
};

const getSetupAcctProfile = {
  tags: ['Users'],
  description: 'Set User Account Profile',
  operationId: 'getSetupAcctProfile',
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
            firstName: {
              type: 'string',
              example: 'John',
            },
            lastName: {
              type: 'string',
              example: 'Dou',
            },
            assets: {
              type: 'file',
              example: 'profile.png',
            },
            title: {
              type: 'string',
              example: 'Project Manager',
            },
          },
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'OK or Account setup successfully',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
const getSetPassword = {
  tags: ['Users'],
  description: 'Password Set',
  operationId: 'getSetPassword',
  requestBody: {
    content: {
      'application/x-www-form-urlencoded': {
        schema: {
          type: 'object',
          properties: {
            hash: {
              type: 'string',
              example: 'd638d4e43708998526e20279',
            },
            password: {
              type: 'string',
              example: 'sample',
            },
            type: {
              type: 'string',
              enum: ['CREATE_NEW_ACCT', 'RESET_PASSWORD', 'INVITE_EMAIL'],
              example: 'CREATE_NEW_ACCT',
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'Password set',
    },
    '404': {
      description: 'Hash not found',
    },
    '410': {
      description: 'Hash expired',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
const getEmailByHash = {
  tags: ['Users'],
  description: 'Get Email By Hash Code',
  operationId: 'getEmailByHash',
  parameters: [
    {
      in: 'path',
      name: 'hash',
      required: true,
      schema: {
        type: 'string',
        example: 'd638d4e43708998526e20279',
      },
      description: 'Hash Code',
    },
  ],
  responses: {
    '200': {
      description: 'Returns Email',
    },
    '404': {
      description: 'Hash not found',
    },
    '410': {
      description: 'Hash expired',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
const getForgotPassword = {
  tags: ['Users'],
  description: 'User Forgot Password',
  operationId: 'getForgotPassword',
  requestBody: {
    content: {
      'application/x-www-form-urlencoded': {
        schema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              example: 'john@gmail.com',
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'RESET PASSWORD link send successfully!',
    },
    '400': {
      description: 'User email must be valid formate',
    },
    '404': {
      description: 'User not found',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
const getCountriesList = {
  tags: ['Users'],
  description: 'Get Countries List',
  operationId: 'getCountriesList',
  parameters: [
    {
      in: 'query',
      name: 'search',
      required: false,
      schema: {
        type: 'string',
        example: 'India',
      },
      description: 'Search by country name',
    },
    {
      in: 'query',
      name: 'limit',
      required: false,
      schema: {
        type: 'number',
        example: '9',
      },
    },
    {
      in: 'query',
      name: 'page',
      required: false,
      schema: {
        type: 'number',
        example: '2',
      },
    },
  ],
  responses: {
    '200': {
      description: 'Returns List of Countries or Empty Array',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const getStatesList = {
  tags: ['Users'],
  description: 'Get States List by countryId',
  operationId: 'getStatesList',
  parameters: [
    {
      in: 'query',
      name: 'id',
      required: true,
      schema: {
        type: 'string',
        example: '639955e761fb36ffac658db9',
      },
      description: 'id as countryId',
    },
    {
      in: 'query',
      name: 'search',
      required: false,
      schema: {
        type: 'string',
        example: 'Gujarat',
      },
      description: 'Search by state name',
    },
    {
      in: 'query',
      name: 'limit',
      required: false,
      schema: {
        type: 'number',
        example: '9',
      },
    },
    {
      in: 'query',
      name: 'page',
      required: false,
      schema: {
        type: 'number',
        example: '2',
      },
    },
  ],
  responses: {
    '200': {
      description: 'Returns List of States or Empty Array',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
const getCitiesList = {
  tags: ['Users'],
  description: 'Get Cities List by stateId',
  operationId: 'getCitiesList',
  parameters: [
    {
      in: 'query',
      name: 'id',
      required: true,
      schema: {
        type: 'string',
        example: '639955e761fb36ffac658db5',
      },
      description: 'id as stateId',
    },
    {
      in: 'query',
      name: 'search',
      required: false,
      schema: {
        type: 'string',
        example: 'Ahmedabad',
      },
      description: 'Search by city name',
    },
    {
      in: 'query',
      name: 'limit',
      required: false,
      schema: {
        type: 'number',
        example: '9',
      },
    },
    {
      in: 'query',
      name: 'page',
      required: false,
      schema: {
        type: 'number',
        example: '2',
      },
    },
  ],
  responses: {
    '200': {
      description: 'Returns List of Cities or Empty Array',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
const getLoggedUser = {
  tags: ['Users'],
  description: 'Get Logged-In user',
  operationId: 'getLoggedUser',
  security: [
    {
      bearerAuth: [],
    },
  ],
  responses: {
    '200': {
      description: 'Response logged-in user id',
    },
    '401': {
      description: 'Not authorized',
    },
    '404': {
      description: 'User not found',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
const getBillingAddrsUser = {
  tags: ['Users'],
  description: 'Create and Update Billing Address User',
  operationId: 'getBillingAddrsUser',
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
              type: 'string',
              example: 'John Dou',
            },
            line1: {
              type: 'string',
              example: 'taj street',
            },
            line2: {
              type: 'string',
              example: 'near taj mahal',
            },
            zipCode: {
              type: 'string',
              example: '000000',
            },
            city: {
              type: 'string',
              example: 'delhi',
            },
            state: {
              type: 'string',
              example: 'uttar pradesh',
            },
            country: {
              type: 'string',
              example: 'india',
            },
            isDefault: {
              type: 'boolean',
              default: false,
            },
          },
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'Response contains billing address information of user',
    },
    '404': {
      description: 'User not found',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
const getLoggedUserAddrs = {
  tags: ['Users'],
  description: 'Get Logged-In user biiling address',
  operationId: 'getLoggedUserAddrs',
  security: [
    {
      bearerAuth: [],
    },
  ],
  responses: {
    '200': {
      description: 'Response logged-in user billing address',
    },
    '401': {
      description: 'Not authorized',
    },
    '404': {
      description: 'User biiling address not found',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const getUpdateEmailLink = {
  tags: ['Users'],
  description: 'User Email Update Link',
  operationId: 'updateEmail',
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
            newEmail: {
              type: 'string',
              example: 'john@gmail.com',
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'Update email link send successfully!',
    },
    '400': {
      description: 'User email must be valid formate',
    },
    '404': {
      description: 'User not found',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const getUpdateEmail = {
  tags: ['Users'],
  description: 'User Email Update Link',
  operationId: 'updateEmail',
  requestBody: {
    content: {
      'application/x-www-form-urlencoded': {
        schema: {
          type: 'object',
          properties: {
            hash: {
              type: 'string',
              example: 'd638d4e43708998526e20279',
            },
            type: {
              type: 'string',
              example: 'UPDATE_EMAIL',
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'Updated email successfully!',
    },
    '400': {
      description: 'Hash must be valid formate',
    },
    '404': {
      description: 'Hash not found',
    },
    '410': {
      description: 'Hash expired',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
const getInviteEmail = {
  tags: ['Users'],
  description: 'User Email Invatation by admin',
  operationId: 'getInviteEmail',
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
            email: {
              type: 'string',
              example: 'john@gmail.com',
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'User Email Verification send successfully!',
    },
    '400': {
      description: 'User email must be valid formate',
    },
    '401': {
      description: 'You are not authorized',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
const getArchiveUser = {
  tags: ['Users'],
  description: 'Archive user by admin',
  operationId: 'getArchiveUser',
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
        example: '63bfbcb68da67f4c57cc3b29',
      },
      description: 'User ID',
    },
  ],
  responses: {
    '200': {
      description: 'Returns OK',
    },
    '404': {
      description: 'user not found',
    },
    '401': {
      description: 'You are not authorized',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
const getListInvoices = {
  tags: ['Users'],
  description: 'Fetch all users from the database',
  operationId: 'listUsers',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      in: 'query',
      name: 'page',
      required: true,
      schema: {
        type: 'number',
        minimum: 1,
        example: '1',
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
        example: '10',
      },
      description: 'limit',
    },
    {
      in: 'query',
      name: 'order',
      required: true,
      schema: {
        type: 'string',
        minimum: 1,
        enum: ['desc', 'asc'],
        example: 'desc',
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
        example: 'description',
      },
      description: 'orderBy',
    },
  ],
  responses: {
    '200': {
      description: 'Returns invoices list',
    },
    '404': {
      description: 'user not found',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const reportList = {
  tags: ['Users'],
  description: 'Fetch all reports of users from the database',
  operationId: 'reportList',
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
        example: 'home',
      },
      description: 'page',
    },
    {
      in: 'query',
      name: 'page',
      required: true,
      schema: {
        type: 'number',
        minimum: 1,
        example: '1',
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
        example: '10',
      },
      description: 'limit',
    },
    {
      in: 'query',
      name: 'order',
      required: true,
      schema: {
        type: 'string',
        minimum: 1,
        enum: ['desc', 'asc'],
        example: 'desc',
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
        example: 'description',
      },
      description: 'orderBy',
    },
  ],
  responses: {
    '200': {
      description: 'Returns report list',
    },
    '404': {
      description: 'reports not found',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const userReport = {
  tags: ['Users'],
  description: 'Fetch all reports of  a user from the database',
  operationId: 'reportList',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      in: 'query',
      name: 'page',
      required: true,
      schema: {
        type: 'number',
        minimum: 1,
        example: '1',
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
        example: '10',
      },
      description: 'limit',
    },
    {
      in: 'query',
      name: 'order',
      required: true,
      schema: {
        type: 'string',
        minimum: 1,
        enum: ['desc', 'asc'],
        example: 'desc',
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
    {
      in: 'path',
      name: 'id',
      required: true,
      schema: {
        type: 'string',
        example: '63b40f0a5307b54847f689d5',
      },
      description: 'userId',
    },
  ],
  responses: {
    '200': {
      description: 'Returns reports',
    },
    '404': {
      description: 'reports not found',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
const getUnArchiveUser = {
  tags: ['Users'],
  description: 'Unarchive user by admin',
  operationId: 'getUnArchiveUser',
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
        example: '63bfbcb68da67f4c57cc3b29',
      },
      description: 'User ID',
    },
  ],
  responses: {
    '200': {
      description: 'Returns OK',
    },
    '404': {
      description: 'user not found',
    },
    '401': {
      description: 'You are not authorized',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
const contactUs = {
  tags: ['Users'],
  summary: 'contactUs ( help )',
  description: 'contactUs ( help )',
  operationId: 'contactUs',
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
            email: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            message: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'Contact Us mail send successfully',
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

export {
  register,
  loginUser,
  changePassword,
  getUpdateUser,
  security,
  getVerifyEmail,
  socialAuth,
  downloadHistory,
  getSetPassword,
  listUsers,
  getSetupAcctProfile,
  getEmailByHash,
  getForgotPassword,
  getCountriesList,
  getStatesList,
  getCitiesList,
  getLoggedUser,
  getBillingAddrsUser,
  getLoggedUserAddrs,
  getUpdateEmailLink,
  getUpdateEmail,
  getInviteEmail,
  getArchiveUser,
  getListInvoices,
  reportList,
  userReport,
  getUnArchiveUser,
  contactUs,
};
