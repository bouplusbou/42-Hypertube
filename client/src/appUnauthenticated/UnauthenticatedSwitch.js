import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PageLogin from './pages/PageLogin/PageLogin';
import PageSignup from './pages/PageSignup/PageSignup';
import Page404Unauth from './pages/Page404Unauth/Page404Unauth';
import Redirect from './Redirect';

const UnauthenticatedSwitch = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={PageLogin}/>
            <Route exact path='/login' component={PageLogin}/>
            <Route exact path='/signup' component={PageSignup}/>
            <Route exact path='/redirect' component={Redirect}/>
            <Route component={Page404Unauth}/>
        </Switch>
    </BrowserRouter>
);

export default UnauthenticatedSwitch;
