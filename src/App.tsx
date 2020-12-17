import React from 'react';

import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';

import Auth from '@aws-amplify/auth';

import awsconfig from './aws-exports';

import Main from './components/Main';

Auth.configure(awsconfig);

const httpLink = createHttpLink({
  uri: awsconfig.aws_appsync_graphqlEndpoint,
});

const authLink = setContext((_, { headers }) => {
  return Auth.currentSession()
    .then((data: any) => {
      console.log('current session', data.accessToken.jwtToken);
      return {
        headers: {
          ...headers,
          Authorization: data.accessToken.jwtToken,
        },
      };
    })
    .catch(() => {
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
  cache: new InMemoryCache(),
  // typeDefs,
  // resolvers,
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
