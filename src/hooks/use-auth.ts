/* eslint-disable import/prefer-default-export */
import React, { useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';
import { useImmerReducer } from 'use-immer';

const LC_USER = 'User';

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
  onLogin: (email: string, password: string) => Promise<void>;
}

const useAuth = (): IUseAmplifyAuth => {
  const initialState = {
    isLoading: true,
    isError: false,
    user: JSON.parse(localStorage.getItem(LC_USER)) as CognitoUser,
  };
  const [state, dispatch] = useImmerReducer(amplifyAuthReducer, initialState);

  useEffect(() => {
    getAuthenticatedUser();
  });

  const getAuthenticatedUser = async () => {
    dispatch({ type: 'FETCH_USER_DATA_INIT' });
    try {
      const user = await Auth.currentAuthenticatedUser();
      if (user) {
        dispatch({
          type: 'FETCH_USER_DATA_SUCCESS',
          payload: { user },
        });
        localStorage.setItem(LC_USER, JSON.stringify(user));
      }
    } catch (error) {
      dispatch({ type: 'FETCH_USER_DATA_FAILURE' });
    }
  };

  const onLogin = async (email: string, password: string) => {
    dispatch({ type: 'FETCH_USER_DATA_INIT' });
    try {
      const user = await Auth.signIn(email, password);
      if (user) {
        dispatch({
          type: 'FETCH_USER_DATA_SUCCESS',
          payload: { user },
        });
        localStorage.setItem(LC_USER, JSON.stringify(user));
      }
    } catch (error) {
      dispatch({ type: 'FETCH_USER_DATA_FAILURE' });
    }
  };

  return { state, onLogin };
};

export default useAuth;
