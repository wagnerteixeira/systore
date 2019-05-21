import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  content:{ 
    overflowY: 'hidden' 
  },
  actions: {
      justifyContent: 'center'
  },
  iframe:{ 
    width: '96vw', height: '100vh' 
  },
  buttonClose:{
    width: '100%'
  }
})

function PrintContainer(props) {  
  const { classes, open, setOpen } = props;
  function onClose() {
    setOpen(false);
  }

  return (    
    <Dialog 
      fullScreen 
      scroll='body' 
      open={open} 
      onClose={onClose} 
      aria-labelledby="Impressão"
    >          
      <DialogActions 
        disableActionSpacing
        className={classes.actions}>
        <Button className={classes.buttonClose} onClick={onClose} color="primary">
          Voltar
        </Button>        
      </DialogActions>
      <DialogContent className={classes.content}>
        <iframe className={classes.iframe}
          type='application/pdf' 
          title='Impressão' 
          src={props.src} 
        />
      </DialogContent>      
    </Dialog>    
  );
}

PrintContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  src: PropTypes.string.isRequired
};

export default withStyles(styles)(PrintContainer);
