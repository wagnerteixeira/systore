import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import ptLocale from "date-fns/locale/pt-BR";

import ModalWrapped from '../../components/common/Modal';

const styles = theme => ({
  paper:{
    position: 'absolute',    
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 2,    
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    outline: 'none',
    width: theme.spacing.unit * 60,
  },  
});

class BillReceiveEditModal extends React.Component {

  state = {
    bill: {
      _id : '',
      client: '',
      code: '',
      quota: '', 
      original_value: 0,
      interest: 0,
      final_value: 0,
      purchase_date: null,
      due_date: null,
      pay_date: null,
      days_delay: 0,
      situation: "O",
      vendor: "",
    }
  }

  handleValueChange = name => event => {
    this.setState({ bill: { ...this.state.bill, [name]: event.target.value}})
  };  

  handleValueChangeInterest = event => {
    this.setState({ bill: { ...this.state.bill, interest: event.target.value, pay_value: parseFloat(this.state.bill.original_value) + parseFloat(event.target.value)}})
  }

  handleDateValueChange = name => date => {
    this.setState({ bill: { ...this.state.bill, [name]: date}});
  }

  render() {

    const {
      bill,
      labelAcao,
    } = this.state

    const {
      open,
      handleClose,
      classes
    } = this.props

    return (
      <ModalWrapped
        handleClose={handleClose}
        open={open}   
        paperClass={classes.paper}
      >        
          <Grid className={classes.itens} container spacing={24}>
            <Grid className={classes.item} item xs={12} sm={12} md={12} lg={12} xl={12} >
              <Typography align='center' variant='h6'>PAGAMENTO DE TÍTULO</Typography>
            </Grid>         
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptLocale}>
              <Grid className={classes.item} item xs={12} sm={4} md={4} lg={4} xl={4} >
                <DatePicker
                  id="purchase_date"
                  label="Data da venda"
                  className={classes.textField}
                  value={bill.purchase_date}
                  onChange={this.handleDateValueChange('purchase_date')}
                  margin="normal"
                  format={"dd/MM/yyyy"}
                  
                  fullWidth
                />
              </Grid>
              <Grid className={classes.item} item xs={12} sm={4} md={4} lg={4} xl={4} >
                <DatePicker
                  id="due_date"
                  label="Data de vencimento"
                  className={classes.textField}
                  value={bill.due_date}
                  onChange={this.handleDateValueChange('due_date')}
                  margin="normal"
                  format={"dd/MM/yyyy"}
                  
                  fullWidth
                />
              </Grid>
              <Grid className={classes.item} item xs={12} sm={4} md={4} lg={4} xl={4} >
                <DatePicker
                  id="pay_date"
                  label="Data de Pagamento"
                  className={classes.textField}
                  value={bill.pay_date}
                  onChange={this.handleDateValueChange('pay_date')}
                  margin="normal"
                  format={"dd/MM/yyyy"}
                  fullWidth
                />
              </Grid>
            </MuiPickersUtilsProvider>
            <Grid className={classes.item} item xs={12} sm={12} md={12} lg={12} xl={12} >
              <TextField
                id="vendor"
                label="Nome do vendedor"
                className={classes.textField}
                value={bill.vendor}
                onChange={this.handleValueChange('vendor')}
                margin="normal"
                readonly
                fullWidth
              />   
            </Grid>  
            <Grid className={classes.item} item xs={12} sm={6} md={6} lg={6} xl={6} >
              <TextField
                id="code"
                label="Código"
                className={classes.textField}
                value={bill.code}
                onChange={this.handleValueChange('code')}
                margin="normal"
                readonly
                fullWidth
              />
            </Grid>
            <Grid className={classes.item} item xs={12} sm={6} md={6} lg={6} xl={6} >
              <TextField
                id="quota"
                label="Parcela"
                className={classes.textField}
                value={bill.quota}
                onChange={this.handleValueChange('quota')}
                margin="normal"
                readonly
                fullWidth
              />
            </Grid>
            <Grid className={classes.item} item xs={12} sm={4} md={4} lg={4} xl={4} >
              <TextField
                id="original_value"
                label="Valor"
                className={classes.textField}
                value={bill.original_value}
                onChange={this.handleValueChange('original_value')}
                margin="normal"
                readonly
                fullWidth
              />
            </Grid>
            <Grid className={classes.item} item xs={12} sm={4} md={4} lg={4} xl={4} >
              <TextField
                id="interest"
                label="Juros"
                className={classes.textField}
                value={bill.interest}
                onChange={this.handleValueChangeInterest}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid className={classes.item} item xs={12} sm={4} md={4} lg={4} xl={4} >
              <TextField
                id="pay_value"
                label="Valor pago"
                className={classes.textField}
                value={bill.pay_value}
                onChange={this.handleValueChange('pay_value')}
                margin="normal"
                fullWidth
              />
            </Grid>
          </Grid>
          <div >
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  //onClick={handleSave}
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
    )
  }
}

BillReceiveEditModal.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(BillReceiveEditModal);