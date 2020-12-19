/* eslint-disable import/prefer-default-export */
import React, { useReducer, useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';

const amplifyAuthReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_USER_DATA_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'FETCH_USER_DATA_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        user: action.payload.user,
      };
    case 'FETCH_USER_DATA_FAILURE':
      return { ...state, isLoading: false, isError: true };
    case 'RESET_USER_DATA':
      return { ...state, user: null };
    default:
      throw new Error();
  }
};

interface IAuthState {
  isLoading: boolean;
  isError: boolean;
  user: any;
}

interface IAuthState {
  isLoading: boolean;
  isError: boolean;
  user: any;
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
  const [state, dispatch] = useReducer(amplifyAuthReducer, initialState);
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
          localStorage.setItem('User', data);
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
  }, [triggerFetch]);

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

  return { state, handleSignout };
};

export default useAmplifyAuth;
