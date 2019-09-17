import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Grid,
  Dialog,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  content: {
    overflowY: 'hidden',
  },
  actions: {
    justifyContent: 'center',
  },
  iframe: {
    width: '96vw',
    height: '100vh',
  },
  buttonClose: {
    width: '100%',
  },
  display: {
    display: props => (props.loaded ? 'block' : 'none'),
  },
}));

function PrintContainer(props) {
  const { open, setOpen, waitMessage } = props;
  const [loaded, setLoaded] = useState(false);

  const classes = useStyles({ loaded });

  function onClose() {
    setOpen(false);
    setLoaded(false);
  }

  function renderLoading() {
    return (
      !loaded && (
        <Grid
          container
          justify="center"
          alignItems="center"
          direction="column"
          className={classes.containerLoading}
        >
          <Grid item style={{ margin: 20 }}>
            <Typography variant="h4" gutterBottom color="primary">
              {waitMessage}
            </Typography>
          </Grid>
          <Grid item>
            <CircularProgress size={40} />
          </Grid>
        </Grid>
      )
    );
  }

  return (
    open && (
      <>
        {renderLoading()}
        <Dialog
          fullScreen
          scroll="paper"
          open={open}
          style={{ display: !loaded ? 'none' : 'block' }}
          onClose={onClose}
          aria-labelledby="Impressão"
        >
          <DialogActions disableActionSpacing className={classes.actions}>
            <Button
              className={classes.buttonClose}
              onClick={onClose}
              color="primary"
            >
              Voltar
            </Button>
          </DialogActions>
          <DialogContent className={classes.content}>
            <iframe
              className={classes.iframe}
              onLoadStart={() => setLoaded(false)}
              onLoad={() => setLoaded(true)}
              type="application/pdf"
              title="Impressão"
              src={props.src}
            />
          </DialogContent>
        </Dialog>
      </>
    )
  );
}

PrintContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  src: PropTypes.string.isRequired,
};

export default PrintContainer;
