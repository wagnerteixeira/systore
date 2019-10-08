import React from 'react';
import PropTypes from 'prop-types';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import config from '../../config/config.json';
import {
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Input,
} from '@material-ui/core';

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    margin: theme.spacing(1),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  grow: {
    flexGrow: 1,
  },
  divPadding: {
    paddingTop: theme.spacing(15),
  },
  headerToolbar: {
    display: 'flex',
    flexDirection: 'row',
  },
});

function Login(props) {
  const {
    showPassword,
    classes,
    userName,
    password,
    handleLogin,
    handleValueChange,
    handleClickShowPassword,
    keyPress,
  } = props;
  return (
    <div>
      <AppBar position="static">
        <Toolbar className={classes.headerToolbar}>
          <Typography
            variant="h6"
            align="center"
            color="inherit"
            className={classes.grow}
          >
            Entre com seu usuário e senha
          </Typography>
          <Typography variant="caption">{config.version}</Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.divPadding} />
      <div className={classes.container}>
        <TextField
          id="userName"
          label="Usuário"
          value={userName}
          className={classes.textField}
          placeholder="Nome do usuário"
          fullWidth
          onChange={handleValueChange('userName')}
          margin="normal"
          onKeyDown={keyPress}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControl
          margin="normal"
          required
          fullWidth
          className={classes.textField}
        >
          <InputLabel htmlFor="password" shrink={true}>
            Senha
          </InputLabel>
          <Input
            name="password"
            autoComplete="current-password"
            id="password"
            value={password}
            type={showPassword ? 'text' : 'password'}
            onChange={handleValueChange('password')}
            fullWidth
            placeholder="Senha"
            onKeyDown={keyPress}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={handleClickShowPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => handleLogin()}
        >
          Entrar
        </Button>
      </div>
    </div>
  );
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  handleLogin: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

export default withStyles(styles)(Login);
