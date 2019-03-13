import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import EditClient from './EditClient';
import ViewClient from './ViewClient';

import clientservice from '../../services/clientService';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3
  },
});

class Client extends Component {
  state = {
    tabValue: 'LIST',
    inEdit: false,    
    selectedIndex: '0',
    clients: [],
    countClients: 0,
    data: {
      _id : '',
      title: '',
      subtitle: '',
      sinopsys: '',      
      urlImage: '',
      position: 0,
    },
    page: 0,
    rowsPerPage: 5,
  };

  componentWillMount() {
    this.fetchClients(this.state.page, this.state.rowsPerPage);
  }

  fetchClients = (page, rowsPerPage) => {
    clientservice.count().then(res => this.setState({ countClients: res.data.value }));
    const skip = page * rowsPerPage;  
    clientservice.getAll(skip, rowsPerPage, '-_id')
      .then(res => {                 
        this.setState({
            tabValue: 'LIST', 
            inEdit: false,
            selectedIndex: '0',
            clients: res.data,            
            data: {
              _id : '',
              name: '',
              cpf: ''
            },
            page: page,
            rowsPerPage: rowsPerPage,
        });            
      })
      .catch(error => console.log(error));
  }

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  handleValueChange = name => event => {
    this.setState({data: { [name]: event.target.value}});
  };  

  handleCancel = () => {
    this.setState({ tabValue: 'LIST'});
    this.fetchClients();
  }

  handleSave = () => {   
    console.log(this.state);
    if (this.state.inEdit){     
      clientservice.update(this.state.data)
        .then(() => this.handleCancel())
        .catch((error) => console.log(error));
    }
    else {
      clientservice.create(this.state.data)
        .then((data) => this.setState({ data: data}))
        .catch((error) => console.log(error));
    }
  }    

  handleDelete = (key) => {
    clientservice.remove(this.state.data._id)
      .then(() =>  this.fetchClients())
      .catch((error) => console.log(error));
    
  }

  handleEdit = (key) => {      
    this.setState({    
      tabValue: 'EDIT', 
      selectedIndex: key,
      inEdit: true,
      data: this.state.clients[key]
    });     
  }

  handleChangePage = (event, page) => {
    this.fetchClients(page, this.state.rowsPerPage);
  };

  handleChangeRowsPerPage = event => {
    this.fetchClients(this.state.page, parseInt(event.target.value));
  };
  
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
      countClients
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
            />}
        {tabValue === 'EDIT' && 
            <EditClient 
                handleValueChange={this.handleValueChange}
                data={data}
                handleCancel={this.handleCancel}
                handleSave={this.handleSave}                    
            />}
      </div>
    );
  }
}

Client.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Client);
