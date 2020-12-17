import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter, Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Theme from './ui/Theme';
import { ROUTE_PROFILE, ROUTE_USERS } from '../conf/navigation';

const Main = () => {
  return (
    <ThemeProvider theme={Theme}>
      <BrowserRouter>
        <Route exact path="/">
          <Redirect to={ROUTE_PROFILE} />
        </Route>
        <Switch>
          <Route exact path={ROUTE_USERS} render={() => <div>users</div>} />
          <Route exact path={ROUTE_PROFILE} render={() => <div>profile</div>} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default Main;
