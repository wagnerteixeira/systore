import 'date-fns';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';

import ptLocale from "date-fns/locale/pt-BR";

const styles = theme => ({
  container: {
    marginTop: theme.spacing.unit * 3,
    display: 'block',    
  },
  back: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    display: 'flex',
    flexWrap: 'wrap',  
    flexDirection: 'column',  
    padding: theme.spacing.unit * 2, 
    borderColor: '#C0C0C0',
    borderStyle: 'solid',    
    borderWidth: '1px',
    width: '50%',
    [theme.breakpoints.between('xs', 'sm')]: {
      width: '90%',
      }
  },
  textField: {    
    width: '100%',
    marginTop: '0px',
    marginBotton: '4px',
  },
  textFieldInput: {
    padding: '0px'
  },
  inputFile: {
    display: 'none',
  },
  button: {
    margin: theme.spacing.unit,
  },
  divRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  img: {
    height: theme.spacing.unit * 25,
    width: theme.spacing.unit * 40,     
  },
});

class EditPublication extends Component {
  render() {
    const { 
      classes, 
      handleValueChange, 
      data,
      handleSave,
      handleCancel,      
    } = this.props;

    console.log(typeof new Date(data.registry_date));
    console.log(new Date(data.registry_date));
    return (
      <div>
        <form className={classes.container} noValidate autoComplete="off">  
          <div className={classes.back}>
            <TextField
              id="name"
              label="Nome"
              className={classes.textField}
              value={data.name}
              onChange={handleValueChange('name')}
              margin="normal"
              fullWidth
            />
            <TextField
              id="cpf"
              label="Cpf"
              className={classes.textField}
              value={data.cpf}
              onChange={handleValueChange('cpf')}
              margin="normal"
              fullWidth
            />   
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptLocale}>                     
              <DatePicker
                id="registry_date"
                label="Data de Registro"
                rows="6"
                className={classes.textField}
                value={data.registry_date}
                onChange={handleValueChange('registry_date')}
                margin="normal"      
                format={"dd/MM/yyyy"}
                views={["year", "month", "day"]}
                fullWidth                 
              />                        
              <DatePicker            
                id="date_of_birth"
                label="Data de Aniversário"
                className={classes.textField}
                value={data.date_of_birth}              
                onChange={(e) => handleValueChange('date_of_birth')({...e, target: { ...e.target, value: parseInt(e.target.value) }})}
                margin="normal"          
                format={"dd/MM/yyyy"}    
                fullWidth          
              />  
            </MuiPickersUtilsProvider> 
            <TextField
              id="address"
              label="Endereço"
              className={classes.textField}
              value={data.address}
              onChange={handleValueChange('address')}
              margin="normal"
              fullWidth
            />   
            <TextField
              id="neighborhood"
              label="Bairro"
              className={classes.textField}
              value={data.neighborhood}
              onChange={handleValueChange('neighborhood')}
              margin="normal"
              fullWidth
            />   
            <TextField
              id="city"
              label="Cidade"
              className={classes.textField}
              value={data.city}
              onChange={handleValueChange('city')}
              margin="normal"
              fullWidth
            />
            <TextField
              id="state"
              label="Estado"
              className={classes.textField}
              value={data.state}
              onChange={handleValueChange('state')}
              margin="normal"
              fullWidth
            />
            <TextField
              id="postal_code"
              label="CEP"
              className={classes.textField}
              value={data.postal_code}
              onChange={handleValueChange('postal_code')}
              margin="normal"
              fullWidth
            />
            <TextField
              id="seller"
              label="Vendedor"
              className={classes.textField}
              value={data.seller}
              onChange={handleValueChange('seller')}
              margin="normal"
              fullWidth
            />
            <TextField
              id="job_name"
              label="Empresa"
              className={classes.textField}
              value={data.job_name}
              onChange={handleValueChange('job_name')}
              margin="normal"
              fullWidth
            />
            <TextField
              id="occupation"
              label="Profissão"
              className={classes.textField}
              value={data.occupation}
              onChange={handleValueChange('occupation')}
              margin="normal"
              fullWidth
            />
            <TextField
              id="place_of_birth"
              label="Naturalidade"
              className={classes.textField}
              value={data.place_of_birth}
              onChange={handleValueChange('place_of_birth')}
              margin="normal"
              fullWidth
            />
            <TextField
              id="spouse"
              label="Cônjuge"
              className={classes.textField}
              value={data.spouse}
              onChange={handleValueChange('spouse')}
              margin="normal"
              fullWidth
            />
            <TextField
              id="phone1"
              label="Bairro"
              className={classes.textField}
              value={data.phone1}
              onChange={handleValueChange('phone1')}
              margin="normal"
              fullWidth
            />
            <TextField
              id="phone2"
              label="Bairro"
              className={classes.textField}
              value={data.phone2}
              onChange={handleValueChange('phone2')}
              margin="normal"
              fullWidth
            />
            <TextField
                id="note"
                label="Observações"
                rows="6"
                className={classes.textField}
                value={data.note}
                onChange={handleValueChange('note')}
                margin="normal"
                multiline
            />   

            <br />
            <div className={classes.divRow}>
              <Button 
                variant="outlined" 
                color="primary" 
                className={classes.button}
                onClick={handleSave}
              >
                Salvar
              </Button>       
              <Button 
                variant="outlined" 
                color="secondary" 
                className={classes.button}
                onClick={handleCancel}
              >
                Cancelar
              </Button>       
            </div>  
          </div>          
        </form>
      </div>     
    );
  }
}

EditPublication.propTypes = {
  classes: PropTypes.object.isRequired,
  handleValueChange: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default withStyles(styles)(EditPublication);
