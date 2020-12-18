/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-alert */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useReducer } from 'react';

import { Auth } from 'aws-amplify';
import Logger from 'js-logger';
import { Formik, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import { Button, Grid } from '@material-ui/core';
import * as Yup from 'yup';

interface ISignInOrUpFormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const SignInOrUpFormValuesSchema = Yup.object().shape({
  firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too Short!').required('Required'),
});

// eslint-disable-next-line camelcase
async function signUp({ email, password, firstName, lastName }: ISignInOrUpFormValues, updateFormType: (formType: string) => void) {
  try {
    // const response = await Auth.signUp({
    //   username: email,
    //   password,
    //   attributes: { email, 'custom:signUpAttributes': JSON.stringify({ given_name: firstName, family_name: lastName }) },
    // });
    // Logger.info(response.user);
    Logger.info('sign up success!');
    updateFormType('confirmSignUp');
  } catch (err) {
    Logger.info('error signing up..', err);
  }
}

interface ISignupConfirmation {
  email: string;
  confirmationCode: string;
}

async function confirmSignUp({ email, confirmationCode }: ISignupConfirmation, updateFormType: (type: string) => void) {
  try {
    await Auth.confirmSignUp(email, confirmationCode);
    Logger.info('confirm sign up success!');
    updateFormType('signInOrUp');
  } catch (err) {
    Logger.info('error signing up..', err);
  }
}

const LoginForm: React.FC = () => {
  const [formType, updateFormType] = useState('signInOrUp');
  const [email, setEmail] = useState<string | null>(null);

  function renderForm() {
    switch (formType) {
      case 'signInOrUp':
        return (
          <SignUp
            signUp={async (values: ISignInOrUpFormValues) => {
              setEmail(values.email);
              signUp(values, updateFormType);
            }}
            signIn={async (values: ISignInOrUpFormValues) => {
              console.log('signIn', values);
            }}
          />
        );
      case 'confirmSignUp':
        return (
          // <ConfirmSignUp
          //   confirmSignUp={() => confirmSignUp(formState, updateFormType)}
          //   updateFormState={(e: any) => updateFormState({ type: 'updateFormState', e })}
          //   formState={formState}
          // />
          <ConfirmSignUp onSubmit={(confirmationCode: string) => confirmSignUp({ email, confirmationCode }, updateFormType)} />
        );

      default:
        return null;
    }
  }

  return renderForm();
};

interface SignUpProps {
  signUp: (formValues: ISignInOrUpFormValues) => Promise<void>;
  signIn: (formValues: ISignInOrUpFormValues) => Promise<void>;
}

export const SignUp: React.FC<SignUpProps> = ({ signUp, signIn }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  return (
    <Formik
      initialValues={{
        email: 'ziggy067@gmail.com',
        firstName: 'Simon',
        lastName: 'Verhoeven',
        password: 'password',
      }}
      validationSchema={SignInOrUpFormValuesSchema}
      onSubmit={async (values) => {
        if (isSignUp) {
          await signUp(values);
        } else {
          await signIn(values);
        }
      }}
    >
      {({ submitForm, isSubmitting }) => (
        <Grid container direction='column'>
          <Grid item>
            <Field component={TextField} name='email' type='email' label='Email' />
          </Grid>
          <Grid item>
            <Field component={TextField} type='password' label='Password' name='password' />
          </Grid>
          {isSignUp && (
            <>
              <Grid item>
                <Field component={TextField} name='firstName' label='First Name' />
              </Grid>
              <Grid item>
                <Field component={TextField} name='lastName' label='Last Name' />
              </Grid>
              <Grid item>
                <Button variant='contained' color='primary' disabled={isSubmitting} onClick={submitForm}>
                  Sign Up
                </Button>
              </Grid>
              <Grid item>
                Have a Pofile?{' '}
                <Button color='primary' onClick={() => setIsSignUp((isu) => !isu)}>
                  Sign In
                </Button>
              </Grid>
            </>
          )}
          {!isSignUp && (
            <>
              <Grid item>
                <Button variant='contained' color='primary' disabled={isSubmitting} onClick={submitForm}>
                  Sign In
                </Button>
              </Grid>
              <Grid item>
                Need a Pofile?{' '}
                <Button color='primary' onClick={() => setIsSignUp((isu) => !isu)}>
                  Sign Up
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      )}
    </Formik>
  );
};

interface IConfirmSignupProps {
  onSubmit: (confirmationCode: string) => Promise<void>;
}

const ConfirmSignUp: React.FC<IConfirmSignupProps> = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={{
        confirmationCode: '',
      }}
      validationSchema={Yup.object().shape({
        confirmationCode: Yup.string().length(6, 'Must Be 6 Characters!').required('Required'),
      })}
      onSubmit={async (values) => {
        await onSubmit(values.confirmationCode);
      }}
    >
      {({ submitForm, isSubmitting }) => (
        <Grid container direction='column'>
          <Grid item>
            <Field component={TextField} name='confirmationCode' label='Confirmation Code' />
          </Grid>

          <Grid item>
            <Button variant='contained' color='primary' disabled={isSubmitting} onClick={submitForm}>
              Confirm Sign Up
            </Button>
          </Grid>
        </Grid>
      )}
    </Formik>
  );
};

export default LoginForm;
