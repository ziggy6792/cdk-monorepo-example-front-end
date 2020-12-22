import React from 'react';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { Provider } from 'react-redux';
import Auth from '@aws-amplify/auth';
import awsconfig from './cdk-exports';
import Routes from './routes';
import store from './conf/store';
import * as GqFetch from './util/aws-graphql-fetch';

Auth.configure(awsconfig);
GqFetch.configure(awsconfig);

const client = new ApolloClient({
  link: createHttpLink({
    fetch: GqFetch.awsGraphqlFetch,
  }),
  cache: new InMemoryCache(),
});

const App: React.FC = () => (
  <div className='App' style={{ height: '100vh', width: '100vw' }}>
    <Routes />
  </div>
);

const WithProvider: React.FC = () => (
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
