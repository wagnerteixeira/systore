import React from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { withStyles } from '@material-ui/core/styles';

import muiTheme from '../../config/theme';

const theme = muiTheme;

const styles = theme => ({
  container: {
    marginTop: theme.spacing.unit * 3,
    display: 'block',
    padding: theme.spacing.unit * 5,
    width: theme.spacing.unit * 70,
   /* borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: theme.palette.primary.main,*/
  },
  title:{
    margin: theme.spacing.unit,
    marginLeft: 0,
  },
  button: {
    margin: theme.spacing.unit,
    marginLeft: 0,
  }
});

function Message(props) {
  const {classes}  = props;
  return (
    <Paper className={classes.container}  elevation={1}>
      <Typography className={classes.title} variant="h5" component="h3">{props.title}</Typography>
      <Typography component="p">{
        props.message.split('<br/>').map((line, index) => {
          return(
            <>
              {line} <br/>
            </>
          )
        }) }</Typography>               
      <Button
        className={classes.button}
        variant="outlined"
        color="primary"
        onClick={() => {
          props.onYes();
          props.onClose();
        }}
      >
        Sim
      </Button>
      <Button className={classes.button} variant="outlined"
              color="secondary" onClick={props.onClose}>Não</Button>
    </Paper>
  )
}

const ConfirmBody = withStyles(styles)(Message);

const Confirm = (title, message, onYes) => {
 confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className='custom-ui'>
          <MuiThemeProvider theme={theme}>
            <ConfirmBody title={title} message={message} onClose={onClose} onYes={onYes} />
          </MuiThemeProvider>
        </div>
      );
    }
  });
}


export default Confirm;