import gql from 'graphql-tag';
import { Auth } from 'aws-amplify';
import Logger from 'js-logger';
import _ from 'lodash';
import { defaultIfNull } from '../utils/utility';
import { GuestLogin } from '../conf/content';

export const typeDefs = gql`
  type AuthenticatedUser {
    id: String!
    email: String!
    email_verified: Boolean!
    given_name: String!
    family_name: String!
    email: String!
    nameDisplayText: String!
  }
`;

export const resolvers = {
  Query: {
    getAutenticatedUser: async (_root, variables, { client }) => {
      // return !!localStorage.getItem('token');
      let user;
      try {
        user = await Auth.currentAuthenticatedUser();
      } catch (err) {
        // Do nothing
        // await
        console.log({ err });
      }
      return buildAauthUser(user);
    },
  },
};

const buildAauthUser = async (_user) => {
  // Logger.info("buildAauthUser",user)
  let authUser = { __typename: 'AuthenticatedUser' } as any;
  if (_user && _user.attributes) {
    const user = _.clone(_user);
    delete user.attributes['custom:signUpAttributes'];
    const { attributes } = user;
    authUser = {
      ...authUser,
      type: 'AuthenticatedUser',
      ...attributes,
      id: user.username,
    };
    authUser.picture = defaultIfNull(authUser.picture, null);
    delete authUser.sub;
    authUser.isGuest = authUser.email === GuestLogin.email;
    authUser.isAuthenticated = !authUser.isGuest;
    authUser.nameDisplayText = authUser.isGuest ? 'Guest' : `${attributes.given_name} ${attributes.family_name}`;

    // #Test
    authUser.nameDisplayText = authUser.id.includes('Facebook') ? `${authUser.nameDisplayText} (FB)` : authUser.nameDisplayText;

    // Removed isAdmin/isJudge/isRegistered becasue it was causing getDataEntity to be called with no authenticated user meaning that
    // isUserJudge was set to null in the cache. Maybe fix this later if needed
  }
  return authUser;
};
