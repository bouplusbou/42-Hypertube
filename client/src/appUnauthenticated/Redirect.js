import React, { useEffect, useContext } from 'react';
import { actionLogin, actionIsAuthenticated } from '../actions/authActions';
import AppContext from '../contexts/AppContext';

export default function Redirect(props) {

  const appState = useContext(AppContext);

  useEffect(() => {
    async function redirect() {
      if (props.location.search) {
        let regex = /(\?authToken=)(?<authToken>.*)/;
        let str = props.location.search;
        let groups = str.match(regex).groups;
        if (groups.authToken) {
          const isAuth = await actionIsAuthenticated(groups.authToken);
          if (isAuth) {
            await actionLogin(groups.authToken);
            appState.toggleConnected();
            props.history.push('/home');
          }
        }
      }
    };
    redirect();
  }, [appState, props.location.search, props.history]);

  return (
    <p>in redirect</p>
  )
}