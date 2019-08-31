import React, { useState, Fragment } from 'react';
import StyledCompTheme from './StyledCompTheme.json';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { AppProvider } from './contexts/AppContext';
import UnauthenticatedSwitch from './appUnauthenticated/UnauthenticatedSwitch';

const GlobalStyles = createGlobalStyle`
  body {
    @import url('https://fonts.googleapis.com/css?family=Roboto');
    font-family: 'Roboto', sans-serif;
  }
`

function App() {
  const [connected, setConnected] = useState(false);
  // const authToken = localStorage.getItem('token');

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
          <UnauthenticatedSwitch /> 
        </ThemeProvider>
      </AppProvider>
    </Fragment>
  );
}

export default App;
