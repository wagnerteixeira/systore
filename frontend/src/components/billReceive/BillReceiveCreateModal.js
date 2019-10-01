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
    originalValue: 0.0,
    purchaseDate: new Date(),
    vendor: '',
    messageOpen: false,
    variantMessage: 'success',
    messageText: '',
    billsReceive: [],
    inSaving: false,
  };

  handleMessageClose = () => {
    this.setState({ messageOpen: false });
  };

  handleValueChange = name => event => {
    this.setState({ [name]: event.target.value.toUpperCase() });
  };

  handleQuotasChange = event => {
    let _quotas = parseInt(event.target.value);
    if (isNaN(_quotas)) _quotas = 0;
    this.setState({ quotas: _quotas });
  };

  handleOriginalValueChange = event => {
    let _originalValue = 0.0;
    if (typeof event.target.value === 'string') {
      _originalValue = accounting.unformat(
        (_originalValue = event.target.value.replace('.', ','))
      );
    } else _originalValue = event.target.value;

    this.setState({ originalValue: _originalValue });
  };

  handleValueChangeInterest = event => {
    this.setState({
      Interest: event.target.value,
      PayValue:
        parseFloat(this.state.originalValue) + parseFloat(event.target.value),
    });
  };

  handleDateValueChange = name => date => {
    this.setState({ [name]: date });
  };

  validadeSaveQuotas = originalValue => {
    let message = '';
    if (!originalValue || originalValue <= 0) message += 'Informe o valor!\n\n';
    if (!this.state.quotas || this.state.quotas <= 0)
      message += 'Informe as parcelas!\n\n';
    if (!this.state.billsReceive || this.state.billsReceive.length <= 0)
      message += 'Faça o cálculo das parcelas!\n\n';
    if (!this.state.purchaseDate) message += 'Informe a data da venda!\n\n';
    if (!this.state.vendor || this.state.vendor === '')
      message += 'Informe o vendedor!\n\n';
    return message;
  };

  handleGenerateQuotas = e => {
    e.preventDefault();
    e.disabled = true;
    try {
      if (
        typeof this.state.originalValue === 'string' &&
        this.state.originalValue.length === 0
      )
        return;

      let _originalValue = 0.0;
      if (typeof this.state.originalValue == 'string') {
        if (this.state.originalValue.length > 0)
          _originalValue = accounting.unformat(
            this.state.originalValue.replace('.', ',')
          );
      } else _originalValue = this.state.originalValue;
      if (_originalValue > 0 && this.state.quotas > 0) {
        let _quotaValue = accounting.unformat(
          accounting.formatNumber(_originalValue / this.state.quotas, 1)
        );
        let quotaOfAdjustment =
          _originalValue - (this.state.quotas - 1) * _quotaValue;
        let quotas = [];
        let i = 0;
        let dueDate = new Date(this.state.purchaseDate.getTime());
        for (i = 0; i < this.state.quotas; i++) {
          let originalValue_quota = _quotaValue;
          dueDate.setMonth(dueDate.getMonth() + 1);
          if (i === 0) {
            quotas.push({
              quota: i + 1,
              dueDate: new Date(dueDate.getTime()),
              originalValue: accounting.formatNumber(quotaOfAdjustment),
            });
          } else {
            quotas.push({
              quota: i + 1,
              dueDate: new Date(dueDate.getTime()),
              originalValue: accounting.formatNumber(originalValue_quota),
            });
          }
        }
        this.setState({
          billsReceive: quotas,
        });
      } else {
        this.setState({
          messageOpen: true,
          messageText: 'Informe o valor e a quantidade de parcelas!',
          variantMessage: 'warning',
        });
      }
    } finally {
      e.disabled = false;
    }
  };

  handleSaveQuotas = clientId => onClose => () => {
    this.setState({ inSaving: true });
    let _originalValue = this.state.originalValue;
    let message = this.validadeSaveQuotas(_originalValue);
    if (message !== '') {
      this.setState({
        messageOpen: true,
        messageText: message,
        variantMessage: 'warning',
        inSaving: false,
      });
      return;
    }
    console.log();

    let data = {
      ClientId: clientId,
      originalValue: _originalValue,
      quotas: this.state.quotas,
      vendor: this.state.vendor,
      purchaseDate: this.state.purchaseDate,
      billReceives: this.state.billsReceive.map(bills_receive => {
        console.log(bills_receive, typeof bills_receive.dueDate);

        return {
          ...bills_receive,
          dueDate: bills_receive.dueDate.toISOString(),
          originalValue: accounting.unformat(bills_receive.originalValue),
        };
      }),
    };

    console.log(data);

    billsReceiveService
      .createBillReceives(data)
      .then(res => {
        this.setState({
          code: '',
          quotas: 0,
          originalValue: 0.0,
          purchaseDate: new Date(),
          vendor: '',
          billsReceive: [],
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
      originalValue: 0.0,
      purchaseDate: new Date(),
      vendor: '',
      billsReceive: [],
    });

    this.props.onClose(null, 'cancel');
  };

  /*handleChangeDateInGrid = key => (date, other) => {
    console.log(other);
    let billsReceive = [...this.state.billsReceive];
    billsReceive[key] = { ...billsReceive[key], dueDate: date };
    this.setState({
      billsReceive: billsReceive,
    });
  };*/

  handleChangeDateInGrid = key => date => {
    let dueDate = new Date(date);
    const newBillsReceives = this.state.billsReceive.map(
      (billReceive, index) => {
        if (parseInt(key) === 0) {
          if (index === 0) return { ...billReceive, dueDate: date };
          else {
            dueDate.setMonth(dueDate.getMonth() + 1);
            return { ...billReceive, dueDate: new Date(dueDate) };
          }
        } else {
          return parseInt(key) === index
            ? { ...billReceive, dueDate: date }
            : billReceive;
        }
      }
    );
    this.setState({
      billsReceive: newBillsReceives,
    });
  };

  handleValueChangeInGrig = (key, name) => event => {
    let billsReceive = [...this.state.billsReceive];
    billsReceive[key] = {
      ...billsReceive[key],
      [name]: accounting.formatNumber(
        accounting.unformat(event.target.value.replace('.', ','))
      ),
    };
    this.setState({
      billsReceive: billsReceive,
    });
  };

  render() {
    const { open, onClose, classes, clientId } = this.props;
    const {
      originalValue,
      purchaseDate,
      vendor,
      quotas,
      billsReceive,
      messageOpen,
      variantMessage,
      messageText,
    } = this.state;
    let _originalValue = 0.0;
    if (typeof originalValue == 'string') {
      if (originalValue.length > 0)
        _originalValue = accounting.formatNumber(
          accounting.unformat(originalValue.replace('.', ','))
        );
    } else _originalValue = accounting.formatNumber(originalValue);
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
              id="purchaseDate"
              label="Data da venda"
              className={classes.margin}
              value={purchaseDate}
              onChange={this.handleDateValueChange('purchaseDate')}
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
              value={_originalValue}
              onChange={this.handleOriginalValueChange}
              id="originalValue"
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
              onChange={this.handleQuotasChange}
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
              {Object.keys(billsReceive).map(key => (
                <TableRow hover key={key}>
                  <TableCell component="th" scope="row">
                    {billsReceive[key].quota}
                  </TableCell>
                  <TableCell align="left">
                    <KeyboardDatePicker
                      id="purchaseDate"
                      className={classes.margin}
                      value={billsReceive[key].dueDate}
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
                      value={billsReceive[key].originalValue}
                      onChange={this.handleValueChangeInGrig(
                        key,
                        'originalValue'
                      )}
                      id="originalValue"
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
