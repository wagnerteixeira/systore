import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';
import MessageSnackbar from '../../components/common/MessageSnackbar';
import { Grid, Button, Paper } from '@material-ui/core';

import PrintContainer from '../../components/common/PrintContainer';
import { getCurrentDate, getDateToStringUrl } from '../../utils/operators';
import { KeyboardDatePicker } from '@material-ui/pickers';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    padding: theme.spacing(2),
  },
  fab: {
    margin: theme.spacing(1),
  },
  radioGroup: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(4),
  },
  button: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  tableHeight: {
    overflowY: 'scroll',
  },
  buttonCntainer: {
    paddingTop: theme.spacing(2),
  },
  radioGroupContainer: {
    paddingLeft: '0px !important',
    paddingRight: '0px !important',
  },
}));

function PrintDefaulters(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [srcIframe, setSrcIframe] = useState('');
  const [initialDate, setInitialDate] = useState(getCurrentDate());
  const [finalDate, setFinalDate] = useState(getCurrentDate());
  const [message, setMessage] = useState({
    messageOpen: false,
    variantMessage: 'success',
    messageText: '',
  });

  async function handlePrint() {
    setSrcIframe(
      `https://localhost:5001/api/Print/printer?name=RelatoriosInadimplentes&initialDate=${getDateToStringUrl(
        initialDate
      )}&finalDate=${getDateToStringUrl(finalDate)}`
    );
    setOpen(true);
  }

  return (
    <>
      <Paper className={classes.root}>
        <MessageSnackbar
          onClose={() => setMessage({ ...message, messageOpen: false })}
          open={message.messageOpen}
          variant={message.variantMessage}
          message={message.messageText}
        />
        <Grid container spacing={5} direction="row">
          <Grid
            className={classes.item}
            item
            xs={12}
            sm={6}
            md={3}
            lg={3}
            xl={3}
          >
            <KeyboardDatePicker
              id="initialDate"
              label="Data inicial"
              className={classes.textField}
              value={initialDate}
              onChange={value => setInitialDate(value)}
              margin="normal"
              format={'dd/MM/yyyy'}
              fullWidth
            />
          </Grid>
          <Grid
            className={classes.item}
            item
            xs={12}
            sm={6}
            md={3}
            lg={3}
            xl={3}
          >
            <KeyboardDatePicker
              id="finalDate"
              label="Data final"
              className={classes.textField}
              value={finalDate}
              onChange={value => setFinalDate(value)}
              margin="normal"
              format={'dd/MM/yyyy'}
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container spacing={5} direction="row">
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={4}
            xl={4}
            className={classes.buttonCntainer}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={handlePrint}
              className={classes.button}
              disabled={open}
            >
              Imprimir
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <PrintContainer
        base64={true}
        open={open}
        setOpen={setOpen}
        src={srcIframe}
        waitMessage="Aguarde, gerando relatório..."
      />
    </>
  );
}

PrintDefaulters.propTypes = {};

export default PrintDefaulters;
