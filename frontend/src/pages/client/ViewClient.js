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
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';

import TablePaginationActions from '../../components/common/TablePaginationActions';
import { getDateToString } from '../../utils/operators';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  fab: {
    marginRight: `${theme.spacing(1)}px !important`,
    color: theme.palette.common.white,
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
    paddingRight: `${theme.spacing(4)}px !important`,
  },
  margin: {
    margin: theme.spacing(1),
  },
  headerCpf: {
    paddingLeft: `${theme.spacing(5)}px !important`,
  },
  searchIcon: {
    margin: `${theme.spacing(2)}px 2px`,
  },
  itens: {
    paddingTop: theme.spacing(2),
  },
  item: {
    paddingTop: `${theme.spacing(0.2)}px !important `,
    paddingBottom: `${theme.spacing(0.2)}px !important `,
  },
  gridSearch: {
    paddingLeft: `${theme.spacing(0.2)}px !important `,
    [theme.breakpoints.down('xs')]: {
      marginLeft: theme.spacing(1),
    },
  },
  gridIcon: {
    paddingLeft: `${theme.spacing(2)}px !important `,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('md')]: {
      marginRight: `${theme.spacing(3)}px !important `,
    },
  },
});

function ViewClient(props) {
  const {
    classes,
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
    columnSearch,
    columnSort,
    handleRequestSearch,
    search,
    handleSearch,
    handleChangeTextSearch,
    handleCreate,
  } = props;  
  return (
    <Paper className={classes.root}>
      <Grid container className={classes.itens} spacing={24}>
        <Grid className={classes.item} item xs={12} sm={2} md={2} lg={2} xl={2}>
          <FormControl fullWidth className={classes.margin}>
            <InputLabel htmlFor="sort">Pesquisar por</InputLabel>
            <Select
              value={columnSearch}
              onChange={handleRequestSearch}
              inputProps={{
                name: 'sort',
                id: 'sort',
              }}
            >
              <MenuItem value={'code'}>Código</MenuItem>
              <MenuItem value={'name'}>Nome</MenuItem>
              <MenuItem value={'cpf'}>Cpf</MenuItem>
              <MenuItem value={'date_of_birth'}>Data de nascimento</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid
          className={classNames(classes.item, classes.gridSearch)}
          item
          xs={12}
          sm={9}
          md={9}
          lg={8}
          xl={8}
        >
          <FormControl fullWidth className={classes.margin}>
            <InputLabel htmlFor="search">Digite a pesquisa</InputLabel>
            <Input
              fid="search"
              value={search}
              onChange={handleChangeTextSearch}
              onKeyPress={ev => (ev.key === 'Enter' ? handleSearch() : '')}
            />
          </FormControl>
        </Grid>
        <Grid
          className={classNames(classes.item, classes.gridIcon)}
          item
          xs={12}
          sm={12}
          md={12}
          lg={2}
          xl={2}
        >
          <Tooltip
            title="Pesquisar"
            placement={'bottom-start'}
            enterDelay={300}
          >
            <Fab
              color="primary"
              aria-label="Pesquisar"
              className={classNames(classes.fab, classes.searchIcon)}
              onClick={handleSearch}
              size="small"
            >
              <SearchIcon />
            </Fab>
          </Tooltip>
          <Tooltip
            title="Incluir Cliente"
            placement={'bottom-start'}
            enterDelay={300}
          >
            <Fab
              color="primary"
              aria-label="Pesquisar"
              className={classNames(classes.fab, classes.searchIcon)}
              onClick={handleCreate}
              size="small"
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        </Grid>
      </Grid>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell size="small">
              <Tooltip
                title="Ordenar"
                placement={'bottom-start'}
                enterDelay={300}
              >
                <TableSortLabel
                  active={columnSort === 'code'}
                  direction={order}
                  onClick={handleSort('code')}
                >
                  Código
                </TableSortLabel>
              </Tooltip>
            </TableCell>
            <TableCell size="small">
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
            <TableCell >
              <Tooltip
                title="Ordenar"
                placement={'bottom-start'}
                enterDelay={300}
              >
                <TableSortLabel
                  active={columnSort === 'date_of_birth'}
                  direction={order}
                  onClick={handleSort('date_of_birth')}
                >
                  Data de nascimento
                </TableSortLabel>
              </Tooltip>
            </TableCell>            
            <TableCell className={classes.headerAcoes} align="right">
              Ações
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(clients).map(key => (
            <TableRow hover key={key}>
              <TableCell size="small">{clients[key].code}</TableCell>
              <TableCell size="small">{clients[key].name}</TableCell>
              <TableCell size="small">{clients[key].cpf}</TableCell>
              <TableCell size="small">{getDateToString(clients[key].date_of_birth)}</TableCell>
              <TableCell padding="none" align="right">
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
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              colSpan={3}
              count={countClients}
              rowsPerPage={rowsPerPage}
              page={page}
              labelDisplayedRows={({ from, to, count }) =>
                `Clientes ${from} até ${to} de ${count}`
              }
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
  columnSearch: PropTypes.string.isRequired,
  columnSort: PropTypes.string.isRequired,
  handleRequestSearch: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  handleChangeTextSearch: PropTypes.func.isRequired,
  handleCreate: PropTypes.func.isRequired,
};

export default React.memo(withStyles(styles)(ViewClient));
