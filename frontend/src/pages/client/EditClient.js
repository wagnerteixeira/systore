import 'date-fns';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker } from '@material-ui/pickers';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import TextMaskCustom from '../../components/common/TextMaskCustom';

import BillReceiveTable from '../../components/billReceive/BillReceiveTable';

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
    width: '98%',
  },
  textField: {
    marginTop: '0px',
    marginBotton: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  textFieldInput: {
    padding: '0px',
  },
  inputFile: {
    display: 'none',
  },
  formControl: {
    margin: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
  divPhone: {
    display: 'flex',
    flexDirection: 'wrap',
  },
  img: {
    height: theme.spacing.unit * 25,
    width: theme.spacing.unit * 40,
  },
  itens: {
    paddingTop: theme.spacing.unit * 2,
  },
  item: {
    padding: `${theme.spacing.unit * 0.2}px !important `,
  },
  fab: {
    marginRight: theme.spacing.unit * 0.5,
    color: theme.palette.common.white,
  },
  fabEdit: {
    backgroundColor: theme.palette.edit.main,
    '&:hover': {
      backgroundColor: theme.palette.edit.dark,
    },
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
  },
  table: {
    minWidth: 500,
  },
  openRow: {
    backgroundColor: theme.palette.secondary.light,
  },
  tableRowData: {
    fontWeight: 'bold',
  },
  '@global': {
    'tr > td': {
      fontWeight: '600 !important',
      fontSize: '1.1em !important',
    },
  },
});

class EditClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 'EDIT',
      clientId: props.data._id,
      clientData: props.data,
    };
  }

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  render() {
    const {
      classes,
      data,
      handleValueChange,
      handleSave,
      handleCancel,
      handleDateValueChange,
      handleCepChange,
    } = this.props;

    const { tabValue } = this.state;

    return (
      <div>
        <Tabs
          value={tabValue}
          onChange={this.handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab value="EDIT" label="CADASTRO" />
          <Tab value="LIST" label="TÍTULOS" />
        </Tabs>
        {tabValue === 'EDIT' && (
          <form className={classes.container} noValidate autoComplete="off">
            <div className={classes.back}>
              <Grid className={classes.itens} container spacing={24}>
                <Grid
                  className={classes.item}
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={8}
                  xl={8}
                >
                  <TextField
                    id="name"
                    label="Nome"
                    className={classes.textField}
                    value={data.name}
                    onChange={handleValueChange('name')}
                    margin="normal"
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
                    id="cpf"
                    label="Cpf"
                    className={classes.textField}
                    value={data.cpf}
                    onChange={handleValueChange('cpf')}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid
                  className={classes.item}
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  lg={3}
                  xl={3}
                >
                  <KeyboardDatePicker
                    id="registry_date"
                    label="Data de Registro"
                    className={classes.textField}
                    value={data.registry_date}
                    onChange={handleDateValueChange('registry_date')}
                    margin="normal"
                    format={'dd/MM/yyyy'}
                    fullWidth
                  />
                </Grid>
                <Grid
                  className={classes.item}
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  lg={3}
                  xl={3}
                >
                  <KeyboardDatePicker
                    id="date_of_birth"
                    label="Data de Aniversário"
                    className={classes.textField}
                    value={data.date_of_birth}
                    onChange={handleDateValueChange('date_of_birth')}
                    margin="normal"
                    format={'dd/MM/yyyy'}
                    fullWidth
                  />
                </Grid>
                <Grid
                  className={classes.item}
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={6}
                  xl={6}
                >
                  <TextField
                    id="place_of_birth"
                    label="Naturalidade"
                    className={classes.textField}
                    value={data.place_of_birth}
                    onChange={handleValueChange('place_of_birth')}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid
                  className={classes.item}
                  item
                  xs={12}
                  sm={8}
                  md={8}
                  lg={8}
                  xl={8}
                >
                  <TextField
                    id="address"
                    label="Endereço"
                    className={classes.textField}
                    value={data.address}
                    onChange={handleValueChange('address')}
                    margin="normal"
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
                    id="neighborhood"
                    label="Bairro"
                    className={classes.textField}
                    value={data.neighborhood}
                    onChange={handleValueChange('neighborhood')}
                    margin="normal"
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
                    id="city"
                    label="Cidade"
                    className={classes.textField}
                    value={data.city}
                    onChange={handleValueChange('city')}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid
                  className={classes.item}
                  item
                  xs={12}
                  sm={2}
                  md={2}
                  lg={2}
                  xl={2}
                >
                  <TextField
                    id="state"
                    label="Estado"
                    className={classes.textField}
                    value={data.state}
                    onChange={handleValueChange('state')}
                    margin="normal"
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
                    id="postal_code"
                    label="CEP"
                    className={classes.textField}
                    value={data.postal_code}
                    onChange={handleCepChange}
                    margin="normal"
                    fullWidth
                  />
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
                    id="seller"
                    label="Vendedor"
                    className={classes.textField}
                    value={data.seller}
                    onChange={handleValueChange('seller')}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid
                  className={classes.item}
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={6}
                  xl={6}
                >
                  <TextField
                    id="job_name"
                    label="Empresa"
                    className={classes.textField}
                    value={data.job_name}
                    onChange={handleValueChange('job_name')}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid
                  className={classes.item}
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={6}
                  xl={6}
                >
                  <TextField
                    id="occupation"
                    label="Profissão"
                    className={classes.textField}
                    value={data.occupation}
                    onChange={handleValueChange('occupation')}
                    margin="normal"
                    fullWidth
                  />
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
                    id="spouse"
                    label="Cônjuge"
                    className={classes.textField}
                    value={data.spouse}
                    onChange={handleValueChange('spouse')}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid
                  className={classes.item}
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  xl={12}
                >
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="formatted-text-mask-input">
                      Telefone 1
                    </InputLabel>
                    <Input
                      value={data.phone1}
                      onChange={handleValueChange('phone1')}
                      id="phone1"
                      inputComponent={TextMaskCustom}
                      inputProps={{
                        mask: [
                          '(',
                          /[1-9]/,
                          /\d/,
                          ')',
                          ' ',
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                          '-',
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                        ],
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid
                  className={classes.item}
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  xl={12}
                >
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="formatted-text-mask-input">
                      Telefone 2
                    </InputLabel>
                    <Input
                      value={data.phone2}
                      onChange={handleValueChange('phone2')}
                      id="phone2"
                      inputComponent={TextMaskCustom}
                      inputProps={{
                        mask: [
                          '(',
                          /[1-9]/,
                          /\d/,
                          ')',
                          ' ',
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                          '-',
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                        ],
                      }}
                    />
                  </FormControl>
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
                    id="note"
                    label="Observações"
                    rows="6"
                    className={classes.textField}
                    value={data.note}
                    onChange={handleValueChange('note')}
                    margin="normal"
                    multiline
                    fullWidth
                  />
                </Grid>
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
              </Grid>
            </div>
          </form>
        )}
        {tabValue === 'LIST' && (
          <BillReceiveTable
            clientId={this.state.clientId}
            clientData={this.state.clientData}
            handleOpenMessage={this.props.handleOpenMessage}
          />
        )}
      </div>
    );
  }
}

EditClient.propTypes = {
  classes: PropTypes.object.isRequired,
  handleValueChange: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  handleDateValueChange: PropTypes.func.isRequired,
  handleOpenMessage: PropTypes.func.isRequired,
};

export default withStyles(styles)(EditClient);
