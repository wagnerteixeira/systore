import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import EditClient from './EditClient';
import ViewClient from './ViewClient';

import clientservice from '../../services/clientService';
import billsReceiveservice from '../../services/billsReceiveService';

import { debounceTime } from '../../utils/operators';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3
  },
});

class Client extends Component {
  constructor(props) {
    super(props);
    this._searchDebounce = debounceTime(500, this.handleSearch);
  }
  state = {
    tabValue: 'LIST',
    inEdit: false,    
    selectedIndex: '0',
    clients: [],
    countClients: 0,
    data: {
      _id : '',
      name: '',
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
      bills_receives: [],
    },
    page: 0,
    rowsPerPage: 5,
    order: 'asc',
    columnSort: 'name',
    search: ''
  };

  componentWillMount() {
    this.fetchClients(this.state.page, this.state.rowsPerPage, this.state.columnSort, this.state.order, this.state.search);
  }

  fetchClients = (page, rowsPerPage, columnSort, order, filter) => {
    
    clientservice.count(columnSort, filter).then(res => this.setState({ countClients: res.data.value }));
    const skip = page * rowsPerPage;  
    clientservice.getAll(skip, rowsPerPage, columnSort, order, filter)
      .then(res => {                 
        this.setState({
            tabValue: 'LIST', 
            inEdit: false,
            selectedIndex: '0',
            clients: res.data,            
            data: {
              _id : '',
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
            order: order
        });            
      })
      .catch(error => console.log(error));
  }

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  handleValueChange = name => event => {
    this.setState({ data: { ...this.state.data, [name]: event.target.value}})
  };  

  handleDateValueChange = name => date => {
    this.setState({ data: { ...this.state.data, [name]: date}});
  }

  handleCancel = () => {
    this.setState({ tabValue: 'LIST'});
    this.fetchClients(this.state.page, this.state.rowsPerPage, this.state.columnSort, this.state.order, this.state.search);
  }

  handleSave = () => {   
    this.state.data.phone1 = this.state.data.phone1.replace(/\D/g, '');
    this.state.data.phone2 = this.state.data.phone2.replace(/\D/g, '');
    if (this.state.inEdit){     
      clientservice.update(this.state.data)
        .then(() => this.handleCancel())
        .catch((error) => console.log(error));
    } else {
      this.state.data._id = undefined;      
      clientservice.create(this.state.data)
        .then(() => this.handleCancel())
        .catch((error) => console.log(error));
    }
  }    

  handleDelete = (key) => {
    clientservice.remove(this.state.data._id)
      .then(() =>  this.fetchClients(this.state.page, this.state.rowsPerPage, this.state.columnSort, this.state.order, this.state.search))
      .catch((error) => console.log(error));
    
  }

  handleEdit = (key) => {      
    this.setState({    
      tabValue: 'EDIT', 
      selectedIndex: key,
      inEdit: true,
      data: this.state.clients[key],      
    });     
    console.log(key);
    console.log(this.state.clients[key]._id);
    billsReceiveservice.getBillsReceiveServiceByClient(this.state.clients[key]._id)
      .then(res => {this.setState({data : { ...this.state.data, bills_receives: res.data}})})
      .catch((error) => console.log(error));
  }

  handleChangePage = (event, page) => {
    this.fetchClients(page, this.state.rowsPerPage, this.state.columnSort, this.state.order, this.state.search);
  };

  handleChangeRowsPerPage = event => {
    this.fetchClients(this.state.page, parseInt(event.target.value), this.state.columnSort, this.state.order, this.state.search);
  };

  handleSort = property => event => {
    let order = 'asc';
    if (this.state.columnSort === property && this.state.order === 'asc') {
      order = 'desc';
    }
    
    this.fetchClients(this.state.page, this.state.rowsPerPage, property, order, this.state.search);
  };

  handleRequestSort = event => {
    if (this.state.columnSort !== event.target.value)
      this.handleSort(event.target.value)(event);
  };

  handleSearch = () => {
    if (this.state.search.length > 0)
      this.fetchClients(this.state.page, this.state.rowsPerPage, this.state.columnSort, this.state.order, this.state.search);
  }

  handleChangeTextSearch = (event) => {
    this.setState({ search: event.target.value.toUpperCase() });    
    this._searchDebounce();
  }


  render() {
    const { classes } = this.props;
    const { 
      tabValue, 
      inEdit,       
      clients,
      selectedIndex,
      data,
      page,
      rowsPerPage,
      countClients,
      order,
      columnSort,
      search
    } = this.state;   
    return (        
      <div className={classes.root}>
        <Tabs 
            value={tabValue} 
            onChange={this.handleTabChange}
            indicatorColor='primary'
            textColor='primary'
        >
              {!inEdit && <Tab value='LIST' label='LISTAR' />}
              <Tab value='EDIT' label={inEdit ? 'ALTERAR' : 'INCLUIR'} />                    
        </Tabs>   
        {tabValue === 'LIST' && 
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
            />}
        {tabValue === 'EDIT' && 
            <EditClient 
                handleValueChange={this.handleValueChange}
                data={data}
                handleCancel={this.handleCancel}
                handleSave={this.handleSave}    
                handleDateValueChange={this.handleDateValueChange}
            />}
      </div>
    );
  }
}

Client.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Client);