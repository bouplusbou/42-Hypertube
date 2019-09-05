import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PageLogin from './pages/PageLogin/PageLogin';
import PageSignup from './pages/PageSignup/PageSignup';
import PageMyProfile from './pages/PageMyProfile/PageMyProfile';
import PageMyProfileEdit from './pages/PageMyProfileEdit/PageMyProfileEdit';
import TestHome from './TestHome';

const UnauthenticatedSwitch = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={PageLogin}/>
            <Route exact path='/login' component={PageLogin}/>
            <Route exact path='/signup' component={PageSignup}/>
            <Route exact path='/home' component={TestHome}/>
            <Route exact path='/myProfile' component={PageMyProfile}/>
            <Route exact path='/myProfileEdit' component={PageMyProfileEdit}/>
        </Switch>
    </BrowserRouter>
);

export default UnauthenticatedSwitch;
