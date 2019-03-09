import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import classNames from 'classnames';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  button: {
    margin: theme.spacing.unit * 0.15,
    color: theme.palette.common.white,
  },
  buttonEdit: {
    backgroundColor: theme.palette.buttonEdit.main,     
    '&:hover': {
        backgroundColor: theme.palette.buttonEdit.dark,
    },
  },
  acoes: {
      paddingLeft: theme.spacing.unit * 8
  }
});

function ViewPublication(props) {
  const { classes, handleEdit, handleDelete, selectedIndex, clients } = props;
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
                            <Button 
                                variant="fab" 
                                color="primary" 
                                aria-label="Edit" 
                                className={classNames(classes.button, classes.buttonEdit)}
                                mini
                                onClick={() => handleEdit(key)}
                            >
                                <Icon fontSize="small">edit_icon</Icon>                                
                            </Button>
                            <Button 
                                variant="fab" 
                                color='secondary' 
                                aria-label="Delete" 
                                className={classes.button}
                                mini
                                onClick={() => handleDelete(key)}
                            >
                                <Icon fontSize="small">delete_icon</Icon>
                            </Button>                           
                        </TableCell>     
                    </TableRow>
                ))
            }
        </TableBody>
      </Table>
    </Paper>
  );
}

ViewPublication.propTypes = {
  classes: PropTypes.object.isRequired,
  clients: PropTypes.array.isRequired,
};

export default withStyles(styles)(ViewPublication);
