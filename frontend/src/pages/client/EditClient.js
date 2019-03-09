import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

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
            <TextField
              id="registry_date"
              label="Data de Registro"
              rows="6"
              className={classes.textField}
              value={data.registry_date}
              onChange={handleValueChange('registry_date')}
              margin="normal"
              fullWidth
            />     
            <TextField
              id="date_of_birth"
              label="Data de Aniversário"
              className={classes.textField}
              value={data.date_of_birth}              
              onChange={(e) => handleValueChange('date_of_birth')({...e, target: { ...e.target, value: parseInt(e.target.value) }})}
              margin="normal"              
              fullWidth          
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
