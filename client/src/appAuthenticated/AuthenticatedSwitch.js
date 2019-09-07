import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PageMyProfile from './pages/PageMyProfile/PageMyProfile';
import PageMyProfileEdit from './pages/PageMyProfileEdit/PageMyProfileEdit';
import Page404Auth from './pages/Page404Auth/Page404Auth';
import TestHome from './TestHome';

const AuthenticatedSwitch = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/home' component={TestHome}/>
            <Route exact path='/redirect' component={TestHome}/>
            <Route exact path='/myProfile' component={PageMyProfile}/>
            <Route exact path='/myProfileEdit' component={PageMyProfileEdit}/>
            {/* <Route exact path='/login' component={TestHome}/>
            <Route exact path='/signup' component={TestHome}/> */}
            <Route component={Page404Auth}/>
        </Switch>
    </BrowserRouter>
);

export default AuthenticatedSwitch;
