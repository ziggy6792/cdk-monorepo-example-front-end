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

const Buttons: React.FC<IButtonsProps> = (props) => {
  return (
    <Grid container direction='column' justify='center' alignItems='center' style={{ height: '100%' }}>
      <Grid item>
        <Button color='primary' endIcon={<Facebook />} onClick={() => console.log({ authType: 'Facebook' })}>
          Facebook
        </Button>
      </Grid>
      <Grid item>
        <Button color='primary' endIcon={<Email />} onClick={() => props.updateFormState('email')}>
          Sign in with Email
        </Button>
      </Grid>
    </Grid>

    // <div>
    //   <div style={styles.container as any}>
    //     <button
    //       style={{ ...styles.button, ...styles.facebook } as any}
    //       onClick={() => {
    //         // props.auth.onLogin({ authType: 'Facebook' });
    //         console.log({ authType: 'Facebook' });
    //       }}
    //     >
    //       <FaFacebook color="white" />
    //       <p style={styles.text as any}>Sign in with Facebook</p>
    //     </button>
    //     <button style={{ ...styles.button, ...styles.email }} onClick={() => props.updateFormState('email')}>
    //       <FaEnvelope color="white" />
    //       <p style={{ ...styles.text } as any}>Sign in with Email</p>
    //     </button>
    //   </div>
    // </div>
  );
};

const styles = {
  container: {
    height: '80vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  button: {
    width: '100%',
    maxWidth: 250,
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '0px 16px',
    borderRadius: 2,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, .3)',
    cursor: 'pointer',
    outline: 'none',
    border: 'none',
    minHeight: 40,
  },
  facebook: {
    backgroundColor: '#3b5998',
  },
  email: {
    backgroundColor: '#db4437',
  },
  checkAuth: {
    backgroundColor: '#02bd7e',
  },
  hostedUI: {
    backgroundColor: 'rgba(0, 0, 0, .6)',
  },
  signOut: {
    backgroundColor: 'black',
  },
  withAuthenticator: {
    backgroundColor: '#FF9900',
  },
  icon: {
    height: 16,
    marginLeft: -1,
  },
  text: {
    color: 'white',
    fontSize: 14,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  blackText: {
    color: 'black',
  },
  grayText: {
    color: 'rgba(0, 0, 0, .75)',
  },
  orangeText: {
    color: '#FF9900',
  },
};

export default Buttons;
