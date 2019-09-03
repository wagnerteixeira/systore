import React, { useState } from 'react';
import MaterialTable from 'material-table';
import classNames from 'classnames';
import {
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Input,
  Fab,
  Tooltip,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

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

function ViewProduct(props) {
  const [selectedRow, setSelectedRow] = useState(null);

  const {
    data,
    actions,
    classes,
    columnSearch,
    search,
    handleSearch,
    handleCreate,
    handleChangeTextSearch,
    handleRequestSearch,
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
              <MenuItem value={'id'}>Código</MenuItem>
              <MenuItem value={'firstDescription'}>Descrição</MenuItem>
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
            title="Incluir Produto"
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
      <MaterialTable
        columns={[
          { title: 'Código', field: 'id', primary: true },
          { title: 'Descrição 1', field: 'firstDescription', primary: true },
        ]}
        data={data}
        title=""
        localization={{
          pagination: {
            labelDisplayedRows: '{from}-{to} de {count}',
            labelRowsSelect: 'Linhas',
            firstAriaLabel: 'Primeira página',
            firstTooltip: 'Primeira página',
            previousAriaLabel: 'Página anterior',
            previousTooltip: 'Página anterior',
            nextAriaLabel: 'Próxima página',
            nextTooltip: 'Próxima página',
            lastAriaLabel: 'Última página',
            lastTooltip: 'Úlitma página',
          },
          toolbar: {
            nRowsSelected: '{0} registro(s) selecionados',
            searchTooltip: 'Procurar',
            searchPlaceholder: 'Procurar',
            exportTitle: 'Gerar arquivo CSV dos dados da tela',
            exportAriaLabel: 'Exportar',
            exportName: 'Exportar',
          },
          header: {
            actions: 'Ações',
          },
          body: {
            emptyDataSourceMessage: 'Nenhum registro selecionado',
            filterRow: {
              filterTooltip: 'Filtro',
            },
          },
        }}
        actions={actions}
        options={{
          filtering: true,
          sorting: true,
          actionsColumnIndex: -1,
          exportButton: true,
          headerStyle: { padding: '8px ' },
          filterCellStyle: { padding: '8px ' },
          rowStyle: rowData => ({
            backgroundColor:
              selectedRow && selectedRow.tableData.id === rowData.tableData.id
                ? '#EEE'
                : '#FFF',
          }),
        }}
        onRowClick={(evt, selectedRow) => setSelectedRow(selectedRow)}
      />
    </Paper>
  );
}

export default withStyles(styles)(ViewProduct);
