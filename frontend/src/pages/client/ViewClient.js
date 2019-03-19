import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import classNames from 'classnames';
import SearchIcon from '@material-ui/icons/Search';

import TablePaginationActions from '../../components/common/TablePaginationActions';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  fab: {
    marginRight: theme.spacing.unit * 0.5,
    color: theme.palette.common.white
  },
  fabEdit: {
    backgroundColor: theme.palette.edit.main,     
    '&:hover': {
        backgroundColor: theme.palette.edit.dark,
    },
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  headerAcoes: {
      paddingRight: `${theme.spacing.unit * 4}px !important`
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  selectSearch: {
    margin: theme.spacing.unit,
    width: 120
  },
  textFieldSearch: {
    margin: theme.spacing.unit,
    width: 'calc(100% - 220px)',
  },
  headerCpf: {
    paddingLeft: `${theme.spacing.unit * 5}px !important`
  },
  searchIcon: {
    margin: theme.spacing.unit * 2,
  }
});

function ViewClient(props) {
  const { classes, 
          handleEdit, 
          handleDelete, 
          clients, 
          page, 
          rowsPerPage,
          handleChangePage,
          handleChangeRowsPerPage,
          countClients, 
          handleSort,
          order,
          columnSort,
          handleRequestSort,
          search,
          handleSearch,
          handleChangeTextSearch
         } = props;
  return (
    <Paper className={classes.root}>
      <div className={classes.searchContainer}>
        <FormControl className={classes.selectSearch}>
          <InputLabel htmlFor="sort">Pesquisar por</InputLabel>
          <Select
            value={columnSort}
            onChange={handleRequestSort}
            inputProps={{
              name: 'sort',
              id: 'sort',
            }}
          >
            <MenuItem value={'name'}>Nome</MenuItem>
            <MenuItem value={'cpf'}>Cpf</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.textFieldSearch}>
          <InputLabel htmlFor="search">Digite a pesquisa</InputLabel>
          <Input id="search" value={search} onChange={handleChangeTextSearch}/>
        </FormControl>
        <Fab 
          color="primary" 
          aria-label="Pesquisar" 
          className={classNames(classes.fab, classes.searchIcon)}      
          onClick={handleSearch}                          
          size="small"
        >
          <SearchIcon />
        </Fab>
      </div>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell padding='checkbox'>
              <Tooltip
                title="Ordenar"
                placement={'bottom-start'}
                enterDelay={300}
              >
                <TableSortLabel
                  active={columnSort === 'name'}
                  direction={order}
                  onClick={handleSort('name')}
                >
                  Nome
                </TableSortLabel>
              </Tooltip>
            </TableCell>
            <TableCell className={classes.headerCpf}>
            <Tooltip
                title="Ordenar"
                placement={'bottom-start'}
                enterDelay={300}
              >
                <TableSortLabel
                  active={columnSort === 'cpf'}
                  direction={order}
                  onClick={handleSort('cpf')}
                >
                  CPF
                </TableSortLabel>
              </Tooltip>
            </TableCell>            
            <TableCell className={classes.headerAcoes} align='right'>Ações</TableCell>   
          </TableRow>
        </TableHead>
        <TableBody>
            {Object.keys(clients).map(key => (
                    <TableRow 
                      hover
                      key={key}
                    >
                        <TableCell padding='checkbox'>{clients[key].name}</TableCell>
                        <TableCell padding='checkbox'>{clients[key].cpf}</TableCell>
                        <TableCell padding='none' align='right'>
                            <Fab 
                              color="primary" 
                              aria-label="Edit" 
                              className={classNames(classes.fab, classes.fabEdit)}                                
                              onClick={() => handleEdit(key)}
                              size="small"
                            >
                              <Icon fontSize="small">edit_icon</Icon>
                            </Fab>
                            <Fab 
                              color="secondary"
                              aria-label="Delete" 
                              className={classes.fab}
                              onClick={() => handleDelete(key)}
                              size="small"
                            >
                              <Icon fontSize="small">delete_icon</Icon>
                            </Fab>                             
                        </TableCell>     
                    </TableRow>
                ))
            }
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              colSpan={3}
              count={countClients}
              rowsPerPage={rowsPerPage}
              page={page}
              labelDisplayedRows={({ from, to, count }) => `Clientes ${from} até ${to} de ${count}`}
              labelRowsPerPage={'Clientes por página:'}
              SelectProps={{
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </Paper>
  );
}

ViewClient.propTypes = {
  classes: PropTypes.object.isRequired,
  clients: PropTypes.array.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired, 
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  handleChangePage: PropTypes.func.isRequired, 
  handleChangeRowsPerPage: PropTypes.func.isRequired, 
  countClients: PropTypes.number.isRequired,
  handleSort: PropTypes.func.isRequired, 
  order: PropTypes.string.isRequired,
  columnSort: PropTypes.string.isRequired,
  handleRequestSort: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  handleChangeTextSearch: PropTypes.func.isRequired,
};

export default withStyles(styles)(ViewClient);
