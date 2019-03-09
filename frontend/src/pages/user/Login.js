import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    margin: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300
  },
  grow: {
    flexGrow: 1,
  },
  divPadding: {
    paddingTop: theme.spacing.unit * 15
  }

});


function Login(props){
  const { classes, 
          userName, 
          password, 
          handleLogin, 
          handleValueChange,
          keyPress
        } = props;        
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant='h6' align='center' color="inherit" className={classes.grow}>
            Entre com seu usuário e senha
          </Typography>        
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
        <TextField
          id="password"
          label="Senha"
          value={password}
          className={classes.textField}
          type="password"
          onChange={handleValueChange('password')}
          autoComplete="current-password"
          fullWidth
          placeholder="Senha"
          margin="normal"
          onKeyDown={keyPress}
          InputLabelProps={{
            shrink: true,
          }}
        />
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