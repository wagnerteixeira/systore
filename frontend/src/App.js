import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { blue, red, green } from '@material-ui/core/colors';
import './App.css';

import Client from './pages/client/Client';

import clientService from './services/clientService';
import billsReceiveService from './services/billsReceiveService';


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
    edit: {
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

const User = () => (
  <div>
    <h2>Usuários</h2>
  </div>
);

class App extends Component {
    render() {
      //console.log(muiTheme);
      /*clientService.get('5c5fbe893c498528a588ab16').then( (res) => console.log(res.data));
      clientService.getAll(5878, 10).then( (res) => console.log(res.data));
      clientService.count().then( (res) => console.log(res.data));

      billsReceiveService.count().then( (res) => console.log(res.data));
      billsReceiveService.getAll(5878, 10).then( (res) => console.log(res.data));
      billsReceiveService.getBillsReceiveServiceByClient('5c5fbe893c498528a588ab16').then( (res) => console.log(res.data));
      billsReceiveService.getBillsReceiveServiceByClientPaid('5c5fbe893c498528a588ab16').then( (res) => console.log(res.data));
      billsReceiveService.getBillsReceiveServiceByClientNoPaid('5c5fbe893c498528a588ab16').then( (res) => console.log(res.data));*/
      
      return (      
        <BrowserRouter basename={process.env.REACT_APP_PUBLIC_URL}>  
          <MuiThemeProvider theme={muiTheme}>
            <Menu theme={muiTheme} initialheaderText='Agenda'>        
              <Switch>
                <Route path='/' exact component={BillsReceive} />
                <Route path='/client' component={Client} />
                <Route path='/user' component={User} />
              </Switch>          
            </Menu>        
          </MuiThemeProvider>      
        </BrowserRouter>
      );
  }
}

export default App;
