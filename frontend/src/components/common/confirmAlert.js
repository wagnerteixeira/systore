import React from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { blue, red, green } from '@material-ui/core/colors';

import { withStyles } from '@material-ui/core/styles';

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

const styles = theme => ({
  container: {
    marginTop: theme.spacing.unit * 3,
    display: 'block',
    padding: theme.spacing.unit * 10,
    width: theme.spacing.unit * 70
  }
});

function _Teste(props) {
  const {classes}  = props;
  return (
    <Paper className={classes.container}  elevation={1}>
      <Typography variant="h5" component="h3">Atenção</Typography>
      <Typography component="p">Confirma a exclusão?</Typography>          
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          props.onDelete();
          props.onClose();
        }}
      >
        Sim
      </Button>
      <Button variant="outlined"
              color="secondary" onClick={props.onClose}>Não</Button>
    </Paper>
  )
}

const Teste = withStyles(styles)(_Teste);

const submit = (onDelete) => {
 confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className='custom-ui'>
          <MuiThemeProvider theme={muiTheme}>
            <Teste onClose={onClose} onDelete={onDelete} />
          </MuiThemeProvider>
        </div>
      );
    }
  });
}


export default submit;