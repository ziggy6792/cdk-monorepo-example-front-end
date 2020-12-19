/* eslint-disable react/button-has-type */
import React, { useEffect, useState, Fragment, Component } from 'react';

import { Hub } from 'aws-amplify';

import { Button } from '@material-ui/core';
import Logger from 'js-logger';
import Spinner from '../../components/spinner';
import Buttons from '../../modules/login-form/Buttons';
import LoginForm from '../../modules/login-form';
import useToggle from '../../hooks/use-toggle';
import useAmplifyAuth from '../../hooks/use-amplify-auth';

interface State {
  formState: string;
}

const ProfileScreen: React.FC = () => {
  const [formState, setFormSate] = useState('base');

  // const [value, toggleValue] = useToggle(true);

  const { state, handleSignout } = useAmplifyAuth();

  const { isLoading, user, isGuest } = state;

  const isAuthenticated = user && !isGuest;

  Logger.info('auth state', state);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {!isAuthenticated && (
        <>
          {formState === 'email' && <LoginForm />}
          {formState === 'base' && <Buttons updateFormState={setFormSate} />}
        </>
      )}

      {isAuthenticated && (
        <>
          <>
            <h4>Welcome</h4>
            <Button onClick={handleSignout}>sign out</Button>
          </>
        </>
      )}
    </>
  );
};

export default ProfileScreen;
