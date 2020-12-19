import React from 'react';

import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { Provider } from 'react-redux';

import Auth from '@aws-amplify/auth';

import awsconfig from './aws-exports';
import Routes from './routes';
import { resolvers, typeDefs } from './graphql/resolvers';
import store from './conf/store';

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
  typeDefs,
  resolvers: resolvers as any,
});

const App = () => (
  <div className='App' style={{ height: '100vh', width: '100vw' }}>
    <Routes />
  </div>
);

const WithProvider = () => (
  <Provider store={store}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Provider>
);

// const WithProvider: React.FC = () => {
//   const client = new ApolloClient({
//     link: authLink.concat(httpLink),
//     cache: new InMemoryCache(),
//     typeDefs,
//     resolvers: resolvers as any,
//   });
//   return (
//     <ApolloProvider client={client}>
//       <App />
//     </ApolloProvider>
//   );
// };

export default WithProvider;
