import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
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

import ptLocale from "date-fns/locale/pt-BR";

import NumberFormatCustom from '../../components/common/NumberFormatCustom';
import ModalWrapped from '../../components/common/Modal';

import { getDateToString } from '../../utils/operators';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import billsReceiveService from '../../services/billsReceiveService';

const styles = theme => ({  
  margin: {
    margin: theme.spacing.unit
  },
  fab: {    
    color: theme.palette.common.white
  },
  item: {
    padding: `${theme.spacing.unit}px !important`
  }
});

class BillReceiveCreateModal extends React.Component {

  state = {  
    code: '',
    quotas: 0, 
    original_value: 0.0,
    purchase_date: new Date(),
    vendor: '',      
    bills_receives: [],
  }

  handleValueChange = name => event => {
    console.log(event.target.value);
    this.setState({ [name]: event.target.value})
  };  

  handleValueChangeInterest = event => {
    this.setState({ interest: event.target.value, pay_value: parseFloat(this.state.original_value) + parseFloat(event.target.value)})
  }

  handleDateValueChange = name => date => {
    this.setState({ [name]: date});
  }

  handleGenerateQuotas = () => {
    if ((this.state.original_value > 0) && (this.state.quotas > 0)){
      let _quotaValue = parseFloat(this.state.original_value / this.state.quotas).toFixed(2);
      let quotas = [];
      let i = 0;

      let due_date = new Date(this.state.purchase_date.getTime());
      console.log(typeof due_date);
      for (i = 0; i < this.state.quotas; i++){
        let original_value = _quotaValue;
        if (i == (this.state.quotas -1)){
          console.log('ultima');
          original_value = parseFloat(this.state.original_value - parseFloat(((this.state.quotas -1) * _quotaValue)).toFixed(2)).toFixed(2)
        }
        due_date.setDate(due_date.getDate() + 30);
        quotas.push({
          quota: i + 1,
          due_date: new Date(due_date.getTime()),
          original_value: original_value
        })
      }

      this.setState({
        bills_receives: quotas
      })
    }
  }

  handleSaveQuotas = clientId => handleClose => () => {
    let data = {
      original_value: this.state.original_value,
      quotas: this.state.quotas,
      vendor: this.state.vendor,
      purchase_date: this.state.purchase_date,
      bills_receives: this.state.bills_receives
    }

    billsReceiveService.createQuotas(clientId, data)
      .then(() => handleClose())
      .catch((error) => 
        console.log(error.response)
      );
  }

  render() {
    const {
      open,
      handleClose,
      classes,
      clientId
    } = this.props;

    const {            
      original_value,
      purchase_date,
      vendor,
      quotas,
      bills_receives
    } = this.state;    

    let _original_value = parseFloat(original_value).toFixed(2).replace('.', ',');
    console.log(this.state);
    return (
      <ModalWrapped
        handleClose={handleClose}
        open={open}   
      >        
          <Grid className={classes.itens} container spacing={24}>
            <Grid className={classes.item} item xs={12} sm={12} md={12} lg={12} xl={12} >
              <Typography align='center' variant='h6'>INCLUSÃO DE TÍTULOS</Typography>
            </Grid>         
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptLocale}>
              <Grid className={classes.item} item xs={12} sm={4} md={4} lg={4} xl={4} >
                <DatePicker
                  id="purchase_date"
                  label="Data da venda"
                  className={classes.margin}
                  value={purchase_date}
                  onChange={this.handleDateValueChange('purchase_date')}
                  margin="normal"
                  format={"dd/MM/yyyy"}                  
                  fullWidth
                />
              </Grid>              
            </MuiPickersUtilsProvider>
            <Grid className={classes.item} item xs={12} sm={4} md={4} lg={4} xl={4} >
              <TextField
                className={classes.margin}
                label="Valor"
                value={_original_value}
                onChange={this.handleValueChange('original_value')}
                id="original_value"
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
              />
            </Grid>
            <Grid container alignItems="center" justify='center' className={classes.item} item xs={12} sm={2} md={2} lg={2} xl={2} >
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
            <Grid className={classes.item} item xs={12} sm={6} md={6} lg={6} xl={6} >
              <TextField
                id="quotas"
                label="Parcelas"
                className={classes.margin}
                value={quotas}
                onChange={this.handleValueChange('quotas')}
                margin="normal"                
                fullWidth
              />   
            </Grid>
            <Grid className={classes.item} item xs={12} sm={6} md={6} lg={6} xl={6} >
              <TextField
                id="vendor"
                label="Nome do vendedor"
                className={classes.margin}
                value={vendor}
                onChange={this.handleValueChange('vendor')}
                margin="normal"                
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
                  <TableCell align="left">{getDateToString(bills_receives[key].due_date)}</TableCell>
                  <TableCell align="left">{bills_receives[key].original_value}</TableCell>                  
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </Paper>
          <div >
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  onClick={this.handleSaveQuotas(clientId)(handleClose)}
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

BillReceiveCreateModal.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  clientId: PropTypes.string.isRequired,
};

export default withStyles(styles)(BillReceiveCreateModal);