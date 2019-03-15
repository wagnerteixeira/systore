import 'date-fns';
import React, { Component } from 'react';
import MaskedInput from 'react-text-mask';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

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
    marginTop: '0px',
    marginBotton: '4px',
    marginLeft: '15px',
    marginRight: '15px',
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
  divPhone: {
    display: 'flex',
    flexDirection: 'wrap',
  },
  img: {
    height: theme.spacing.unit * 25,
    width: theme.spacing.unit * 40,
  },
});

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      placeholderChar={'\u2000'}
      showMask
    />
  );
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
};


class EditPublication extends Component {

  state = {
    textmask: '(1  )    -    ',
  };
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };
  render() {
    const {
      classes,
      handleValueChange,
      data,
      handleSave,
      handleCancel,
    } = this.props;

    const { textmask } = this.state;

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
            <div className={classes.divRow}>
              <TextField
                id="cpf"
                label="Cpf"
                className={classes.textField}
                value={data.cpf}
                onChange={handleValueChange('cpf')}
                margin="normal"
              />
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptLocale}>
                <DatePicker
                  id="registry_date"
                  label="Data de Registro"
                  className={classes.textField}
                  value={data.registry_date}
                  onChange={handleValueChange('registry_date')}
                  margin="normal"
                  format={"dd/MM/yyyy"}
                  views={["year", "month", "day"]}
                />
                <DatePicker
                  id="date_of_birth"
                  label="Data de Aniversário"
                  className={classes.textField}
                  value={data.date_of_birth}
                  onChange={handleValueChange('date_of_birth')}
                  margin="normal"
                  format={"dd/MM/yyyy"}
                />
              </MuiPickersUtilsProvider>
              <TextField
                id="place_of_birth"
                label="Naturalidade"
                className={classes.textField}
                value={data.place_of_birth}
                onChange={handleValueChange('place_of_birth')}
                margin="normal"
              />
            </div>
            <TextField
              id="address"
              label="Endereço"
              className={classes.textField}
              value={data.address}
              onChange={handleValueChange('address')}
              margin="normal"
              fullWidth
            />
            <div className={classes.divRow}>
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
            </div>
            <TextField
              id="seller"
              label="Vendedor"
              className={classes.textField}
              value={data.seller}
              onChange={handleValueChange('seller')}
              margin="normal"
              fullWidth
            />
            <div className={classes.divRow}>
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
            </div>
            <TextField
              id="spouse"
              label="Cônjuge"
              className={classes.textField}
              value={data.spouse}
              onChange={handleValueChange('spouse')}
              margin="normal"
              fullWidth
            />
            <div className={classes.divPhone} height='100px'>
              <InputLabel htmlFor="formatted-text-mask-input">Telefone 1</InputLabel>
              <Input
                value={textmask}
                onChange={this.handleChange('textmask')}
                id="phone1"
                inputComponent={TextMaskCustom}
              />
              <InputLabel htmlFor="formatted-text-mask-input">Telefone 2</InputLabel>
              <Input
                value={textmask}
                onChange={this.handleChange('textmask')}
                id="phone2"
                inputComponent={TextMaskCustom}
              />
            </div>
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
