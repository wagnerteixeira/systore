import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ptLocale from 'date-fns/locale/pt-BR';
import './App.css';

import { axiosOApi } from './services/axios';

import MessageSnackbar from './components/common/MessageSnackbar';
import Menu from './components/layout/Menu';

import MuiTheme from './config/theme';

import BillsReceive from './pages/billReceive/BillReceive';
import Client from './pages/client/Client';
import Product from './pages/product/Product';
import Sale from './pages/sale/Sale';
import User from './pages/user/User';
import ViewLog from './pages/log/ViewLog';
import Login from './pages/user/Login';
import BalanceLoad from './pages/balanceLoad/BalanceLoad';
import PrintDefaulters from './pages/reports/PrintDefaulters';

import localStorageService from './localStorage/localStorageService';

const theme = MuiTheme;

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
      messageText: '',
    };
  }

  handleLogout = () => {
    localStorageService.setItem('token', '');
    this.setState({
      logged: false,
      messageOpen: true,
      messageText: 'Usuário saiu do sistema.',
      variantMessage: 'success',
    });
  };

  handleLogin = async () => {
    let user = {
      username: this.state.userName,
      password: this.state.password,
    };

    try {
      const res = await axiosOApi.post('/login', user);
      if (res.data.errors) {
        let errors = res.data.errors.join('\n');
        this.setState({
          logged: false,
          messageOpen: true,
          messageText: errors,
          variantMessage: 'error',
        });
      } else {
        this.setState({
          logged: true,
          messageOpen: true,
          showPassword: false,
          messageText: 'Usuário logado com sucesso!',
          variantMessage: 'success',
          userName: '',
          password: '',
          user: res.data.user,
        });
        localStorageService.setItem('token', res.data.token);
      }
    } catch (e) {
      let errors = e.response.data.errors
        ? e.response.data.errors.join('\n')
        : 'Verifique usuário e/ou senha!';
      this.setState({
        logged: false,
        messageOpen: true,
        messageText: errors,
        variantMessage: 'error',
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

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  render() {
    const {
      userName,
      password,
      messageOpen,
      messageText,
      variantMessage,
      logged,
      user,
    } = this.state;
    if (!logged) {
      let _token = localStorageService.getItem('token');
      if (_token) {
        axiosOApi.post('/validateToken', `"${_token}"`).then(res => {
          if (res.data.valid) {
            this.setState({ logged: true, user: res.data.user });
          }
        });
      }
    }
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptLocale}>
        <BrowserRouter basename={process.env.REACT_APP_PUBLIC_URL}>
          <MuiThemeProvider theme={theme}>
            {!logged ? (
              <Login
                handleLogin={this.handleLogin}
                handleValueChange={this.handleValueChange}
                handleMessageClose={this.handleMessageClose}
                showPassword={this.state.showPassword}
                handleClickShowPassword={this.handleClickShowPassword}
                keyPress={this.keyPress}
                password={password}
                userName={userName}
                messageOpen={messageOpen}
                variantMessage={variantMessage}
                messageText={messageText}
              />
            ) : (
              <Menu
                theme={theme}
                user={user}
                handleLogout={this.handleLogout}
                initialheaderText="Clientes"
              >
                <Switch>
                  <Route path="/billsReceive" component={BillsReceive} />
                  <Route path="/client" component={Client} />
                  <Route path="/product" component={Product} />
                  <Route path="/sale" component={Sale} />
                  <Route path="/user" component={User} />
                  <Route path="/balance-load" component={BalanceLoad} />
                  <Route path="/print-defaulters" component={PrintDefaulters} />
                  {user.admin && <Route path="/log" component={ViewLog} />}
                  <Redirect from="*" to="/billsReceive" />
                </Switch>
              </Menu>
            )}
            <MessageSnackbar
              onClose={this.handleMessageClose}
              open={messageOpen}
              variant={variantMessage}
              message={messageText}
            />
          </MuiThemeProvider>
        </BrowserRouter>
      </MuiPickersUtilsProvider>
    );
  }
}

export default App;
