import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

const internalHandleClose = props => (event, reason) => {
  if (reason === 'clickaway') {
      return;
  }

  props.onClose();
};

function MessageSnackbar(props) {
    const { classes, open, message, variant, ...other } = props;
    const Icon = variantIcon[variant];
    return (
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={open}
          autoHideDuration={3000}
          onClose={internalHandleClose(props)}
        >
            <SnackbarContent
                className={classNames(classes[variant], classes.margin)}
                aria-describedby="client-snackbar"
                message={
                    <span id="client-snackbar" className={classes.message}>
                    <Icon className={classNames(classes.icon, classes.iconVariant)} />
                    {message}
                    </span>
                }
                action={[
                    <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.close}
                    onClick={internalHandleClose(props)}
                    >
                    <CloseIcon className={classes.icon} />
                    </IconButton>,
                ]}
                {...other}
            />
        </Snackbar>
    );
}

MessageSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  teste: PropTypes.func,
  open: PropTypes.bool.isRequired, 
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
  message: PropTypes.string.isRequired,  
};

export default withStyles(styles)(MessageSnackbar);
