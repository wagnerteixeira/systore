import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { blue, red, green } from '@material-ui/core/colors';
import './App.css';


import Menu from './components/layout/Menu';

const muiTheme = createMuiTheme({
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary: {
      light: blue[500],
      main: blue[600],
      dark: blue[700],
      contrastText: '#fff',
    },
    secondary: {
      light: red[600],
      main: red[700],
      dark: red[800],
      contrastText: '#000',
    },     
    buttonEdit: {
      light: green[500],
      main: green[600],
      dark: green[700],
      contrastText: '#fff',
    }
  } 
});


const BillsReceive = () => (
  <div>
    <h2>Títulos</h2>
  </div>
);

const Client = () => (
  <div>
    <h2>Clientes</h2>
  </div>
);

const User = () => (
  <div>
    <h2>Usuários</h2>
  </div>
);

class App extends Component {
  render() {
    return (      
      <Router>  
        <MuiThemeProvider theme={muiTheme}>
          <Menu theme={muiTheme} initialheaderText='Agenda'>        
            <Switch>
              <Route path="/" exact component={BillsReceive} />
              <Route path="/client" component={Client} />
              <Route path="/user" component={User} />
            </Switch>          
          </Menu>        
        </MuiThemeProvider>      
      </Router>
    );
  }
}

export default App;
