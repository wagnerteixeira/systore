import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { blue, red, green } from '@material-ui/core/colors';
import './App.css';

import { axiosOApi } from './services/axios';

import MessageSnackbar from './components/common/MessageSnackbar';

import BillsReceive from './pages/billReceive/BillReceive';
import Client from './pages/client/Client';
import User from './pages/user/User';
import ViewLog from './pages/log/ViewLog';
import Login from './pages/user/Login';

import localStorageService from './localStorage/localStorageService';

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
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      userName: '',
      password: '',
      logged: false,
      messageOpen: false,
      variantMessage: 'success',
      messageText: ''
    };
  }

  handleLogout = () => {
    localStorageService.setItem('token', '');
    this.setState({
      logged: false,
      messageOpen: true,
      messageText: 'Usuário saiu do sistema.',
      variantMessage: 'success'
    });
  };

  handleLogin = async () => {
    let user = {
      user_name: this.state.userName,
      password: this.state.password
    };

    try {
      const res = await axiosOApi.post('/login', user);
      if (res.data.errors) {
        let errors = res.data.errors.join('\n');
        this.setState({
          logged: false,
          messageOpen: true,
          messageText: errors,
          variantMessage: 'error'
        });
      } else {
        this.setState({
          logged: true,
          messageOpen: true,
          messageText: 'Usuário logado com sucesso!',
          variantMessage: 'success',
          userName: '',
          password: '',
          user: res.data.user
        });
        localStorageService.setItem('token', res.data.token);
      }
    } catch (e) {
      console.log(e);
      let errors = e.response.data.errors
        ? e.response.data.errors.join('\n')
        : 'Verifique usuário e/ou senha!';
      this.setState({
        logged: false,
        messageOpen: true,
        messageText: errors,
        variantMessage: 'error'
      });
    }
  };

  handleMessageClose = () => {
    this.setState({ messageOpen: false });
  };

  keyPress = e => {
    if (e.keyCode === 13) {
      this.handleLogin();
    }
  };

  handleValueChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    const {
      userName,
      password,
      messageOpen,
      messageText,
      variantMessage,
      logged,
      user
    } = this.state;

    if (!logged) {
      let _token = localStorageService.getItem('token');
      if (_token) {
        axiosOApi.post('/validateToken', { token: _token }).then(res => {
          if (res.data.valid) {
            this.setState({ logged: true, user: res.data.user });
          }
        });
      }
    }
    return (
      <BrowserRouter basename={process.env.REACT_APP_PUBLIC_URL}>
        <MuiThemeProvider theme={muiTheme}>
          {!logged ? (
            <Login
              handleLogin={this.handleLogin}
              handleValueChange={this.handleValueChange}
              handleMessageClose={this.handleMessageClose}
              keyPress={this.keyPress}
              password={password}
              userName={userName}
              messageOpen={messageOpen}
              variantMessage={variantMessage}
              messageText={messageText}
            />
          ) : (
            <Menu
              theme={muiTheme}
              user={user}
              handleLogout={this.handleLogout}
              initialheaderText="Clientes"
            >
              <Switch>
                <Route path="/billsReceive" component={BillsReceive} />
                <Route path="/client" component={Client} />
                <Route path="/user" component={User} />
                {user.admin && <Route path="/log" component={ViewLog} />}
                <Redirect from="*" to="/billsReceive" />
              </Switch>
            </Menu>
          )}
          <MessageSnackbar
            handleClose={this.handleMessageClose}
            open={messageOpen}
            variant={variantMessage}
            message={messageText}
          />
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;
