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
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab';
import classNames from 'classnames';

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
    margin: theme.spacing.unit,
    color: theme.palette.common.white
  },
  fabEdit: {
    backgroundColor: theme.palette.edit.main,     
    '&:hover': {
        backgroundColor: theme.palette.edit.dark,
    },
  },
  acoes: {
      paddingLeft: theme.spacing.unit * 8
  }
});

function ViewClient(props) {
  const { classes, 
          handleEdit, 
          handleDelete, 
          selectedIndex, 
          clients, 
          page, 
          rowsPerPage,
          handleChangePage,
          handleChangeRowsPerPage,
          countClients
         } = props;
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Cpf</TableCell>            
            <TableCell className={classes.acoes}>Ações</TableCell>   
          </TableRow>
        </TableHead>
        <TableBody>
            {Object.keys(clients).map(key => (
                    <TableRow 
                        key={key}
                        hover
                        //onClick={event => handleClick(event, key)}
                        selected={selectedIndex === key}
                    >
                        <TableCell>{clients[key].name}</TableCell>
                        <TableCell>{clients[key].cpf}</TableCell>
                        <TableCell>
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
  selectedIndex: PropTypes.string.isRequired, 
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  handleChangePage: PropTypes.func.isRequired, 
  handleChangeRowsPerPage: PropTypes.func.isRequired, 
  countClients: PropTypes.number.isRequired,
};

export default withStyles(styles)(ViewClient);
