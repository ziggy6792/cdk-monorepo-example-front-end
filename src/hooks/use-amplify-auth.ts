/* eslint-disable import/prefer-default-export */
import React, { useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';
import { useImmerReducer } from 'use-immer';

const amplifyAuthReducer = (state: IAuthState, action: IAction) => {
  switch (action.type) {
    case 'FETCH_USER_DATA_INIT':
      state.isLoading = true;
      state.isError = true;
      return state;

    case 'FETCH_USER_DATA_SUCCESS':
      state.isLoading = false;
      state.isError = false;
      state.user = action.payload.user;
      return state;
    case 'FETCH_USER_DATA_FAILURE':
      state.isLoading = false;
      state.isError = true;

      return state;
    case 'RESET_USER_DATA':
      state.user = null;
      return state;
    default:
      throw new Error();
  }
};

interface IAction {
  type: string;
  payload?: { user: CognitoUser };
}

interface IAuthState {
  isLoading: boolean;
  isError: boolean;
  user: CognitoUser | null;
}

interface IAuthState {
  isLoading: boolean;
  isError: boolean;
  user: CognitoUser;
}

interface IUseAmplifyAuth {
  state: IAuthState;
  handleSignout: () => Promise<void>;
}

const useAmplifyAuth = (): IUseAmplifyAuth => {
  const initialState = {
    isLoading: true,
    isError: false,
    user: null,
  };
  const [state, dispatch] = useImmerReducer(amplifyAuthReducer, initialState);
  const [triggerFetch, setTriggerFetch] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      if (isMounted) {
        dispatch({ type: 'FETCH_USER_DATA_INIT' });
      }
      try {
        if (isMounted) {
          const data = await Auth.currentAuthenticatedUser();
          if (data) {
            dispatch({
              type: 'FETCH_USER_DATA_SUCCESS',
              payload: { user: data },
            });
          }
          localStorage.setItem('User', JSON.stringify(data));
        }
      } catch (error) {
        if (isMounted) {
          dispatch({ type: 'FETCH_USER_DATA_FAILURE' });
        }
      }
    };

    const HubListener = () => {
      Hub.listen('auth', (data) => {
        const { payload } = data;
        onAuthEvent(payload);
      });
    };

    const onAuthEvent = (payload) => {
      switch (payload.event) {
        case 'signIn':
          if (isMounted) {
            setTriggerFetch(true);
            console.log('signed in');
          }
          break;
        default:
      }
    };

    HubListener();
    fetchUserData();

    return () => {
      Hub.remove('auth', () => {});
      isMounted = false;
    };
  }, [triggerFetch, dispatch]);

  const handleSignout = async () => {
    try {
      console.log('signed out');
      await Auth.signOut();
      setTriggerFetch(false);
      dispatch({ type: 'RESET_USER_DATA' });
      localStorage.setItem('User', null);
    } catch (error) {
      console.error('Error signing out user ', error);
    }
  };

  // const handleSignIn = async () => {
  //   try {
  //     console.log('signed out');
  //     await Auth.signOut();
  //     setTriggerFetch(false);
  //     dispatch({ type: 'RESET_USER_DATA' });
  //     localStorage.setItem('User', null);
  //   } catch (error) {
  //     console.error('Error signing out user ', error);
  //   }
  // };

  return { state, handleSignout };
};

export default useAmplifyAuth;
