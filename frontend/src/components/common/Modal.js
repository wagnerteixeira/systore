import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

const styles = theme => ({
  paper:{
    position: 'absolute',    
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),    
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    outline: 'none',
    width: theme.spacing(60),
  },  
});


const ModalWrapped = props => {
    const { paperClass, onClose, open, children } = props;
    return (        
        <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={onClose}
        >
            <div className={paperClass}>            
                {children}            
            </div>
        </Modal>        
    );
}

ModalWrapped.propTypes = {
  paperClass: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default withStyles(styles)(ModalWrapped);