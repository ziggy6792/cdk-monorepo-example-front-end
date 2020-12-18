/* eslint-disable react/button-has-type */
import React, { useEffect, useState, Fragment, Component } from 'react';

import { Hub } from 'aws-amplify';
import { FaSignOutAlt } from 'react-icons/fa';

import { withApollo } from 'react-apollo';

import Spinner from '../../components/spinner';
import Buttons from '../../modules/login-form/Buttons';
import withAuthenticator from '../../hoc/withAuthenticator';
import LoginForm from '../../modules/login-form';

interface Props {
  auth: any;
  client: any;
}

interface State {
  formState: string;
}
class ProfileScreen extends React.Component<Props, State> {
  myListener: (data: any) => void;

  constructor(props: any) {
    super(props);
    this.state = {
      formState: 'base',
    };
    this.myListener = (data) => {
      const { payload } = data;
      // if (payload.event === 'signIn') {
      //   setImmediate(() => {
      //     this.setState({ formState: null });
      //   });
      // }
      if (payload.event !== 'signUp') {
        this.setState({ formState: null });
        window.location.reload(false);
      }
    };
  }

  componentDidMount() {
    Hub.listen('auth', this.myListener);
  }

  componentWillUnmount() {
    Hub.remove('auth', this.myListener);
  }

  render() {
    // This renders the custom form
    if (this.state.formState === 'email') {
      return <LoginForm />;
    }
    if (!this.state.formState) {
      return <Spinner />;
    }

    const isAuthenticated = false;

    return (
      <>
        {isAuthenticated && (
          <>
            <h4>Welcome {this.props.auth.user.nameDisplayText}</h4>
            <button
              onClick={async () => {
                // this.setState({ formState: null });

                // this.setState({ formState: null });
                this.props.client.cache.reset();
                await this.props.auth.onLogout();
              }}
            >
              <FaSignOutAlt color='white' />
              <p>Sign Out</p>
            </button>
          </>
        )}

        {!isAuthenticated && <Buttons updateFormState={(newState: any) => this.setState((prevState) => ({ ...prevState, formState: newState }))} />}
        {isAuthenticated && <div>Is Authenticated</div>}
      </>
    );
  }
}

export default withApollo(ProfileScreen);
