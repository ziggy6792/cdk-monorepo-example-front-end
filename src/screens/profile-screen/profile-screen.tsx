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
    // const styles = {
    //   appContainer: {
    //     // paddingTop: 115,
    //   },
    //   loading: {},
    //   button: {
    //     marginTop: 15,
    //     width: '100%',
    //     maxWidth: 250,
    //     marginBottom: 10,
    //     display: 'flex',
    //     justifyContent: 'flex-start',
    //     alignItems: 'center',
    //     padding: '0px 16px',
    //     borderRadius: 2,
    //     boxShadow: '0px 1px 3px rgba(0, 0, 0, .3)',
    //     cursor: 'pointer',
    //     outline: 'none',
    //     border: 'none',
    //     minHeight: 40,
    //   },
    //   text: {
    //     color: 'white',
    //     fontSize: 14,
    //     marginLeft: 10,
    //     fontWeight: 'bold',
    //   },
    //   signOut: {
    //     backgroundColor: 'black',
    //   },
    //   footer: {
    //     fontWeight: '600',
    //     padding: '0px 25px',
    //     textAlign: 'right',
    //     color: 'rgba(0, 0, 0, 0.6)',
    //   },
    //   anchor: {
    //     color: 'rgb(255, 153, 0)',
    //     textDecoration: 'none',
    //   },
    //   body: {
    //     padding: '0px 30px',
    //   },
    // };

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
