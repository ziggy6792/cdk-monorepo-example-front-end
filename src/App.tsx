import React from 'react';

import { ApolloLink } from 'apollo-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import { createAuthLink } from 'aws-appsync-auth-link';
import ApolloClient from 'apollo-client';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';

import Auth from '@aws-amplify/auth';

import awsconfig from './aws-exports';

import introspectionQueryResultData from './graphql/fragmentTypes.json';

import { resolvers, typeDefs } from './graphql/resolvers';
import Main from './components/Main.jsx';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});
// import useAmplifyAuth from "./useAmplifyAuth";

Auth.configure(awsconfig);

// Configure with app sync

// const getAccessToken = () => Auth.currentSession().then((session) => session.getAccessToken().getJwtToken());

// const config = {
//   url: awsconfig.aws_appsync_graphqlEndpoint,
//   region: awsconfig.aws_appsync_region,
//   auth: {
//     type: awsconfig.aws_appsync_authenticationType,
//     // apiKey: awsconfig.aws_appsync_apiKey,
//     jwtToken: getAccessToken,
//   },
//   disableOffline: true,
// };

// const link = ApolloLink.from([
//   // @ts-ignore
//   createAuthLink(config),
//   // @ts-ignore
//   createSubscriptionHandshakeLink(config),
// ]);

const httpLink = createHttpLink({
  uri: awsconfig.aws_appsync_graphqlEndpoint,
});

const authLink = setContext((_, { headers }) => {
  return Auth.currentSession()
    .then((data) => {
      console.log('current session', data.accessToken.jwtToken);
      return {
        headers: {
          ...headers,
          Authorization: data.accessToken.jwtToken,
        },
      };
    })
    .catch((err) => {
      // Not authenticated
      return {
        headers: {
          ...headers,
        },
      };
    });
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({ fragmentMatcher }),
  typeDefs,
  resolvers,
});

const App = () => (
  <div className="App">
    {/* <Main /> */}
    <Main />
  </div>
);

const WithProvider = () => (
  <ApolloProvider client={client}>
    <App />
    {/* <div>hello world</div> */}
  </ApolloProvider>
  // <div>hello world</div>
);

export default WithProvider;
