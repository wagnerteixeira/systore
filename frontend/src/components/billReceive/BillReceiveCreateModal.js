import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

import accounting from 'accounting';

import NumberFormatCustom from '../common/NumberFormatCustom';
import ModalWrapped from '../common/Modal';
import MessageSnackbar from '../common/MessageSnackbar';

import billsReceiveService from '../../services/billsReceiveService';
import { getErrosFromApi } from '../../utils/errorsHelper';

const styles = theme => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    outline: 'none',
    width: theme.spacing(60),
    overflowY: 'auto',
    overflowX: 'hidden',
    maxHeight: '80%',
  },
  margin: {
    margin: theme.spacing(1),
  },
  fab: {
    color: theme.palette.common.white,
  },
  item: {
    padding: `${theme.spacing(1)}px !important`,
  },
  button: {
    margin: theme.spacing(1),
  },
  table: {
    margin: `${theme.spacing(1)}px`,
  },
});

class BillReceiveCreateModal extends React.Component {
  state = {
    code: '',
    quotas: 0,
    original_value: 0.0,
    purchase_date: new Date(),
    vendor: '',
    messageOpen: false,
    variantMessage: 'success',
    messageText: '',
    bills_receives: [],
    inSaving: false,
  };

  handleMessageClose = () => {
    this.setState({ messageOpen: false });
  };

  handleValueChange = name => event => {
    this.setState({ [name]: event.target.value.toUpperCase() });
  };

  handleOriginalValueChange = event => {
    this.setState({ original_value: event.target.value });
  };

  handleValueChangeInterest = event => {
    this.setState({
      interest: event.target.value,
      pay_value:
        parseFloat(this.state.original_value) + parseFloat(event.target.value),
    });
  };

  handleDateValueChange = name => date => {
    this.setState({ [name]: date });
  };

  validadeSaveQuotas = original_value => {
    let message = '';
    if (!original_value || original_value <= 0)
      message += 'Informe o valor!\n\n';
    if (!this.state.quotas || this.state.quotas <= 0)
      message += 'Informe as parcelas!\n\n';
    if (!this.state.bills_receives || this.state.bills_receives.length <= 0)
      message += 'Faça o cálculo das parcelas!\n\n';
    if (!this.state.purchase_date) message += 'Informe a data da venda!\n\n';
    if (!this.state.vendor || this.state.vendor === '')
      message += 'Informe o vendedor!\n\n';
    return message;
  };

  handleGenerateQuotas = () => {
    if (
      typeof this.state.original_value === 'string' &&
      this.state.original_value.length === 0
    )
      return;
    console.log(this.state.original_value);

    let _original_value = 0.0;
    if (typeof original_value == 'string') {
      if (this.state.original_value.length > 0)
        _original_value = accounting.unformat(
          this.state.original_value.replace('.', ',')
        );
    } else _original_value = this.state.original_value;
    if (_original_value > 0 && this.state.quotas > 0) {
      let _quotaValue = accounting.unformat(
        accounting.formatNumber(_original_value / this.state.quotas, 1)
      );
      let quotaOfAdjustment =
        _original_value - (this.state.quotas - 1) * _quotaValue;
      let quotas = [];
      let i = 0;
      let due_date = new Date(this.state.purchase_date.getTime());
      for (i = 0; i < this.state.quotas; i++) {
        let original_value_quota = _quotaValue;
        due_date.setMonth(due_date.getMonth() + 1);
        if (i === 0) {
          quotas.push({
            quota: i + 1,
            due_date: new Date(due_date.getTime()),
            original_value: accounting.formatNumber(quotaOfAdjustment),
          });
        } else {
          quotas.push({
            quota: i + 1,
            due_date: new Date(due_date.getTime()),
            original_value: accounting.formatNumber(original_value_quota),
          });
        }
      }
      this.setState({
        bills_receives: quotas,
      });
    } else {
      this.setState({
        messageOpen: true,
        messageText: 'Informe o valor e a quantidade de parcelas!',
        variantMessage: 'warning',
      });
    }
  };

  handleSaveQuotas = clientId => onClose => () => {
    this.setState({ inSaving: true });
    let _original_value = accounting.unformat(
      this.state.original_value.replace('.', ',')
    );
    let message = this.validadeSaveQuotas(_original_value);
    if (message !== '') {
      this.setState({
        messageOpen: true,
        messageText: message,
        variantMessage: 'warning',
        inSaving: false,
      });
      return;
    }
    let data = {
      original_value: _original_value,
      quotas: this.state.quotas,
      vendor: this.state.vendor,
      purchase_date: this.state.purchase_date,
      bills_receives: this.state.bills_receives.map(bills_receive => {
        return {
          ...bills_receive,
          original_value: accounting.unformat(bills_receive.original_value),
        };
      }),
    };

    billsReceiveService
      .createQuotas(clientId, data)
      .then(res => {
        console.log(res.data);
        this.setState({
          code: '',
          quotas: 0,
          original_value: 0.0,
          purchase_date: new Date(),
          vendor: '',
          bills_receives: [],
          inSaving: false,
        });
        onClose(res.data, 'created');
      })
      .catch(error =>
        this.setState({
          messageOpen: true,
          messageText: getErrosFromApi(error),
          variantMessage: 'error',
          inSaving: false,
        })
      );
  };

  handleCancel = () => {
    this.setState({
      code: '',
      quotas: 0,
      original_value: 0.0,
      purchase_date: new Date(),
      vendor: '',
      bills_receives: [],
    });

    this.props.onClose(null, 'cancel');
  };

  /*handleChangeDateInGrid = key => (date, other) => {
    console.log(other);
    let bills_receives = [...this.state.bills_receives];
    bills_receives[key] = { ...bills_receives[key], due_date: date };
    this.setState({
      bills_receives: bills_receives,
    });
  };*/

  handleChangeDateInGrid = key => date => {
    let due_date = new Date(date);
    const newBillsReceives = this.state.bills_receives.map(
      (billReceive, index) => {
        if (parseInt(key) === 0) {
          if (index === 0) return { ...billReceive, due_date: date };
          else {
            due_date.setMonth(due_date.getMonth() + 1);
            return { ...billReceive, due_date: new Date(due_date) };
          }
        } else {
          return parseInt(key) === index
            ? { ...billReceive, due_date: date }
            : billReceive;
        }
      }
    );
    this.setState({
      bills_receives: newBillsReceives,
    });
  };

  handleValueChangeInGrig = (key, name) => event => {
    let bills_receives = [...this.state.bills_receives];
    bills_receives[key] = {
      ...bills_receives[key],
      [name]: accounting.formatNumber(
        accounting.unformat(event.target.value.replace('.', ','))
      ),
    };
    this.setState({
      bills_receives: bills_receives,
    });
  };

  render() {
    const { open, onClose, classes, clientId } = this.props;

    const {
      original_value,
      purchase_date,
      vendor,
      quotas,
      bills_receives,
      messageOpen,
      variantMessage,
      messageText,
    } = this.state;
    let _original_value = '';
    if (typeof original_value == 'string') {
      if (original_value.length > 0)
        _original_value = accounting.formatNumber(
          accounting.unformat(original_value.replace('.', ','))
        );
    } else _original_value = accounting.formatNumber(original_value);
    return (
      <ModalWrapped onClose={onClose} open={open} paperClass={classes.paper}>
        <MessageSnackbar
          onClose={this.handleMessageClose}
          open={messageOpen}
          variant={variantMessage}
          message={messageText}
        />
        <Grid className={classes.itens} container spacing={3}>
          <Grid
            className={classes.item}
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
          >
            <Typography align="center" variant="h6">
              INCLUSÃO DE TÍTULOS
            </Typography>
          </Grid>
          <Grid
            className={classes.item}
            item
            xs={12}
            sm={4}
            md={4}
            lg={4}
            xl={4}
          >
            <KeyboardDatePicker
              id="purchase_date"
              label="Data da venda"
              className={classes.margin}
              value={purchase_date}
              onChange={this.handleDateValueChange('purchase_date')}
              margin="normal"
              format={'dd/MM/yyyy'}
              fullWidth
              cancelLabel={'Cancelar'}
              showTodayButton
              todayLabel={'Hoje'}
            />
          </Grid>
          <Grid
            className={classes.item}
            item
            xs={12}
            sm={3}
            md={3}
            lg={3}
            xl={3}
          >
            <TextField
              className={classes.margin}
              label="Valor"
              value={_original_value}
              onChange={this.handleOriginalValueChange}
              id="original_value"
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
          </Grid>
          <Grid
            className={classes.item}
            item
            xs={12}
            sm={3}
            md={3}
            lg={3}
            xl={3}
          >
            <TextField
              id="quotas"
              label="Parcelas"
              className={classes.margin}
              value={quotas === 0 ? '' : quotas}
              onChange={this.handleValueChange('quotas')}
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid
            container
            alignItems="center"
            justify="center"
            className={classes.item}
            item
            xs={12}
            sm={2}
            md={2}
            lg={2}
            xl={2}
          >
            <Tooltip
              title="Gerar parcelas"
              placement={'bottom-start'}
              enterDelay={300}
            >
              <Fab
                color="primary"
                aria-label="Gerar parcelas"
                size="small"
                onClick={this.handleGenerateQuotas}
              >
                <AttachMoneyIcon />
              </Fab>
            </Tooltip>
          </Grid>
          <Grid
            className={classes.item}
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
          >
            <TextField
              id="vendor"
              label="Nome do vendedor"
              className={classes.margin}
              value={vendor}
              onChange={this.handleValueChange('vendor')}
              fullWidth
            />
          </Grid>
        </Grid>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Parcela</TableCell>
                <TableCell align="left">Vencimento</TableCell>
                <TableCell align="left">Valor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(bills_receives).map(key => (
                <TableRow hover key={key}>
                  <TableCell component="th" scope="row">
                    {bills_receives[key].quota}
                  </TableCell>
                  <TableCell align="left">
                    <KeyboardDatePicker
                      id="purchase_date"
                      className={classes.margin}
                      value={bills_receives[key].due_date}
                      onChange={this.handleChangeDateInGrid(key)}
                      margin="normal"
                      format={'dd/MM/yyyy'}
                      fullWidth
                      cancelLabel={'Cancelar'}
                      showTodayButton
                      todayLabel={'Hoje'}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <TextField
                      className={classes.margin}
                      value={bills_receives[key].original_value}
                      onChange={this.handleValueChangeInGrig(
                        key,
                        'original_value'
                      )}
                      id="original_value"
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <div>
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            disabled={this.state.inSaving}
            onClick={this.handleSaveQuotas(clientId)(onClose)}
          >
            Salvar
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            disabled={this.state.inSaving}
            className={classes.button}
            onClick={this.handleCancel}
          >
            Cancelar
          </Button>
        </div>
      </ModalWrapped>
    );
  }
}

BillReceiveCreateModal.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  clientId: PropTypes.string.isRequired,
};

export default withStyles(styles)(BillReceiveCreateModal);
