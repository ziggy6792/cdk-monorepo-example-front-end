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

interface IUser {
  email: string;
  password: string;
  given_name: string;
  family_name: string;
}

const initialFormState = {
  email: 'ziggy067+1@gmail.com',
  password: 'password',
  confirmationCode: '',

  given_name: 'Simon',
  family_name: 'Verhoeven',
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'updateFormState':
      return {
        ...state,
        [action.e.target.name]: action.e.target.value,
      };
    default:
      return state;
  }
}

// eslint-disable-next-line camelcase
async function signUp({ email, password, given_name, family_name }: IUser, updateFormType: (type: string) => void) {
  try {
    const response = await Auth.signUp({
      username: email,
      password,
      attributes: { email, 'custom:signUpAttributes': JSON.stringify({ given_name, family_name }) },
    });
    Logger.info(response.user);

    Logger.info('sign up success!');
    updateFormType('confirmSignUp');
  } catch (err) {
    Logger.info('error signing up..', err);
  }
}

async function confirmSignUp({ email, confirmationCode }: { email: string; confirmationCode: string }, updateFormType: (type: string) => void) {
  try {
    await Auth.confirmSignUp(email, confirmationCode);
    Logger.info('confirm sign up success!');
    updateFormType('signIn');
  } catch (err) {
    Logger.info('error signing up..', err);
  }
}

const LoginForm: React.FC<any> = () => {
  const [formType, updateFormType] = useState('signIn');
  const [formState, updateFormState] = useReducer(reducer, initialFormState);

  function renderForm() {
    switch (formType) {
      case 'signUp':
        return <SignUp signUp={() => signUp(formState, updateFormType)} />;
      case 'confirmSignUp':
        return (
          <ConfirmSignUp
            confirmSignUp={() => confirmSignUp(formState, updateFormType)}
            updateFormState={(e: any) => updateFormState({ type: 'updateFormState', e })}
            formState={formState}
          />
        );
      case 'signIn':
        return (
          <SignIn
            signIn={() => {
              console.log('login', { email: formState.email, password: formState.password });
            }}
            updateFormState={(e: any) => updateFormState({ type: 'updateFormState', e })}
            formState={formState}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div>
      <div>{renderForm()}</div>
      {formType === 'signUp' && (
        <p style={styles.footer as any}>
          Already have an profile?{' '}
          <span style={styles.anchor} onClick={() => updateFormType('signIn')}>
            Sign In
          </span>
        </p>
      )}
      {formType === 'signIn' && (
        <p style={styles.footer as any}>
          Need an profile?{' '}
          <span style={styles.anchor} onClick={() => updateFormType('signUp')}>
            Sign Up
          </span>
        </p>
      )}
    </div>
  );
};

const SignupSchema = Yup.object().shape({
  firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too Short!').required('Required'),
});

interface Values {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface SignUpProps {
  signUp: () => Promise<void>;
}

export const SignUp: React.FC<SignUpProps> = () => {
  return (
    <Formik
      initialValues={{
        email: '',
        firstName: '',
        lastName: '',
        password: '',
      }}
      validationSchema={SignupSchema}
      validate={(values) => {
        const errors: Partial<Values> = {};
        if (!values.email) {
          errors.email = 'Required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
          errors.email = 'Invalid email address';
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          setSubmitting(false);
          alert(JSON.stringify(values, null, 2));
        }, 500);
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
        </Grid>
      )}
    </Formik>
  );
};

const OldSignUp: React.FC<any> = (props: any) => {
  return (
    <div style={styles.container as any}>
      <input
        name='email'
        value={props.formState.email}
        onChange={(e) => {
          e.persist();
          props.updateFormState(e);
        }}
        style={styles.input}
        placeholder='email'
      />
      <input
        type='password'
        name='password'
        value={props.formState.password}
        onChange={(e) => {
          e.persist();
          props.updateFormState(e);
        }}
        style={styles.input}
        placeholder='password'
      />
      <input
        name='given_name'
        value={props.formState.given_name}
        onChange={(e) => {
          e.persist();
          props.updateFormState(e);
        }}
        style={styles.input}
        placeholder='first name'
      />
      <input
        name='family_name'
        value={props.formState.family_name}
        onChange={(e) => {
          e.persist();
          props.updateFormState(e);
        }}
        style={styles.input}
        placeholder='last name'
      />
      <button onClick={props.signUp} style={styles.button as any}>
        Sign Up
      </button>
    </div>
  );
};
const SignIn: React.FC<any> = (props: any) => {
  return (
    <div style={styles.container as any}>
      <input
        name='email'
        value={props.formState.email}
        onChange={(e) => {
          e.persist();
          props.updateFormState(e);
        }}
        style={styles.input}
        placeholder='email'
      />
      <input
        type='password'
        name='password'
        value={props.formState.password}
        onChange={(e) => {
          e.persist();
          props.updateFormState(e);
        }}
        style={styles.input}
        placeholder='password'
      />
      <button style={styles.button as any} onClick={props.signIn}>
        Sign In
      </button>
    </div>
  );
};

const ConfirmSignUp: React.FC<any> = (props: any) => {
  return (
    <div style={styles.container as any}>
      <input
        name='confirmationCode'
        placeholder='Confirmation Code'
        onChange={(e) => {
          e.persist();
          props.updateFormState(e);
        }}
        style={styles.input}
      />
      <button onClick={props.confirmSignUp} style={styles.button as any}>
        Confirm Sign Up
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 45,
    marginTop: 8,
    width: 300,
    maxWidth: 300,
    padding: '0px 8px',
    fontSize: 16,
    outline: 'none',
    border: 'none',
    borderBottom: '2px solid rgba(0, 0, 0, .3)',
  },
  button: {
    backgroundColor: '#006bfc',
    color: 'white',
    width: 316,
    height: 45,
    marginTop: 10,
    fontWeight: '600',
    fontSize: 14,
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    borderRadius: 3,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, .3)',
  },
  footer: {
    fontWeight: '600',
    padding: '0px 25px',
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  anchor: {
    color: '#006bfc',
    cursor: 'pointer',
  },
};

export default LoginForm;
