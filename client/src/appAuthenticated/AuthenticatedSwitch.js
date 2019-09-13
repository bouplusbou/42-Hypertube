import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PageMyProfile from './pages/PageMyProfile/PageMyProfile';
import PageMyProfileEdit from './pages/PageMyProfileEdit/PageMyProfileEdit';
import PageProfile from './pages/PageProfile/PageProfile';
import PageLanguage from './pages/PageLanguage/PageLanguage';
import TestHome from './TestHome';
import TestMovie from './TestMovie';

const AuthenticatedSwitch = () => (
    <Switch>
        <Route exact path='/home' component={TestHome}/>
        <Route exact path='/movie' component={TestMovie}/>
        <Route exact path='/myProfile' component={PageMyProfile}/>
        <Route exact path='/myProfileEdit' component={PageMyProfileEdit}/>
        <Route exact path='/language' component={PageLanguage}/>
        <Route exact path='/users/:username' component={PageProfile}/>
        <Route component={TestHome}/>
    </Switch>
);

export default AuthenticatedSwitch;
