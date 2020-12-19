/* eslint-disable react/button-has-type */
import React, { useEffect, useState, Fragment, Component } from 'react';

import { Hub } from 'aws-amplify';

import { Button } from '@material-ui/core';
import Spinner from '../../components/spinner';
import Buttons from '../../modules/login-form/Buttons';
import LoginForm from '../../modules/login-form';

interface State {
  formState: string;
}
const ProfileScreen: React.FC = () => {
  const [formState, setFormSate] = useState('base');
  // This renders the custom form
  if (formState === 'email') {
    return <LoginForm />;
  }
  if (!formState) {
    return <Spinner />;
  }

  const isAuthenticated = false;

  return (
    <>
      {isAuthenticated && (
        <>
          <h4>Welcome</h4>
          <Button>sign out</Button>
        </>
      )}

      {!isAuthenticated && <Buttons updateFormState={setFormSate} />}
      {isAuthenticated && <div>Is Authenticated</div>}
    </>
  );
};

export default ProfileScreen;
