import { useReducer, useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';

const useAmplifyAuth = () => {
  const initialState = {
    isLoading: true,
    isError: false,
    user: null,
  };

  useEffect(() => {
    let isMounted = true;

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
            console.log('signed in');
          }
          break;
        default:
      }
    };

    HubListener();

    return () => {
      Hub.remove('auth', () => {});
      isMounted = false;
    };
  }, [triggerFetch]);

  const handleSignin = async () => {
    try {
      console.log('signed out');
      await Auth.signOut();
      setTriggerFetch(false);
      dispatch({ type: 'RESET_USER_DATA' });
    } catch (error) {
      console.error('Error signing out user ', error);
    }
  };

  return { handleSignin };
};

export default useAmplifyAuth;
