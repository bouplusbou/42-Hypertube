import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PageLogin from './pages/PageLogin/PageLogin';
import PageSignup from './pages/PageSignup/PageSignup';

const UnauthenticatedSwitch = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={PageLogin}/>
            <Route exact path='/login' component={PageLogin}/>
            <Route exact path='/signup' component={PageSignup}/>
        </Switch>
    </BrowserRouter>
);

export default UnauthenticatedSwitch;
