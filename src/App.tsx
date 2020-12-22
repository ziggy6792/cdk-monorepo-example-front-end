/* eslint-disable @typescript-eslint/no-shadow */
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

const IAM_URL = 'https://mnakrqgp7b.execute-api.ap-southeast-1.amazonaws.com/dev/internal/graphql';
const COGNITO_URL = 'https://mnakrqgp7b.execute-api.ap-southeast-1.amazonaws.com/dev/external/graphql';
const UNPROTECTED_URL = 'https://mnakrqgp7b.execute-api.ap-southeast-1.amazonaws.com/dev/unprotected/graphql';

interface ICredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
}

const buildCognitoFetch = (jwtToken: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (uri: string, options: any) => {
    options.headers.Authorization = jwtToken;
    return fetch(uri, options);
  };
};

const buildIamFetch = (credentials: ICredentials) => {
  const axiosInstance = Axios.create();

  const interceptor = aws4Interceptor(
    {
      region: 'ap-southeast-1',
      service: 'execute-api',
    },
    { accessKeyId: credentials.accessKeyId, secretAccessKey: credentials.secretAccessKey, sessionToken: credentials.sessionToken }
  );

  // Remove unsafe headers
  axiosInstance.interceptors.request.use((config) => {
    delete config.headers.Host;
    delete config.headers['Content-Length'];
    return config;
  });

  axiosInstance.interceptors.request.use(interceptor);

  return buildAxiosFetch(axiosInstance);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const awsGraphqlFetch = async (uri: string, options: any) => {
  try {
    const cognitoUser = await Auth.currentSession();

    const cognitoFetch = buildCognitoFetch(cognitoUser.getAccessToken().getJwtToken());

    return cognitoFetch(COGNITO_URL, options);
  } catch (err) {
    if (err === 'No current user') {
      console.log('Not logged in');
      const credentials = await Auth.currentCredentials();

      const iamFetch = buildIamFetch(credentials);

      return iamFetch(IAM_URL, options);

      // const newFetch = async (uri: string, options: any) => {
      //   const ret = await iamFetch(uri, options);
      //   console.log('IAM FETCH', JSON.stringify(ret));
      //   return ret;
      // };
      // return newFetch(IAM_URL, options);
    }
  }
  return fetch(UNPROTECTED_URL, options);
};

const client = new ApolloClient({
  link: createHttpLink({
    // uri: IAM_URL,
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
