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
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import TextMaskCustom from '../../components/common/TextMaskCustom';
import SelectGeneric from '../../components/common/SelectGeneric';
import BillReceiveTable from '../../components/billReceive/BillReceiveTable';
import MapIcon from '@material-ui/icons/Map';

import axios from 'axios';

import ChoosePostalCode from './ChoosePostalCode';

const styles = theme => ({
  container: {
    marginTop: theme.spacing(3),
    display: 'block',
  },
  back: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    padding: theme.spacing(2),
    borderColor: '#C0C0C0',
    borderStyle: 'solid',
    borderWidth: '1px',
    width: '98%',
  },
  textField: {
    marginTop: '0px',
    marginBotton: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  textFieldInput: {
    padding: '0px',
  },
  inputFile: {
    display: 'none',
  },
  formControl: {
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
  divPhone: {
    display: 'flex',
    flexDirection: 'wrap',
  },
  img: {
    height: theme.spacing(25),
    width: theme.spacing(40),
  },
  itens: {
    paddingTop: theme.spacing(2),
  },
  item: {
    padding: `${theme.spacing(1)}px !important `,
  },
  fab: {
    marginRight: theme.spacing(0.5),
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
    width: theme.spacing(50),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none',
  },
  paperModalAddress: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    outline: 'none',
    width: theme.spacing(60),
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
    '.MuiTableCell-sizeSmall': {
      padding: '5px 5px 5px 5px !important',
    },
    'tr > td': {
      fontWeight: '600 !important',
      fontSize: '1.1em !important',
    },
  },
});

const menuCivilStatus = [
  { value: 0, description: '' },
  { value: 1, description: 'SOLTEIRO(A)' },
  { value: 2, description: 'CASADO(A)' },
  { value: 3, description: 'DIVORCIADO(A)' },
  { value: 4, description: 'SEPARADO(A)' },
  { value: 5, description: 'VIÚVO(A)' },
];

class EditClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 'EDIT',
      openModalAddress: false,
      postalCodes: [],
    };
  }

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  handleOpeModalAddress = value => {
    this.setState({ openModalAddress: value });
  };

  onCloseModalAddress = (event, reason) => {
    this.setState({ openModalAddress: false });
    if (reason === 'created') {
    }
  };

  handleSearchPostalCode = () => {
    const { handleOpenMessage } = this.props;
    const { address, city, state } = this.props.clientData;

    if (address.length === 0) {
      handleOpenMessage(
        true,
        'warning',
        'Informe o Endereço para buscar o Cep.'
      );
      return;
    }

    if (city.length === 0) {
      handleOpenMessage(true, 'warning', 'Informe a Cidade para buscar o Cep.');
      return;
    }

    if (state.length === 0) {
      handleOpenMessage(true, 'warning', 'Informe o Estado para buscar o Cep.');
      return;
    }

    axios
      .get(`https://viacep.com.br/ws/${state}/${city}/${address}/json/`)
      .then(res => {
        if (res.data.erro) return;
        let _postalCodes = res.data.map(item => ({
          neighborhood: item.bairro,
          postalCode: item.cep,
          address: item.logradouro,
        }));
        this.setState({ openModalAddress: true, postalCodes: _postalCodes });
      });
  };

  render() {
    const {
      classes,
      clientData,
      handleValueChange,
      handleSave,
      handleCancel,
      handleDateValueChange,
      handleValueChangeOnlyNumber,
      handlePostalCodeChange,
      handleCheckCpf,
      handleCheckDateBirth,
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
              <ChoosePostalCode
                open={this.state.openModalAddress}
                handleClose={this.onCloseModalAddress}
                paperClass={classes.paperModalAddress}
                rows={this.state.postalCodes}
                handlePostalCodeChange={handlePostalCodeChange}
              />
              <Grid className={classes.itens} container spacing={3}>
                <Grid
                  className={classes.item}
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  lg={2}
                  xl={2}
                >
                  <TextField
                    id="cpf"
                    label="Cpf"
                    className={classes.textField}
                    value={clientData.cpf}
                    onChange={handleValueChangeOnlyNumber('cpf')}
                    onBlur={handleCheckCpf}
                    margin="normal"
                    fullWidth
                    inputProps={{
                      maxLength: 11,
                    }}
                  />
                </Grid>
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
                    value={clientData.name}
                    onChange={handleValueChange('name')}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid
                  className={classes.item}
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  lg={2}
                  xl={2}
                >
                  <TextField
                    id="rg"
                    label="RG"
                    className={classes.textField}
                    value={clientData.rg}
                    onChange={handleValueChange('rg')}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid
                  className={classes.item}
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  lg={3}
                  xl={3}
                >
                  <KeyboardDatePicker
                    id="registryDate"
                    label="Data de Registro"
                    className={classes.textField}
                    value={clientData.registryDate}
                    onChange={handleDateValueChange('registryDate')}
                    margin="normal"
                    format={'dd/MM/yyyy'}
                    fullWidth
                  />
                </Grid>
                <Grid
                  className={classes.item}
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  lg={3}
                  xl={3}
                >
                  <KeyboardDatePicker
                    id="dateOfBirth"
                    label="Data de Aniversário"
                    className={classes.textField}
                    value={clientData.dateOfBirth}
                    onChange={handleDateValueChange('dateOfBirth')}
                    onBlur={handleCheckDateBirth}
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
                    id="placeOfBirth"
                    label="Naturalidade"
                    className={classes.textField}
                    value={clientData.placeOfBirth}
                    onChange={handleValueChange('placeOfBirth')}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid
                  className={classes.item}
                  item
                  xs={12}
                  sm={12}
                  md={8}
                  lg={8}
                  xl={8}
                >
                  <TextField
                    id="address"
                    label="Endereço"
                    className={classes.textField}
                    value={clientData.address}
                    onChange={handleValueChange('address')}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid
                  className={classes.item}
                  item
                  xs={12}
                  sm={6}
                  md={2}
                  lg={2}
                  xl={2}
                >
                  <TextField
                    id="addressNumber"
                    label="Número"
                    className={classes.textField}
                    value={clientData.addressNumber}
                    onChange={handleValueChange('addressNumber')}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid
                  className={classes.item}
                  item
                  xs={12}
                  sm={6}
                  md={2}
                  lg={2}
                  xl={2}
                >
                  <TextField
                    id="complement"
                    label="Complemento"
                    className={classes.textField}
                    value={clientData.complement}
                    onChange={handleValueChange('complement')}
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
                    value={clientData.neighborhood}
                    onChange={handleValueChange('neighborhood')}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid
                  className={classes.item}
                  item
                  xs={12}
                  sm={5}
                  md={5}
                  lg={5}
                  xl={5}
                >
                  <TextField
                    id="city"
                    label="Cidade"
                    className={classes.textField}
                    value={clientData.city}
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
                    value={clientData.state}
                    onChange={handleValueChange('state')}
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
                  sm={1}
                  md={1}
                  lg={1}
                  xl={1}
                >
                  <Tooltip
                    title="Buscar Cep"
                    placement={'bottom-start'}
                    enterDelay={300}
                  >
                    <Fab
                      color="primary"
                      aria-label="Buscar Cep"
                      size="small"
                      onClick={this.handleSearchPostalCode}
                    >
                      <MapIcon />
                    </Fab>
                  </Tooltip>
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
                    id="postalCode"
                    label="CEP"
                    className={classes.textField}
                    value={clientData.postalCode}
                    onChange={event =>
                      handlePostalCodeChange(event, 'textFieldCep')
                    }
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
                    id="seller"
                    label="Vendedor"
                    className={classes.textField}
                    value={clientData.seller}
                    onChange={handleValueChange('seller')}
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
                  lg={10}
                  xl={10}
                >
                  <TextField
                    id="jobName"
                    label="Empresa"
                    className={classes.textField}
                    value={clientData.jobName}
                    onChange={handleValueChange('jobName')}
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
                  lg={2}
                  xl={2}
                >
                  <KeyboardDatePicker
                    id="admissionDate"
                    label="Data de Admissão"
                    className={classes.textField}
                    value={clientData.admissionDate}
                    onChange={handleDateValueChange('admissionDate')}
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
                    id="occupation"
                    label="Profissão"
                    className={classes.textField}
                    value={clientData.occupation}
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
                  lg={6}
                  xl={6}
                >
                  <SelectGeneric
                    description="Estado civil"
                    showEmpty={false}
                    value={clientData.civilStatus}
                    onChange={handleValueChange('civilStatus')}
                    itens={menuCivilStatus}
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
                    value={clientData.spouse}
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
                  xl={6}
                >
                  <TextField
                    id="fatherName"
                    label="Pai"
                    className={classes.textField}
                    value={clientData.fatherName}
                    onChange={handleValueChange('fatherName')}
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
                  xl={6}
                >
                  <TextField
                    id="motherName"
                    label="Mãe"
                    className={classes.textField}
                    value={clientData.motherName}
                    onChange={handleValueChange('motherName')}
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
                      value={clientData.phone1}
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
                      value={clientData.phone2}
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
                    value={clientData.note}
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
            clientId={this.props.clientData.id}
            clientData={this.props.clientData}
            handleOpenMessage={this.props.handleOpenMessage}
            handleSaveClient={this.props.handleSave}
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
  handleCheckCpf: PropTypes.func.isRequired,
};

export default withStyles(styles)(EditClient);
