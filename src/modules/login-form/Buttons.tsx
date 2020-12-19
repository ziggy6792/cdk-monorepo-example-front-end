/* eslint-disable react/button-has-type */
import React from 'react';

import { Auth } from 'aws-amplify';
import { FaFacebook, FaGoogle, FaEnvelope } from 'react-icons/fa';
import { Button, Grid } from '@material-ui/core';
import { Email, Facebook } from '@material-ui/icons';
import withAuthenticator from '../../hoc/withAuthenticator/with-authenticator';

interface IButtonsProps {
  updateFormState: (formState: string) => void;
}

const Buttons: React.FC<IButtonsProps> = ({ updateFormState }) => {
  return (
    <Grid container direction='column' justify='center' alignItems='center' style={{ height: '100%' }}>
      <Grid item>
        <Button color='primary' endIcon={<Facebook />} onClick={() => console.log({ authType: 'Facebook' })}>
          Facebook
        </Button>
      </Grid>
      <Grid item>
        <Button color='primary' endIcon={<Email />} onClick={() => updateFormState('email')}>
          Sign in with Email
        </Button>
      </Grid>
    </Grid>
  );
};

export default Buttons;
