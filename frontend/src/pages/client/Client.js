import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import MessageSnackbar from '../../components/common/MessageSnackbar';

import EditClient from './EditClient';
import ViewClient from './ViewClient';

import clientservice from '../../services/clientService';
import Confirm from '../../components/common/ConfirmAlert';
import { getErrosFromApi } from '../../utils/errorsHelper';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
});

class Client extends Component {
  /*constructor(props) {
    super(props);
    //this._searchDebounce = debounceTime(500, this.handleSearch);
  }*/
  state = {
    stateData: 'LIST',
    inEdit: false,
    selectedIndex: '0',
    clients: [],
    countClients: 0,
    data: {
      _id: '',
      name: '',
      code: 0,
      cpf: '',
      rg: '',
      registry_date: null,
      date_of_birth: null,
      place_of_birth: '',
      address: '',
      address_number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      postal_code: '',
      seller: '',
      job_name: '',
      admission_date: null,
      occupation: '',
      civil_status: 0,
      spouse: '',
      phone1: '',
      phone2: '',
      note: '',
      father_name: '',
      mother_name: '',
      bills_receives: [],
    },
    page: 0,
    rowsPerPage: 5,
    order: 'asc',
    columnSort: 'name',
    columnSearch: 'name',
    search: '',
    messageOpen: false,
    variantMessage: 'success',
    messageText: '',
    anchorEl: null,
  };

  componentWillMount() {
    /*this.fetchClients(
      this.state.page,
      this.state.rowsPerPage,
      this.state.columnSort,
      this.state.order,
      this.state.search
    );*/
  }

  fetchClients = (
    page,
    rowsPerPage,
    columnSearch,
    columnSort,
    order,
    filter
  ) => {
    if (columnSearch === 'code' && /\D/.test(filter)) {
      this.setState({
        messageOpen: true,
        messageText: 'Informe somente números na pesquisa por código.',
        variantMessage: 'warning',
      });
      return;
    }

    let filterType = '';
    if (columnSearch === 'code') filterType = 'eq';
    else filterType = 'rg';

    clientservice.count(columnSearch, filterType, filter).then(res => {
      if (filter !== '' && parseInt(res.data.value) === 0) {
        this.setState({
          messageOpen: true,
          messageText: 'Não foi encontrado nenhum cliente com o filtro.',
          variantMessage: 'warning',
        });
      }
      this.setState({ countClients: res.data.value });
    });
    const skip = page * rowsPerPage;
    clientservice
      .getAll(
        skip,
        rowsPerPage,
        columnSearch,
        columnSort,
        order,
        filterType,
        filter
      )
      .then(res => {
        this.setState({
          stateData: 'LIST',
          inEdit: false,
          selectedIndex: '0',
          clients: res.data,
          data: {
            _id: '',
            name: '',
            cpf: '',
            registry_date: new Date(),
            date_of_birth: null,
            place_of_birth: '',
            address: '',
            neighborhood: '',
            city: '',
            state: '',
            postal_code: '',
            seller: '',
            job_name: '',
            occupation: '',
            spouse: '',
            phone1: '',
            phone2: '',
            note: '',
            bills_receives: [],
          },
          page: page,
          rowsPerPage: rowsPerPage,
          columnSort: columnSort,
          columnSearch: columnSearch,
          order: order,
        });
      })
      .catch(error =>
        this.setState({
          messageOpen: true,
          messageText: getErrosFromApi(error),
          variantMessage: 'error',
        })
      );
  };

  checkCpf = () => {
    console.log(this.state.inEdit, this.state.data._id, this.state.data.cpf);
    const cpf = this.state.data.cpf.replace(/\D+/g, '');
    clientservice
      .existCpf(this.state.inEdit ? 1 : 0, this.state.data._id, cpf)
      .then(res => {
        if (!res.data === 'OK') {
          this.setState({
            messageOpen: true,
            messageText: getErrosFromApi(res.data),
            variantMessage: 'warning',
          });
        }
      })
      .catch(error =>
        this.setState({
          messageOpen: true,
          messageText: getErrosFromApi(error),
          variantMessage: 'error',
        })
      );
  };

  handleCreate = () => {
    this.setState({
      stateData: 'EDIT_INSERT',
      data: {
        _id: '',
        name: '',
        cpf: '',
        registry_date: new Date(),
        date_of_birth: null,
        place_of_birth: '',
        address: '',
        neighborhood: '',
        city: '',
        state: '',
        postal_code: '',
        seller: '',
        job_name: '',
        occupation: '',
        spouse: '',
        phone1: '',
        phone2: '',
        note: '',
        bills_receives: [],
      },
    });
  };

  handleValueChange = name => event => {
    this.setState({ data: { ...this.state.data, [name]: event.target.value } });
  };

  handleCepChange = event => {
    this.setState({
      data: { ...this.state.data, postal_code: event.target.value },
    });
    if (event.target.value.length === 8) {
      axios
        .get(`https://viacep.com.br/ws/${event.target.value}/json/`)
        .then(res => {
          if (res.data.erro) return;
          this.setState({
            data: {
              ...this.state.data,
              neighborhood: res.data.bairro,
              city: res.data.localidade,
              address: res.data.logradouro,
              state: res.data.uf,
            },
          });
        });
      // bairro: "Vila Espírito Santo"
      // cep: "35500-260"
      // complemento: ""
      // gia: ""
      // ibge: "3122306"
      // localidade: "Divinópolis"
      // logradouro: "Rua Itaguara"
      // uf: "MG"
      // unidade: ""
    }
  };

  handleDateValueChange = name => date => {
    this.setState({ data: { ...this.state.data, [name]: date } });
  };

  handleCancel = previusOperation => {
    let nextState = { stateData: 'LIST' };
    if (previusOperation === 'SAVE') {
      nextState.messageOpen = true;
      nextState.messageText = 'Cliente salvo com suceso!';
      nextState.variantMessage = 'success';
    } else if (previusOperation === 'DELETE') {
      nextState.messageOpen = true;
      nextState.messageText = 'Cliente excluído com suceso!';
      nextState.variantMessage = 'success';
    }
    this.setState(nextState);
    this.fetchClients(
      this.state.page,
      this.state.rowsPerPage,
      this.state.columnSearch,
      this.state.columnSort,
      this.state.order,
      this.state.search
    );
  };

  handleSave = callback => {
    if (this.state.inEdit) {
      let _data = {
        ...this.state.data,
        phone1: this.state.data.phone1.replace(/\D/g, ''),
        phone2: this.state.data.phone2.replace(/\D/g, ''),
      };
      clientservice
        .update(_data)
        .then(res => {
          if (callback && typeof callback === 'function') {
            this.setState(
              {
                ...this.state,
                messageOpen: true,
                messageText: 'Cliente salvo com suceso!',
                variantMessage: 'success',
                data: res.data,
              },
              callback
            );
          } else this.handleCancel('SAVE');
        })
        .catch(error =>
          this.setState({
            messageOpen: true,
            messageText: getErrosFromApi(error),
            variantMessage: 'error',
          })
        );
    } else {
      let _data = {
        ...this.state.data,
        _id: undefined,
        phone1: this.state.data.phone1.replace(/\D/g, ''),
        phone2: this.state.data.phone2.replace(/\D/g, ''),
      };
      clientservice
        .create(_data)
        .then(res => {
          if (callback && typeof callback === 'function') {
            this.setState(
              {
                ...this.state,
                inEdit: true,
                messageOpen: true,
                messageText: 'Cliente salvo com suceso!',
                variantMessage: 'success',
                data: res.data,
              },
              callback
            );
          } else this.handleCancel('SAVE');
        })
        .catch(error =>
          this.setState({
            messageOpen: true,
            messageText: getErrosFromApi(error),
            variantMessage: 'error',
          })
        );
    }
  };

  handleDelete = key => {
    Confirm('Atenção', 'Confirma a exclusão?', () =>
      clientservice
        .remove(this.state.clients[key]._id)
        .then(() => this.handleCancel('DELETE'))
        .catch(error => {
          this.setState({
            messageOpen: true,
            messageText: getErrosFromApi(error),
            variantMessage: 'error',
          });
        })
    );
  };

  handleEdit = key => {
    this.setState({
      stateData: 'EDIT_INSERT',
      selectedIndex: key,
      inEdit: true,
      data: this.state.clients[key],
    });
  };

  handleChangePage = (event, page) => {
    this.fetchClients(
      page,
      this.state.rowsPerPage,
      this.state.columnSearch,
      this.state.columnSort,
      this.state.order,
      this.state.search
    );
  };

  handleChangeRowsPerPage = event => {
    this.fetchClients(
      this.state.page,
      parseInt(event.target.value),
      this.state.columnSearch,
      this.state.columnSort,
      this.state.order,
      this.state.search
    );
  };

  handleSort = property => event => {
    let order = 'asc';
    if (this.state.columnSort === property && this.state.order === 'asc') {
      order = 'desc';
    }
    this.fetchClients(
      this.state.page,
      this.state.rowsPerPage,
      this.state.columnSearch,
      property,
      order,
      this.state.search
    );
  };

  handleRequestSearch = event => {
    if (this.state.columnSearch !== event.target.value) {
      this.fetchClients(
        this.state.page,
        this.state.rowsPerPage,
        event.target.value,
        this.state.columnSort,
        this.state.order,
        this.state.search
      );
    }
  };

  handleSearch = () => {
    this.fetchClients(
      this.state.page,
      this.state.rowsPerPage,
      this.state.columnSearch,
      this.state.columnSort,
      this.state.order,
      this.state.search
    );
  };

  handleChangeTextSearch = event => {
    this.setState({ search: event.target.value.toUpperCase() });
    //this._searchDebounce();
  };

  handleMessageClose = () => {
    this.setState({ ...this.state, messageOpen: false });
  };

  handleOpenMessage = (messageOpen, variantMessage, messageText) => {
    this.setState({
      messageOpen: messageOpen,
      messageText: messageText,
      variantMessage: variantMessage,
    });
  };

  render() {
    const { classes } = this.props;
    const {
      stateData,
      clients,
      selectedIndex,
      data,
      page,
      rowsPerPage,
      countClients,
      order,
      columnSearch,
      columnSort,
      search,
      messageOpen,
      variantMessage,
      messageText,
    } = this.state;
    return (
      <div className={classes.root}>
        <MessageSnackbar
          onClose={this.handleMessageClose}
          open={messageOpen}
          variant={variantMessage}
          message={messageText}
        />
        {stateData === 'LIST' && (
          <ViewClient
            selectedIndex={selectedIndex}
            handleClick={this.handleClick}
            clients={clients}
            handleEdit={this.handleEdit}
            handleDelete={this.handleDelete}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={this.handleChangePage}
            handleChangeRowsPerPage={this.handleChangeRowsPerPage}
            countClients={countClients}
            handleSort={this.handleSort}
            order={order}
            columnSearch={columnSearch}
            columnSort={columnSort}
            handleRequestSearch={this.handleRequestSearch}
            handleSearch={this.handleSearch}
            handleChangeTextSearch={this.handleChangeTextSearch}
            search={search}
            handleCreate={this.handleCreate}
          />
        )}
        {stateData === 'EDIT_INSERT' && (
          <EditClient
            handleValueChange={this.handleValueChange}
            clientData={data}
            handleCancel={this.handleCancel}
            handleSave={this.handleSave}
            handleDateValueChange={this.handleDateValueChange}
            handleOpenMessage={this.handleOpenMessage}
            handleCepChange={this.handleCepChange}
            handleCheckCpf={this.checkCpf}
          />
        )}
      </div>
    );
  }
}

Client.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Client);
