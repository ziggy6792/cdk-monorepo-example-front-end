/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-len */

// import { setContext } from 'apollo-link-context';

import Auth from '@aws-amplify/auth';

import { aws4Interceptor } from 'aws4-axios';
import Axios from 'axios';
import { buildAxiosFetch } from '@lifeomic/axios-fetch';

interface IAwsGraphqlFetchConfig {
  aws_graphqlEndpoint_external: string;
  aws_graphqlEndpoint_internal: string;
  aws_graphqlEndpoint_unprotected: string;
}

let gqFetchConfig: IAwsGraphqlFetchConfig | null = null;

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

  // Remove unsafe headers which are set by the browser instead
  axiosInstance.interceptors.request.use((config) => {
    delete config.headers.Host;
    delete config.headers['Content-Length'];
    return config;
  });

  axiosInstance.interceptors.request.use(interceptor);

  return buildAxiosFetch(axiosInstance);
};

export const configure = (config: IAwsGraphqlFetchConfig) => {
  gqFetchConfig = config;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const awsGraphqlFetch = async (uri: string, options: any): Promise<any> => {
  const {
    aws_graphqlEndpoint_external: EXTERNAL_URL,
    aws_graphqlEndpoint_internal: INTERNAL_URL,
    aws_graphqlEndpoint_unprotected: UNPROTECTED_URL,
  } = gqFetchConfig;

  try {
    const cognitoUser = await Auth.currentSession();

    const cognitoFetch = buildCognitoFetch(cognitoUser.getAccessToken().getJwtToken());

    return cognitoFetch(EXTERNAL_URL, options);
  } catch (err) {
    if (err === 'No current user') {
      console.log('Not logged in');
      try {
        const credentials = await Auth.currentCredentials();

        const iamFetch = buildIamFetch(credentials);

        return iamFetch(INTERNAL_URL, options);
      } catch (err) {
        console.log('Error getting unauthorized user credentials', err);
      }
    } else {
      throw err;
    }
  }
  return fetch(UNPROTECTED_URL, options);
};

export default awsGraphqlFetch;
