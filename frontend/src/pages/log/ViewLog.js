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
import { getDateTimeToString } from '../../utils/operators';

const styles = theme => ({
  root: {
    width: `calc(100% - ${theme.spacing.unit * 6}px)`,
    margin: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit * 2,
    overflowX: 'auto'
  },
  itens: {
    paddingLeft: theme.spacing.unit,
    marginTop: `${theme.spacing.unit * 1}px !important `,
    width: `calc(100% - ${theme.spacing.unit * 6}px)`
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
    minWidth: 500
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
      //console.log(res.data);
      let logs = res.data.flatMap(log => {
        return log.items.map(item => {
          return {
            collectionName: log.collectionName,
            date: log.date,
            operation:
              log.operation == 'C'
                ? 'Criação'
                : log.operation == 'U'
                ? 'Alteração'
                : 'Exclusão',
            user: log.user,
            field: item.field,
            newValue: item.newValue,
            oldValue: item.oldValue
          };
        });
      });
      this.setState({ logs: logs });
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
    const { logs } = this.state;
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
                  value={this.state.initialDate}
                  onChange={this.handleDateValue('initialDate')}
                  margin="normal"
                  format={'dd/MM/yyyy HH:mm'}
                  fullWidth
                  keyboard
                  ampm={false}
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
                  value={this.state.finalDate}
                  onChange={this.handleDateValue('finalDate')}
                  margin="normal"
                  format={'dd/MM/yyyy HH:mm'}
                  fullWidth
                  keyboard
                  ampm={false}
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
                  onClick={this.fetchLogs}
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
              <TableCell padding="checkbox">Usuário</TableCell>
              <TableCell padding="checkbox">Tela</TableCell>
              <TableCell padding="checkbox">Data</TableCell>
              <TableCell padding="checkbox">Operação</TableCell>
              <TableCell padding="checkbox">Campo</TableCell>
              <TableCell padding="checkbox">Valor Anterior</TableCell>
              <TableCell padding="checkbox">Valor Novo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(logs).map(key => (
              <TableRow hover key={key}>
                <TableCell padding="checkbox">{logs[key].user}</TableCell>
                <TableCell padding="checkbox">
                  {logs[key].collectionName}
                </TableCell>
                <TableCell padding="checkbox">
                  {getDateTimeToString(logs[key].date)}
                </TableCell>
                <TableCell padding="checkbox">{logs[key].operation}</TableCell>
                <TableCell padding="checkbox">{logs[key].field}</TableCell>
                <TableCell padding="checkbox">{logs[key].oldValue}</TableCell>
                <TableCell padding="checkbox">{logs[key].newValue}</TableCell>
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
