import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import DateFnsUtils from '@date-io/date-fns';
import ptLocale from 'date-fns/locale/pt-BR';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import SearchIcon from '@material-ui/icons/Search';

import classNames from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';

import { getLogs } from '../../services/logService';

const styles = theme => ({
  root: {
    width: `calc(100% - ${theme.spacing.unit * 6}px)`,
    margin: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit * 2
  },
  itens: {
    paddingLeft: theme.spacing.unit,
    marginTop: `${theme.spacing.unit * 1}px !important `
  },
  item: {
    paddingTop: `${theme.spacing.unit * 0.2}px !important `,
    paddingBottom: `${theme.spacing.unit * 0.2}px !important `
  },
  textField: {
    marginTop: '0px',
    marginBotton: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  table: {
    minWidth: 700
  }
});

class ViewLog extends Component {
  state = {
    logs: [],
    initialDate: new Date(),
    finalDate: new Date()
  };

  fetchLogs = () => {
    getLogs(this.state.initialDate, this.state.finalDate).then(res => {
      console.log(res.data);
      this.setState({ logs: res.data });
    });
  };

  handleDateValue = name => date => {
    this.setState({ [name]: date });
  };

  componentWillMount() {
    this.fetchLogs();
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <Grid container className={classes.itens} spacing={24}>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptLocale}>
            <Grid
              className={classes.item}
              item
              xs={12}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <Tooltip
                title="Data inicial"
                placement={'bottom-start'}
                enterDelay={300}
              >
                <DateTimePicker
                  id="initial_date"
                  label="Data Inicial"
                  className={classes.textField}
                  value={this.state.finalDate}
                  onChange={this.handleDateValue('finalDate')}
                  margin="normal"
                  format={'dd/MM/yyyy hh:mm'}
                  fullWidth
                  keyboard
                  cancelLabel={'Cancelar'}
                  ref="initial_date"
                />
              </Tooltip>
            </Grid>
            <Grid
              className={classes.item}
              item
              xs={12}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <Tooltip
                title="Data final"
                placement={'bottom-start'}
                enterDelay={300}
              >
                <DateTimePicker
                  id="final_date"
                  label="Data Final"
                  className={classes.textField}
                  value={this.state.initialDate}
                  onChange={this.handleDateValue('initialDate')}
                  margin="normal"
                  format={'dd/MM/yyyy hh:mm'}
                  fullWidth
                  keyboard
                  cancelLabel={'Cancelar'}
                  ref="final_date"
                />
              </Tooltip>
            </Grid>
            <Grid
              className={classNames(classes.item, classes.gridIcon)}
              item
              xs={12}
              sm={4}
              md={4}
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
                  size="small"
                >
                  <SearchIcon />
                </Fab>
              </Tooltip>
            </Grid>
          </MuiPickersUtilsProvider>
        </Grid>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">Data da venda</TableCell>
              <TableCell padding="checkbox">Título</TableCell>
              <TableCell padding="checkbox">Parcela</TableCell>
              <TableCell padding="checkbox">Data de vencimento</TableCell>
              <TableCell padding="checkbox">Data de pagamento</TableCell>
              <TableCell padding="checkbox">Valor</TableCell>
              <TableCell padding="checkbox">Valor pago</TableCell>
              <TableCell className={classes.headerAcoes} align="right">
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(clients).map(key => (
              <TableRow hover key={key}>
                <TableCell padding="checkbox">{clients[key].name}</TableCell>
                <TableCell padding="checkbox">{clients[key].cpf}</TableCell>
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
        </Table>
      </Paper>
    );
  }
}

export default withStyles(styles)(ViewLog);

ViewLog.propTypes = {
  classes: PropTypes.object.isRequired
};
