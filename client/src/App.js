import React, { useState, useEffect, Fragment } from 'react';
import StyledCompTheme from './StyledCompTheme.json';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { AppProvider } from './contexts/AppContext';
import UnauthenticatedSwitch from './appUnauthenticated/UnauthenticatedSwitch';
import AuthenticatedSwitch from './appAuthenticated/AuthenticatedSwitch';
import { actionIsAuthenticated } from './actions/authActions';

const GlobalStyles = createGlobalStyle`
  body {
    @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap');
    font-family: 'Roboto', sans-serif;
  }
`;

function App() {
  const [connected, setConnected] = useState(false);
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    let isSubscribed = true;
    async function fetchData() {
      try {
        const userIsAuthenticated = await actionIsAuthenticated(authToken);
        if (isSubscribed && userIsAuthenticated === true) setConnected(true);
      } catch(e) {
        if (isSubscribed) setConnected(false)
      }
    };
    if (authToken) fetchData();
    return () => isSubscribed = false;
  }, [authToken]);

  const appState = {
    connected,
    setConnected,
    toggleConnected: () => {setConnected(!connected)},
  };

  return (
    <Fragment>
      <GlobalStyles />
      <AppProvider value={appState}>
        <ThemeProvider theme={StyledCompTheme}>
        {!connected ? <UnauthenticatedSwitch /> 
          :
          <AuthenticatedSwitch /> 
        }
        </ThemeProvider>
      </AppProvider>
    </Fragment>
  );
}

export default App;
