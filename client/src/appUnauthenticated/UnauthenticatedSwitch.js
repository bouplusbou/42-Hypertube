import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PageLogin from './pages/PageLogin/PageLogin';
import PageSignup from './pages/PageSignup/PageSignup';
import Page404Unauth from './pages/Page404Unauth/Page404Unauth';
import PageResetPassword from './pages/PageResetPassword/PageResetPassword';

const UnauthenticatedSwitch = () => (
    <Switch>
        <Route exact path='/' component={PageLogin}/>
        <Route exact path='/login' component={PageLogin}/>
        <Route exact path='/signup' component={PageSignup}/>
        <Route exact path='/resetPassword/:emailHash' component={PageResetPassword}/>
        <Route component={Page404Unauth}/>
    </Switch>
);

export default UnauthenticatedSwitch;
