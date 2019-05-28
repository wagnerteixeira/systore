import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MessageSnackbar from '../../components/common/MessageSnackbar';

import EditUser from './EditUser';
import ViewUser from './ViewUser';

import userservice from '../../services/userService';

import Confirm from '../../components/common/ConfirmAlert';
import { debounceTime } from '../../utils/operators';
import { getErrosFromApi } from '../../utils/errorsHelper';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
});

class User extends Component {
  constructor(props) {
    super(props);
    this._searchDebounce = debounceTime(500, this.handleSearch);
  }

  state = {
    stateData: 'LIST',
    inEdit: false,
    selectedIndex: '0',
    users: [],
    countUsers: 0,
    data: {
      _id: '',
      user_name: '',
      email: '',
      password: ''
    },
    page: 0,
    rowsPerPage: 5,
    order: 'asc',
    columnSort: 'user_name',
    search: '',
    messageOpen: false,
    variantMessage: 'success',
    messageText: '',
    anchorEl: null
  };

  componentWillMount() {
    this.fetchUsers(
      this.state.page,
      this.state.rowsPerPage,
      this.state.columnSort,
      this.state.order,
      this.state.search
    );
  }

  fetchUsers = (page, rowsPerPage, columnSort, order, filter) => {
    userservice
      .count(columnSort, filter)
      .then(res => this.setState({ countUsers: res.data.value }));
    const skip = page * rowsPerPage;
    userservice
      .getAll(skip, rowsPerPage, columnSort, order, 'rg', filter)
      .then(res => {
        this.setState({
          stateData: 'LIST',
          inEdit: false,
          selectedIndex: '0',
          users: res.data,
          data: {
            _id: '',
            user_name: '',
            email: '',
            password: '',
            admin: false
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

  handleValueChange = name => event => {
    this.setState({ data: { ...this.state.data, [name]: event.target.value } });
  };

  handleCancel = previusOperation => {
    let nextState = { stateData: 'LIST' };
    if (previusOperation === 'SAVE') {
      nextState.messageOpen = true;
      nextState.messageText = 'Usuário salvo com suceso!';
      nextState.variantMessage = 'success';
    } else if (previusOperation === 'DELETE') {
      nextState.messageOpen = true;
      nextState.messageText = 'Usuário excluído com suceso!';
      nextState.variantMessage = 'success';
    }
    this.setState(nextState);
    this.fetchUsers(
      this.state.page,
      this.state.rowsPerPage,
      this.state.columnSort,
      this.state.order,
      this.state.search
    );
  };

  handleSave = () => {
    if (this.state.inEdit) {
      userservice
        .update(this.state.data)
        .then(() => this.handleCancel('SAVE'))
        .catch(error =>
          this.setState({
            messageOpen: true,
            messageText: getErrosFromApi(error),
            variantMessage: 'error'
          })
        );
    } else {
      let user = {
        user_name: this.state.data.user_name,
        email: this.state.data.email,
        password: this.state.data.password,
        admin: false
      };
      userservice
        .create(user)
        .then(() => this.handleCancel('SAVE'))
        .catch(error => {
          this.setState({
            messageOpen: true,
            messageText: getErrosFromApi(error),
            variantMessage: 'error'
          });
        });
    }
  };

  handleDelete = key => {
    Confirm('Atenção', 'Confirma a exclusão?', () => 
      userservice
        .remove(this.state.users[key]._id)
        .then(() => this.handleCancel('DELETE'))
        .catch(error =>
          this.setState({
            messageOpen: true,
            messageText: getErrosFromApi(error),
            variantMessage: 'error'
          })
        )        
    );
  };

  handleEdit = key => {
    this.setState({
      stateData: 'EDIT_INSERT',
      selectedIndex: key,
      inEdit: true,
      data: this.state.users[key]
    });
  };

  handleCreate = () => {
    this.setState({
      stateData: 'EDIT_INSERT',
      data: {
        _id: '',
        user_name: '',
        email: '',
        password: ''
      }
    });
  };

  handleChangePage = (event, page) => {
    this.fetchUsers(
      page,
      this.state.rowsPerPage,
      this.state.columnSort,
      this.state.order,
      this.state.search
    );
  };

  handleChangeRowsPerPage = event => {
    this.fetchUsers(
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

    this.fetchUsers(
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
    this.fetchUsers(
      this.state.page,
      this.state.rowsPerPage,
      this.state.columnSort,
      this.state.order,
      this.state.search
    );
  };

  handleChangeTextSearch = event => {
    this.setState({ search: event.target.value.toUpperCase() });
    this._searchDebounce();
  };

  handleMessageClose = () => {
    this.setState({ ...this.state, messageOpen: false });
  };

  render() {
    const { classes } = this.props;

    const {
      users,
      selectedIndex,
      data,
      page,
      rowsPerPage,
      countUsers,
      order,
      columnSort,
      search,
      messageOpen,
      variantMessage,
      messageText,
      stateData
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
          <ViewUser
            selectedIndex={selectedIndex}
            handleClick={this.handleClick}
            users={users}
            handleEdit={this.handleEdit}
            handleDelete={this.handleDelete}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={this.handleChangePage}
            handleChangeRowsPerPage={this.handleChangeRowsPerPage}
            countUsers={countUsers}
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
          <EditUser
            handleValueChange={this.handleValueChange}
            data={data}
            handleCancel={this.handleCancel}
            handleSave={this.handleSave}
          />
        )}
      </div>
    );
  }
}

User.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(User);
