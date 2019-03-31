import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import ptLocale from 'date-fns/locale/pt-BR';

import MessageSnackbar from '../../components/common/MessageSnackbar';
import NumberFormatCustom from '../../components/common/NumberFormatCustom';
import ModalWrapped from '../../components/common/Modal';
import { getDateToString } from '../../utils/operators';

import billsReceiveservice from '../../services/billsReceiveService';

const styles = theme => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 2,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    outline: 'none',
    width: theme.spacing.unit * 60
  },
  button: {
    margin: theme.spacing.unit
  }
});

class BillReceiveEditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageOpen: false,
      variantMessage: 'success',
      messageText: '',
      data: {
        _id: props.bill._id,
        client: props.bill.client,
        code: props.bill.code,
        quota: props.bill.quota,
        original_value: props.bill.original_value['$numberDecimal'],
        interest: props.bill.interest['$numberDecimal'],
        final_value: props.bill.final_value['$numberDecimal'],
        purchase_date: props.bill.purchase_date,
        due_date: props.bill.due_date,
        pay_date: props.bill.pay_date,
        days_delay: props.bill.days_delay,
        situation: props.bill.situation,
        vendor: props.bill.vendor
      }
    };
    this._handleKeyPress = this._handleKeyPress.bind(this);
  }

  handleMessageClose = () => {
    this.setState({ messageOpen: false });
  };

  handleValueChangeBill = name => event => {
    this.setState({ data: { ...this.state.data, [name]: event.target.value } });
  };

  handleValueChangeInterestBill = event => {
    this.setState({
      data: {
        ...this.state.data,
        interest: event.target.value,
        final_value:
          parseFloat(this.state.data.original_value) +
          parseFloat(event.target.value)
      }
    });
  };

  handleDateValueChangeBill = name => date => {
    this.setState({ data: { ...this.state.data, [name]: date } });
  };

  validadePay = () => {
    let message = '';
    if (!this.state.data.final_value || this.state.data.final_value <= 0)
      message += 'Informe o valor pago!\n\n';
    if (!this.state.data.pay_date) message += 'Informe a data de pagamento!\n\n';
    return message;
  };

  handleSaveBillReceive = data => {
    let message = this.validadePay();
    if (message !== '') {
      this.setState({
        messageOpen: true,
        messageText: message,
        variantMessage: 'warning'
      });
      return;
    }
    billsReceiveservice
      .update(data)
      .then(() => {
        this.setState({
          messageOpen: true,
          messageText: 'Titulo pago com sucesso!',
          variantMessage: 'warning'
        });
        this.props.handleSave('saved');
      })
      .catch(error => console.log(error.response));
  };

  _handleKeyPress(e, field) {
    // If enter key is pressed, focus next input field.
    if (e.keyCode === 13) {
      e.preventDefault();
      let next = this.refs[field.name].nextSibling;
      if (next && next.tagName === "INPUT") {
        this.refs[field.id].nextSibling.focus();
      }
    }
  }
    
  componentDidMount() {
    for (let x in this.refs) {
      this.refs[x].onkeypress = (e) => 
        this._handleKeyPress(e, this.refs[x]);
    }    
    //this.refs.pay_date.focus();
  }
  

  render() {
    const { open, handleClose, classes } = this.props;

    const { data, messageOpen, variantMessage, messageText } = this.state;

    let _original_value = parseFloat(data.original_value)
      .toFixed(2)
      .replace('.', ',');
    let _final_value = parseFloat(data.final_value)
      .toFixed(2)
      .replace('.', ',');
    let _interest_value = parseFloat(data.interest)
      .toFixed(2)
      .replace('.', ',');

    return (
      <ModalWrapped
        handleClose={handleClose}
        open={open}
        paperClass={classes.paper}
      >
        <MessageSnackbar
          handleClose={this.handleMessageClose}
          open={messageOpen}
          variant={variantMessage}
          message={messageText}
        />
        <Grid className={classes.itens} container spacing={24}>
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
              PAGAMENTO DE TÍTULO
            </Typography>
          </Grid>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptLocale}>
            <Grid
              className={classes.item}
              item
              xs={12}
              sm={4}
              md={4}
              lg={4}
              xl={4}
            >
              <TextField
                id="purchase_date"
                label="Data da venda"
                className={classes.textField}
                value={getDateToString(data.purchase_date)}
                margin="normal"
                fullWidth
                InputProps={{
                  readOnly: true
                }}
              />
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
              <TextField
                id="due_date"
                label="Data de vencimento"
                className={classes.textField}
                value={getDateToString(data.due_date)}
                margin="normal"
                fullWidth
                InputProps={{
                  readOnly: true
                }}
              />
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
              <DatePicker
                id="pay_date"
                label="Data de Pagamento"
                className={classes.textField}
                value={data.pay_date}
                onChange={this.handleDateValueChangeBill('pay_date')}
                margin="normal"
                format={'dd/MM/yyyy'}
                fullWidth
                ref="pay_date"
              />
            </Grid>
          </MuiPickersUtilsProvider>
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
              className={classes.textField}
              value={data.vendor}
              onChange={this.handleValueChangeBill('vendor')}
              margin="normal"
              InputProps={{
                readOnly: true
              }}
              fullWidth
            />
          </Grid>
          <Grid
            className={classes.item}
            item
            xs={12}
            sm={6}
            md={6}
            lg={6}
            xl={6}
          >
            <TextField
              id="code"
              label="Código"
              className={classes.textField}
              value={data.code}
              onChange={this.handleValueChangeBill('code')}
              margin="normal"
              InputProps={{
                readOnly: true
              }}
              fullWidth
            />
          </Grid>
          <Grid
            className={classes.item}
            item
            xs={12}
            sm={6}
            md={6}
            lg={6}
            xl={6}
          >
            <TextField
              id="quota"
              label="Parcela"
              className={classes.textField}
              value={data.quota}
              onChange={this.handleValueChangeBill('quota')}
              margin="normal"
              InputProps={{
                readOnly: true
              }}
              fullWidth
            />
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
            <TextField
              id="original_value"
              label="Valor"
              className={classes.textField}
              value={_original_value}
              onChange={this.handleValueChangeBill('original_value')}
              margin="normal"
              fullWidth
              InputProps={{
                inputComponent: NumberFormatCustom,
                readOnly: true
              }}
            />
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
            <TextField
              id="interest"
              label="Juros"
              className={classes.textField}
              value={_interest_value}
              onChange={this.handleValueChangeInterestBill}
              margin="normal"
              fullWidth
              InputProps={{
                inputComponent: NumberFormatCustom
              }}
              ref="interest"
            />
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
            <TextField
              id="final_value"
              label="Valor pago"
              className={classes.textField}
              value={_final_value}
              onChange={this.handleValueChangeBill('final_value')}
              margin="normal"
              fullWidth
              InputProps={{
                inputComponent: NumberFormatCustom
              }}
              ref="final_value"
            />
          </Grid>
        </Grid>
        <div>
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={() => this.handleSaveBillReceive(this.state.data)}
          >
            Salvar
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            className={classes.button}
            onClick={handleClose}
          >
            Cancelar
          </Button>
        </div>
      </ModalWrapped>
    );
  }
}

BillReceiveEditModal.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  bill: PropTypes.object.isRequired
};

export default withStyles(styles)(BillReceiveEditModal);
