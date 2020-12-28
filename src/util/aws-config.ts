import _ from 'lodash';
import awsconfig from '../cdk-exports';

const modifiedAwsConfig = _.cloneDeep(awsconfig);

modifiedAwsConfig.aws_graphqlEndpoint_authNone = 'http://localhost:3100/lambda-gq-resolver/graphql';
modifiedAwsConfig.aws_graphqlEndpoint_authRole = 'http://localhost:3100/lambda-gq-resolver/graphql';
modifiedAwsConfig.aws_graphqlEndpoint_authUser = 'http://localhost:3100/lambda-gq-resolver/graphql';

modifiedAwsConfig.oauth.redirectSignIn = `${window.location.protocol}//${window.location.host}${awsconfig.oauth.redirectSignIn}`;
modifiedAwsConfig.oauth.redirectSignOut = `${window.location.protocol}//${window.location.host}${awsconfig.oauth.redirectSignIn}`;

export default modifiedAwsConfig;
