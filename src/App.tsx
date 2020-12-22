/* eslint-disable max-len */
import React from 'react';

import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
// import { setContext } from 'apollo-link-context';
import { Provider } from 'react-redux';

import Auth from '@aws-amplify/auth';

import { aws4Interceptor } from 'aws4-axios';
import Axios from 'axios';
import { buildAxiosFetch } from '@lifeomic/axios-fetch';

import awsconfig from './aws-exports';
import Routes from './routes';
import { resolvers, typeDefs } from './graphql/resolvers';
import store from './conf/store';
import { initApolloClient } from './util/apollo-client';

Auth.configure(awsconfig);

const httpLink = createHttpLink({
  uri: awsconfig.aws_appsync_graphqlEndpoint,
});

// const authLink = setContext((_, { headers }) => {
//   return Auth.currentSession()
//     .then((data: any) => {
//       console.log('current session bla', data.accessToken.jwtToken);
//       return {
//         headers: {
//           ...headers,
//           Authorization: data.accessToken.jwtToken,
//         },
//       };
//     })
//     .catch(() => {
//       // Not authenticated
//       return {
//         headers: {
//           ...headers,
//         },
//       };
//     });
// });

const myEndpoint = 'https://mnakrqgp7b.execute-api.ap-southeast-1.amazonaws.com/dev/internal/graphql';

// const awsGraphqlFetch = (uri: string, options) => {
//   // uri = 'https://mnakrqgp7b.execute-api.ap-southeast-1.amazonaws.com/dev/unprotected/graphql'

//   return Auth.currentCredentials().then((data) => {
//     const interceptor = aws4Interceptor(
//       {
//         region: 'ap-southeast-1',
//         service: 'execute-api',
//       },
//       {
//         accessKeyId: data.accessKeyId,
//         secretAccessKey: data.secretAccessKey,
//         sessionToken: data.sessionToken,
//       }
//     );
//     const axiosInstance = axios.create();
//     axiosInstance.interceptors.request.use(interceptor);

//     console.log('HERE!');
//     return buildAxiosFetch(axiosInstance);
//   });
// };
// const url = 'https://mnakrqgp7b.execute-api.ap-southeast-1.amazonaws.com/dev/internal/graphql';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const awsGraphqlFetch = async (uri: string, options: any) => {
  const axiosInstance = Axios.create();

  const credentials = await Auth.currentCredentials();

  const interceptor = aws4Interceptor(
    {
      region: 'ap-southeast-1',
      service: 'execute-api',
    },
    { accessKeyId: credentials.accessKeyId, secretAccessKey: credentials.secretAccessKey, sessionToken: credentials.sessionToken }
  );
  axiosInstance.interceptors.request.use(interceptor);

  return buildAxiosFetch(axiosInstance)(uri, options);
};

const client = new ApolloClient({
  link: createHttpLink({
    uri: myEndpoint,
    fetch: awsGraphqlFetch,
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
