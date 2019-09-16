import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PageMyProfile from './pages/PageMyProfile/PageMyProfile';
import PageMyProfileEdit from './pages/PageMyProfileEdit/PageMyProfileEdit';
import PageProfile from './pages/PageProfile/PageProfile';
import PageLanguage from './pages/PageLanguage/PageLanguage';
import PageMovie from './pages/PageMovie/PageMovie';
import TestHome from './TestHome';

const AuthenticatedSwitch = () => (
    <Switch>
        <Route exact path='/home' component={TestHome}/>
        <Route exact path='/myProfile' component={PageMyProfile}/>
        <Route exact path='/myProfileEdit' component={PageMyProfileEdit}/>
        <Route exact path='/language' component={PageLanguage}/>
        <Route exact path='/users/:username' component={PageProfile}/>
        <Route exact path='/movies/:imdbId' component={PageMovie}/>
        <Route component={TestHome}/>
    </Switch>
);

export default AuthenticatedSwitch;
