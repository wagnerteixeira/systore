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
    PurchaseDate: new Date(),
    Vendor: '',
    MessageOpen: false,
    VariantMessage: 'success',
    MessageText: '',
    BillsReceive: [],
    InSaving: false,
  };

  handleMessageClose = () => {
    this.setState({ MessageOpen: false });
  };

  handleValueChange = name => event => {
    this.setState({ [name]: event.target.value.toUpperCase() });
  };

  handleOriginalValueChange = event => {
    this.setState({ originalValue: event.target.value });
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
    if (!originalValue || originalValue <= 0)
      message += 'Informe o valor!\n\n';
    if (!this.state.quotas || this.state.quotas <= 0)
      message += 'Informe as parcelas!\n\n';
    if (!this.state.BillsReceive || this.state.BillsReceive.length <= 0)
      message += 'Faça o cálculo das parcelas!\n\n';
    if (!this.state.PurchaseDate) message += 'Informe a data da venda!\n\n';
    if (!this.state.Vendor || this.state.Vendor === '')
      message += 'Informe o vendedor!\n\n';
    return message;
  };

  handleGenerateQuotas = () => {
    if (
      typeof this.state.originalValue === 'string' &&
      this.state.originalValue.length === 0
    )
      return;

    let _originalValue = 0.0;
    if (typeof OriginalValue == 'string') {
      if (this.state.OriginalValue.length > 0)
        _originalValue = accounting.unformat(
          this.state.OriginalValue.replace('.', ',')
        );
    } else _originalValue = this.state.OriginalValue;
    if (_originalValue > 0 && this.state.Quotas > 0) {
      let _quotaValue = accounting.unformat(
        accounting.formatNumber(_originalValue / this.state.Quotas, 1)
      );
      let quotaOfAdjustment =
        _originalValue - (this.state.Quotas - 1) * _quotaValue;
      let quotas = [];
      let i = 0;
      let dueDate = new Date(this.state.PurchaseDate.getTime());
      for (i = 0; i < this.state.Quotas; i++) {
        let originalValue_quota = _quotaValue;
        dueDate.setMonth(dueDate.getMonth() + 1);
        if (i === 0) {
          quotas.push({
            Quota: i + 1,
            DueDate: new Date(dueDate.getTime()),
            OriginalValue: accounting.formatNumber(quotaOfAdjustment),
          });
        } else {
          quotas.push({
            Quota: i + 1,
            DueDate: new Date(dueDate.getTime()),
            OriginalValue: accounting.formatNumber(originalValue_quota),
          });
        }
      }
      this.setState({
        BillsReceive: quotas,
      });
    } else {
      this.setState({
        MessageOpen: true,
        MessageText: 'Informe o valor e a quantidade de parcelas!',
        VariantMessage: 'warning',
      });
    }
  };

  handleSavequotas = clientId => onClose => () => {
    this.setState({ InSaving: true });
<<<<<<< HEAD
    let _original_value = accounting.unformat(
      this.state.originalValue.replace('.', ',')
    );
    let message = this.validadeSavequotas(_original_value);
=======
    let _originalValue = accounting.unformat(
      this.state.OriginalValue.replace('.', ',')
    );
    let message = this.validadeSaveQuotas(_originalValue);
>>>>>>> e8a4538cc4419ce2b86c71d9943182879f98c209
    if (message !== '') {
      this.setState({
        MessageOpen: true,
        MessageText: message,
        VariantMessage: 'warning',
        InSaving: false,
      });
      return;
    }
    let data = {
      ClientId: clientId,
<<<<<<< HEAD
      originalValue: _original_value,
      quotas: this.state.quotas,
=======
      OriginalValue: _originalValue,
      Quotas: this.state.Quotas,
>>>>>>> e8a4538cc4419ce2b86c71d9943182879f98c209
      Vendor: this.state.Vendor,
      PurchaseDate: this.state.PurchaseDate,
      BillReceives: this.state.BillsReceive.map(bills_receive => {
        return {
          ...bills_receive,
          originalValue: accounting.unformat(bills_receive.originalValue),
        };
      }),
    };


    billsReceiveService
      .createBillReceives(data)
      .then(res => {
        console.log(res.data);
        this.setState({
          code: '',
          quotas: 0,
          originalValue: 0.0,
          PurchaseDate: new Date(),
          Vendor: '',
          BillsReceive: [],
          InSaving: false,
        });
        onClose(res.data, 'created');
      })
      .catch(error =>
        this.setState({
          MessageOpen: true,
          MessageText: getErrosFromApi(error),
          VariantMessage: 'error',
          InSaving: false,
        })
      );
  };

  handleCancel = () => {
    this.setState({
      code: '',
      quotas: 0,
      originalValue: 0.0,
      PurchaseDate: new Date(),
      Vendor: '',
      BillsReceive: [],
    });

    this.props.onClose(null, 'cancel');
  };

  /*handleChangeDateInGrid = key => (date, other) => {
    console.log(other);
    let BillsReceive = [...this.state.BillsReceive];
    BillsReceive[key] = { ...BillsReceive[key], dueDate: date };
    this.setState({
      BillsReceive: BillsReceive,
    });
  };*/

  handleChangeDateInGrid = key => date => {
    let dueDate = new Date(date);
    const newBillsReceives = this.state.BillsReceive.map(
      (billReceive, index) => {
        if (parseInt(key) === 0) {
          if (index === 0) return { ...billReceive, DueDate: date };
          else {
            dueDate.setMonth(dueDate.getMonth() + 1);
            return { ...billReceive, DueDate: new Date(dueDate) };
          }
        } else {
          return parseInt(key) === index
            ? { ...billReceive, DueDate: date }
            : billReceive;
        }
      }
    );
    this.setState({
      BillsReceive: newBillsReceives,
    });
  };

  handleValueChangeInGrig = (key, name) => event => {
    let BillsReceive = [...this.state.BillsReceive];
    BillsReceive[key] = {
      ...BillsReceive[key],
      [name]: accounting.formatNumber(
        accounting.unformat(event.target.value.replace('.', ','))
      ),
    };
    this.setState({
      BillsReceive: BillsReceive,
    });
  };

  render() {
    const { open, onClose, classes, clientId } = this.props;

    const {
      originalValue,
      PurchaseDate,
      Vendor,
      quotas,
      BillsReceive,
      MessageOpen,
      VariantMessage,
      MessageText,
    } = this.state;
<<<<<<< HEAD
    let _original_value = '';
    if (typeof originalValue == 'string') {
      if (originalValue.length > 0)
        _original_value = accounting.formatNumber(
          accounting.unformat(originalValue.replace('.', ','))
        );
    } else _original_value = accounting.formatNumber(originalValue);
=======
    let _originalValue = '';
    if (typeof OriginalValue == 'string') {
      if (OriginalValue.length > 0)
        _originalValue = accounting.formatNumber(
          accounting.unformat(OriginalValue.replace('.', ','))
        );
    } else _originalValue = accounting.formatNumber(OriginalValue);
>>>>>>> e8a4538cc4419ce2b86c71d9943182879f98c209
    return (
      <ModalWrapped onClose={onClose} open={open} paperClass={classes.paper}>
        <MessageSnackbar
          onClose={this.handleMessageClose}
          open={MessageOpen}
          variant={VariantMessage}
          message={MessageText}
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
              id="PurchaseDate"
              label="Data da venda"
              className={classes.margin}
              value={PurchaseDate}
              onChpnge={this.handleDateValueChange('PurchaseDate')}
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
              value={Vendor}
              onChange={this.handleValueChange('Vendor')}
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
              {Object.keys(BillsReceive).map(key => (
                <TableRow hover key={key}>
                  <TableCell component="th" scope="row">
                    {BillsReceive[key].Quota}
                  </TableCell>
                  <TableCell align="left">
                    <KeyboardDatePicker
                      id="PurchaseDate"
                      className={classes.margin}
                      value={BillsReceive[key].DueDate}
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
                      value={BillsReceive[key].originalValue}
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
            Iisabled={this.state.InSaving}
            onClick={this.handleSaveQuotas(clientId)(onClose)}
          >
            Salvar
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            Iisabled={this.state.InSaving}
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
