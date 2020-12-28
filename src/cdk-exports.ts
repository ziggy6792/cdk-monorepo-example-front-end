const cdkExports = {
  aws_project_region: 'ap-southeast-1',
  aws_cognito_identity_pool_id: 'ap-southeast-1:67c9bf59-b151-4725-8524-ac86962e3f11',
  aws_cognito_region: 'ap-southeast-1',
  aws_user_pools_id: 'ap-southeast-1_5zmaTsBgU',
  aws_user_pools_web_client_id: '3cegk98tmu5kqtl2jhg1jlcl0',
  // aws_graphqlEndpoint_authUser: 'https://mnakrqgp7b.execute-api.ap-southeast-1.amazonaws.com/dev/auth-user/graphql',
  // aws_graphqlEndpoint_authRole: 'https://mnakrqgp7b.execute-api.ap-southeast-1.amazonaws.com/dev/auth-role/graphql',
  // aws_graphqlEndpoint_authNone: 'https://mnakrqgp7b.execute-api.ap-southeast-1.amazonaws.com/dev/auth-none/graphql',
  aws_graphqlEndpoint_authUser: 'http://localhost:3100/lambda-gq-resolver/graphql',
  aws_graphqlEndpoint_authRole: 'http://localhost:3100/lambda-gq-resolver/graphql',
  aws_graphqlEndpoint_authNone: 'http://localhost:3100/lambda-gq-resolver/graphql',
  // extra
  oauth: {
    domain: 'alpaca-dev.auth.ap-southeast-1.amazoncognito.com',
    scope: ['phone', 'email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
    redirectSignIn: 'http://localhost:3000/profile/',
    redirectSignOut: 'http://localhost:3000/profile/',
    responseType: 'code',
  },
};

const exports = {
  aws_project_region: 'ap-southeast-1',
  aws_cognito_identity_pool_id: 'ap-southeast-1:67c9bf59-b151-4725-8524-ac86962e3f11',
  aws_cognito_region: 'ap-southeast-1',
  aws_user_pools_id: 'ap-southeast-1_5zmaTsBgU',
  aws_user_pools_web_client_id: '3cegk98tmu5kqtl2jhg1jlcl0',
  aws_graphqlEndpoint_authUser: 'https://mnakrqgp7b.execute-api.ap-southeast-1.amazonaws.com/dev/auth-user/graphql',
  aws_graphqlEndpoint_authRole: 'https://mnakrqgp7b.execute-api.ap-southeast-1.amazonaws.com/dev/auth-role/graphql',
  aws_graphqlEndpoint_authNone: 'https://mnakrqgp7b.execute-api.ap-southeast-1.amazonaws.com/dev/auth-none/graphql',
};

export default cdkExports;
