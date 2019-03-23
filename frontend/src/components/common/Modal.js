import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,    
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)'
  },
});


const ModalWrapped = props => {
    const { classes, handleClose, open, children } = props;
    return (        
        <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={handleClose}
        >
            <div className={classes.paper}>            
                {children}            
            </div>
        </Modal>        
    );
}

ModalWrapped.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default withStyles(styles)(ModalWrapped);