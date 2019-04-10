import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MessageSnackbar from '../../components/common/MessageSnackbar';

import EditClient from './EditClient';
import ViewClient from './ViewClient';

import clientservice from '../../services/clientService';

//import { debounceTime } from '../../utils/operators';
import { getErrosFromApi } from '../../utils/errorsHelper';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3
  }
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
      registry_date: null,
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
      bills_receives: []
    },
    page: 0,
    rowsPerPage: 5,
    order: 'asc',
    columnSort: 'name',
    search: '',
    messageOpen: false,
    variantMessage: 'success',
    messageText: '',
    anchorEl: null
  };

  componentWillMount() {
    this.fetchClients(
      this.state.page,
      this.state.rowsPerPage,
      this.state.columnSort,
      this.state.order,
      this.state.search
    );
  }

  fetchClients = (page, rowsPerPage, columnSort, order, filter) => {
    clientservice
      .count(columnSort, filter)
      .then(res => this.setState({ countClients: res.data.value }));
    const skip = page * rowsPerPage;
    let filterType = '';
    if (columnSort === 'code') filterType = 'eq';
    else filterType = 'rg';
    clientservice
      .getAll(skip, rowsPerPage, columnSort, order, filterType, filter)
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
            bills_receives: []
          },
          page: page,
          rowsPerPage: rowsPerPage,
          columnSort: columnSort,
          order: order
        });
      })
      .catch(error =>
        this.setState({
          messageOpen: true,
          messageText: getErrosFromApi(error),
          variantMessage: 'error'
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
        bills_receives: []
      }
    });
  };

  handleValueChange = name => event => {
    this.setState({ data: { ...this.state.data, [name]: event.target.value } });
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
      this.state.columnSort,
      this.state.order,
      this.state.search
    );
  };

  handleSave = () => {
    if (this.state.inEdit) {
      let _data = {
        ...this.state.data,
        phone1: this.state.data.phone1.replace(/\D/g, ''),
        phone2: this.state.data.phone2.replace(/\D/g, '')
      };
      clientservice
        .update(_data)
        .then(() => this.handleCancel('SAVE'))
        .catch(error =>
          this.setState({
            messageOpen: true,
            messageText: getErrosFromApi(error),
            variantMessage: 'error'
          })
        );
    } else {
      let _data = {
        ...this.state.data,
        _id: undefined,
        phone1: this.state.data.phone1.replace(/\D/g, ''),
        phone2: this.state.data.phone2.replace(/\D/g, '')
      };
      clientservice
        .create(_data)
        .then(() => this.handleCancel('SAVE'))
        .catch(error =>
          this.setState({
            messageOpen: true,
            messageText: getErrosFromApi(error),
            variantMessage: 'error'
          })
        );
    }
  };

  handleDelete = key => {
    clientservice
      .remove(this.state.clients[key]._id)
      .then(() => this.handleCancel('DELETE'))
      .catch(error => {
        this.setState({
          messageOpen: true,
          messageText: getErrosFromApi(error),
          variantMessage: 'error'
        });
      });
  };

  handleEdit = key => {
    this.setState({
      stateData: 'EDIT_INSERT',
      selectedIndex: key,
      inEdit: true,
      data: this.state.clients[key]
    });
  };

  handleChangePage = (event, page) => {
    this.fetchClients(
      page,
      this.state.rowsPerPage,
      this.state.columnSort,
      this.state.order,
      this.state.search
    );
  };

  handleChangeRowsPerPage = event => {
    this.fetchClients(
      this.state.page,
      parseInt(event.target.value),
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
      property,
      order,
      this.state.search
    );
  };

  handleRequestSort = event => {
    if (this.state.columnSort !== event.target.value)
      this.handleSort(event.target.value)(event);
  };

  handleSearch = () => {
    this.fetchClients(
      this.state.page,
      this.state.rowsPerPage,
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
      variantMessage: variantMessage
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
      columnSort,
      search,
      messageOpen,
      variantMessage,
      messageText
    } = this.state;
    return (
      <div className={classes.root}>
        <MessageSnackbar
          handleClose={this.handleMessageClose}
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
            columnSort={columnSort}
            handleRequestSort={this.handleRequestSort}
            handleSearch={this.handleSearch}
            handleChangeTextSearch={this.handleChangeTextSearch}
            search={search}
            handleCreate={this.handleCreate}
          />
        )}
        {stateData === 'EDIT_INSERT' && (
          <EditClient
            handleValueChange={this.handleValueChange}
            data={data}
            handleCancel={this.handleCancel}
            handleSave={this.handleSave}
            handleDateValueChange={this.handleDateValueChange}
            handleOpenMessage={this.handleOpenMessage}
          />
        )}
      </div>
    );
  }
}

Client.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Client);
