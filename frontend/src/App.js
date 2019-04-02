import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { blue, red, green } from '@material-ui/core/colors';
import './App.css';

import Client from './pages/client/Client';
import User from './pages/user/User';
import ViewLog from './pages/log/ViewLog';

import Menu from './components/layout/Menu';

const muiTheme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary: {
      light: blue[500],
      main: blue[600],
      dark: blue[700],
      contrastText: '#fff'
    },
    secondary: {
      light: red[600],
      main: red[700],
      dark: red[800],
      contrastText: '#000'
    },
    edit: {
      light: green[500],
      main: green[600],
      dark: green[700],
      contrastText: '#fff'
    }
  }
});

class App extends Component {
  render() {
    return (
      <BrowserRouter basename={process.env.REACT_APP_PUBLIC_URL}>
        <MuiThemeProvider theme={muiTheme}>
          <Menu theme={muiTheme} initialheaderText="Clientes">
            <Switch>
              <Route path="/" exact component={Client} />
              {/*<Route path='/billsReceive' component={BillsReceive} />*/}
              <Route path="/client" component={Client} />
              <Route path="/user" component={User} />
              <Route path="/log" component={ViewLog} />
            </Switch>
          </Menu>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;
