import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { KeyboardTimePicker } from '@material-ui/pickers';
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
    width: `calc(100% - ${theme.spacing(6)}px)`,
    margin: theme.spacing(3),
    paddingTop: theme.spacing(2),
    overflowX: 'auto',
  },
  itens: {
    paddingLeft: theme.spacing(1),
    marginTop: `${theme.spacing(1)}px !important `,
    width: `calc(100% - ${theme.spacing(6)}px)`,
  },
  item: {
    paddingTop: `${theme.spacing(1)}px !important `,
    paddingBottom: `${theme.spacing(2)}px !important `,
  },
  textField: {
    marginTop: '0px',
    marginBotton: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  table: {
    minWidth: 500,
  },
});

class ViewLog extends Component {
  state = {
    logs: [],
    initialDate: new Date(),
    finalDate: new Date(),
  };

  fetchLogs = () => {
    getLogs(this.state.initialDate, this.state.finalDate).then(res => {
      console.log(res);
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
    const { logs } = this.state;
    return (
      <Paper className={classes.root}>
        <Grid container className={classes.itens} spacing={3}>
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
              <KeyboardTimePicker
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
              <KeyboardTimePicker
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
        </Grid>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">Usuário</TableCell>
              <TableCell padding="checkbox">Tela</TableCell>
              <TableCell padding="checkbox">Data</TableCell>
              <TableCell padding="checkbox">Operação</TableCell>
              <TableCell padding="checkbox">Campo</TableCell>
              <TableCell padding="checkbox">Valor Novo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(logs).map(key => (
              <TableRow hover key={key}>
                <TableCell padding="checkbox">{logs[key].userName}</TableCell>
                <TableCell padding="checkbox">{logs[key].tableName}</TableCell>
                <TableCell padding="checkbox">
                  {getDateTimeToString(logs[key].date)}
                </TableCell>
                <TableCell padding="checkbox">{logs[key].operation}</TableCell>
                <TableCell padding="checkbox">{logs[key].fieldName}</TableCell>
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
  classes: PropTypes.object.isRequired,
};
