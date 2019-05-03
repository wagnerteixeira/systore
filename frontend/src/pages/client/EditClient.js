import 'date-fns';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import classNames from 'classnames';

import {
  getDateToString,
  getCurrentDate,
  getDelayedDays,
  getNumberDecimalToStringCurrency,
  getNumberToString,
  getValueWithInterest
} from '../../utils/operators';
import TextMaskCustom from '../../components/common/TextMaskCustom';
import BillReceiveEditModal from './modals/BillReceiveEditModal';
import BillReceiveCreateModal from './modals/BillReceiveCreateModal';

import ptLocale from 'date-fns/locale/pt-BR';

import billsReceiveservice from '../../services/billsReceiveService';
import { getErrosFromApi } from '../../utils/errorsHelper';

import { printBillsReceiveis } from '../../services/printService';

const styles = theme => ({
  container: {
    marginTop: theme.spacing.unit * 3,
    display: 'block'
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
    width: '98%'
  },
  backBill: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    borderColor: '#C0C0C0',
    borderStyle: 'solid',
    borderWidth: '1px',
    width: '98%'
  },
  textField: {
    marginTop: '0px',
    marginBotton: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  textFieldInput: {
    padding: '0px'
  },
  inputFile: {
    display: 'none'
  },
  formControl: {
    margin: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  },
  divPhone: {
    display: 'flex',
    flexDirection: 'wrap'
  },
  img: {
    height: theme.spacing.unit * 25,
    width: theme.spacing.unit * 40
  },
  itens: {
    paddingTop: theme.spacing.unit * 2
  },
  item: {
    paddingTop: `${theme.spacing.unit * 0.2}px !important `,
    paddingBottom: `${theme.spacing.unit * 0.2}px !important `
  },
  fab: {
    marginRight: theme.spacing.unit * 0.5,
    color: theme.palette.common.white
  },
  fabEdit: {
    backgroundColor: theme.palette.edit.main,
    '&:hover': {
      backgroundColor: theme.palette.edit.dark
    }
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none'
  },
  table: {
    minWidth: 500
  },
  openRow: {
    backgroundColor: theme.palette.secondary.light
  },
  tableRowData: {
    fontWeight: 'bold'
  },
  '@global': {
    'tr > td': {
      fontWeight: '600 !important',
      fontSize: '1.1em !important'
    }
  },
  headerAcoes: {
    minWidth: '130px'
  }
});

class EditClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 'EDIT',
      bills_receives: [],
      openEditModal: false,
      openCreateModal: false,
      clientId: props.data._id,
      clientData: props.data,
      bill: {
        _id: '',
        client: '',
        code: '',
        quota: '',
        original_value: 0,
        interest: 0,
        final_value: 0,
        purchase_date: new Date(),
        due_date: new Date(),
        pay_date: new Date(),
        days_delay: 0,
        situation: 'O',
        vendor: ''
      }
    };
  }

  fetchBillsReceives = () => {
    billsReceiveservice
      .getBillsReceiveServiceByClient(this.state.clientId)
      .then(res => this.setState({ bills_receives: res.data }));
  };

  handleTabChange = (event, value) => {
    this.fetchBillsReceives();
    this.setState({ tabValue: value });
  };

  handleDeleteBillReceive = key => {
    billsReceiveservice
      .remove(this.state.bills_receives[key]._id)
      .then(() => {
        let copyBill = this.state.bills_receives.slice();
        copyBill.splice(key, 1);
        this.setState({ bills_receives: copyBill });
      })
      .catch(error =>
        this.props.handleOpenMessage(true, 'error', getErrosFromApi(error))
      );
  };

  handleEditBillReceive = bill_receive => {
    this.setState({ openEditModal: true, bill: bill_receive });
  };

  handleCloseEditModal = () => {
    this.setState({ openEditModal: false });
  };

  handleCloseCreateModal = (event, reason) => {
    this.setState({ openCreateModal: false });
    if (reason === 'created') {
      this.props.handleOpenMessage(
        true,
        'success',
        'Títulos criado com sucesso! '
      );
      this.fetchBillsReceives();
    }
  };

  handleCreateBillReceive = () => {
    this.setState({ openCreateModal: true });
  };

  handleSaveBillReceive = reason => {
    if (reason === 'saved') {
      this.setState({ openEditModal: false });
      this.props.handleOpenMessage(
        true,
        'success',
        'Título pago com sucesso! '
      );
      this.fetchBillsReceives();
    }
  };

  renderEditModal() {
    if (this.state.openEditModal === true) {
      return (
        <BillReceiveEditModal
          open={this.state.openEditModal}
          bill={this.state.bill}
          handleClose={this.handleCloseEditModal}
          handleSave={this.handleSaveBillReceive}
          clientData={this.state.clientData}
        />
      );
    }
  }

  handlePrintBillReceive = key => {
    let billReceive = this.state.bills_receives[key];
    const { clientData } = this.state;
    printBillsReceiveis(clientData, [billReceive]);
  };

  handlePrintBillReceiveGroupByCode = key => {
    let code = this.state.bills_receives[key].code;
    const { clientData } = this.state;

    let billReceives = this.state.bills_receives.filter(
      item => item.code === code
    );

    printBillsReceiveis(clientData, billReceives);
  };

  render() {
    const {
      classes,
      data,
      handleValueChange,
      handleSave,
      handleCancel,
      handleDateValueChange
    } = this.props;

    const { tabValue, bills_receives, openCreateModal, clientId } = this.state;

    const dateCurrent = getCurrentDate();
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
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptLocale}>
                  <Grid
                    className={classes.item}
                    item
                    xs={12}
                    sm={4}
                    md={4}
                    lg={3}
                    xl={3}
                  >
                    <DatePicker
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
                    <DatePicker
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
                </MuiPickersUtilsProvider>
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
                    onChange={handleValueChange('postal_code')}
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
                          /\d/
                        ]
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
                          /\d/
                        ]
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
          <form className={classes.container} noValidate autoComplete="off">
            <div className={classes.divRow}>
              <Button
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={this.handleCreateBillReceive}
              >
                INCLUIR
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
            <div className={classes.backBill}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">Data da venda</TableCell>
                    <TableCell padding="checkbox">Título</TableCell>
                    <TableCell padding="checkbox">Parcela</TableCell>
                    <TableCell padding="checkbox">Data de vencimento</TableCell>
                    <TableCell padding="checkbox">Data de pagamento</TableCell>
                    <TableCell padding="checkbox">Valor</TableCell>
                    <TableCell padding="checkbox" align="left">
                      Situação
                    </TableCell>
                    <TableCell padding="checkbox">Valor pago/atual</TableCell>
                    <TableCell padding="checkbox">Dias em atraso</TableCell>
                    <TableCell className={classes.headerAcoes} align="right">
                      Ações
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(bills_receives).map(key => {
                    let _daysDelay =
                      bills_receives[key].pay_date != null
                        ? bills_receives[key].days_delay
                        : getDelayedDays(
                            bills_receives[key].due_date,
                            dateCurrent
                          );
                    if (parseInt(_daysDelay) <= 0) _daysDelay = '';
                    return (
                      <TableRow
                        className={
                          bills_receives[key].situation === 'O' &&
                          classes.openRow
                        }
                        key={key}
                      >
                        <TableCell padding="checkbox">
                          {getDateToString(bills_receives[key].purchase_date)}
                        </TableCell>
                        <TableCell padding="checkbox">
                          {bills_receives[key].code}
                        </TableCell>
                        <TableCell padding="checkbox">
                          {bills_receives[key].quota}
                        </TableCell>
                        <TableCell padding="checkbox">
                          {getDateToString(bills_receives[key].due_date)}
                        </TableCell>
                        <TableCell padding="checkbox">
                          {getDateToString(bills_receives[key].pay_date)}
                        </TableCell>
                        <TableCell padding="checkbox">
                          {getNumberDecimalToStringCurrency(
                            bills_receives[key].original_value
                          )}
                        </TableCell>
                        <TableCell padding="checkbox" align="left">
                          {bills_receives[key].situation === 'C'
                            ? 'QUITADO'
                            : 'ABERTO'}
                        </TableCell>
                        <TableCell padding="checkbox">
                          {getNumberToString(
                            bills_receives[key].pay_date != null
                              ? bills_receives[key].final_value[
                                  '$numberDecimal'
                                ]
                              : parseFloat(
                                  getValueWithInterest(
                                    bills_receives[key].original_value[
                                      '$numberDecimal'
                                    ],
                                    bills_receives[key].due_date,
                                    dateCurrent
                                  )
                                )
                          )}
                        </TableCell>
                        <TableCell padding="checkbox">{_daysDelay}</TableCell>
                        <TableCell padding="none" align="right">
                          <Fab
                            color="secondary"
                            aria-label="Delete"
                            className={classNames(classes.fab, classes.fabEdit)}
                            onClick={() =>
                              this.handlePrintBillReceiveGroupByCode(key)
                            }
                            size="small"
                          >
                            <Icon fontSize="small">event_note</Icon>
                          </Fab>
                          <Fab
                            color="secondary"
                            aria-label="Delete"
                            className={classNames(classes.fab, classes.fabEdit)}
                            onClick={() => this.handlePrintBillReceive(key)}
                            size="small"
                          >
                            <Icon fontSize="small">local_printshop</Icon>
                          </Fab>
                          <Fab
                            color="primary"
                            aria-label="Edit"
                            className={classNames(classes.fab, classes.fabEdit)}
                            onClick={() =>
                              this.handleEditBillReceive(bills_receives[key])
                            }
                            size="small"
                          >
                            <Icon fontSize="small">edit_icon</Icon>
                          </Fab>
                          <Fab
                            color="secondary"
                            aria-label="Delete"
                            className={classes.fab}
                            onClick={() => this.handleDeleteBillReceive(key)}
                            size="small"
                          >
                            <Icon fontSize="small">delete_icon</Icon>
                          </Fab>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <br />
            {this.renderEditModal()}
            <BillReceiveCreateModal
              open={openCreateModal}
              handleClose={this.handleCloseCreateModal}
              clientId={clientId}
            />
          </form>
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
  handleOpenMessage: PropTypes.func.isRequired
};

export default withStyles(styles)(EditClient);
