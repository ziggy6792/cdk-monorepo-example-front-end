/* eslint-disable import/prefer-default-export */
import React, { useState, useEffect, useCallback } from 'react';
import { Auth, Hub } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';
import { useImmerReducer } from 'use-immer';

const LC_USER = 'User';

const guestLogin: ILoginParams = {
  email: 'ziggy067+guest@gmail.com',
  password: 'password',
};

const amplifyAuthReducer = (state: IAuthState, action: IAction) => {
  switch (action.type) {
    case 'FETCH_USER_DATA_INIT':
      state.isLoading = true;
      state.isError = true;
      state.isGuest = false;
      return state;

    case 'FETCH_USER_DATA_SUCCESS':
      state.isLoading = false;
      state.isError = false;
      state.user = action.payload.user;
      state.isGuest = state.user.getUsername() === 'b5ac12d3-0e68-4273-bbb8-8a9744355234';
      return state;
    case 'FETCH_USER_DATA_FAILURE':
      state.isLoading = false;
      state.isError = true;
      state.isGuest = false;
      return state;
    case 'RESET_USER_DATA':
      state.user = null;
      state.isGuest = false;
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
  isGuest: boolean;
}
interface ILoginParams {
  email: string;
  password: string;
}
interface IUseAmplifyAuth {
  state: IAuthState;
  handleSignout: () => Promise<void>;
  handleSignIn: ({ email, password }) => Promise<void>;
}

const useAmplifyAuth = (): IUseAmplifyAuth => {
  const initialState = {
    isLoading: true,
    isError: false,
    user: null,
    isGuest: false,
  };
  const [state, dispatch] = useImmerReducer(amplifyAuthReducer, initialState);
  const [triggerFetch, setTriggerFetch] = useState(false);

  const setLocalStorage = useCallback(() => {
    localStorage.setItem(LC_USER, state.user ? JSON.stringify(state.user) : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignIn = useCallback(async ({ email, password }: ILoginParams) => {
    const user = await Auth.signIn(email, password);
    console.log('Sign in done');
    setTriggerFetch(false);
  }, []);

  // Get Auth State
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
        }
      } catch (error) {
        if (isMounted) {
          console.log('Error', error);
          dispatch({ type: 'FETCH_USER_DATA_FAILURE' });
          await handleSignIn(guestLogin);
        }
      }
      setLocalStorage();
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
  }, [triggerFetch, dispatch, setLocalStorage, handleSignIn]);

  const handleSignout = useCallback(async () => {
    await handleSignIn(guestLogin);
  }, [handleSignIn]);

  return { state, handleSignout, handleSignIn };
};

export default useAmplifyAuth;
