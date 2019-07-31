import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

import ModalWrapped from '../../components/common/Modal';

const headRows = [
  { id: 'address', numeric: false, disablePadding: false, label: 'Rua' },
  { id: 'postalCode', numeric: false, disablePadding: false, label: 'Cep' },
  { id: 'neighborhood', numeric: false, disablePadding: false, label: 'Bairro' },
];

function EnhancedTableHead(props) {
  const {
    order,
    orderBy,
  } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell
          key={'0'}
        >
        </TableCell>
        {headRows.map(row => (
          <TableCell
            key={row.id}
            align={row.numeric ? 'right' : 'left'}
            padding={row.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === row.id ? order : false}
          >
            {row.label}
          </TableCell>

        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
    overflowY: 'auto',
    maxHeight: theme.spacing(50)
  },
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    outline: 'none',
    width: theme.spacing(130),
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export function ChoosePostalCode(props) {
  const classes = useStyles();
  const [selected, setSelected] = React.useState([]);

  const { open, handleClose, rows, handlePostalCodeChange } = props;
  
  useEffect(() => {
    let newSelected = [rows.length > 0 ? rows[0].postalCode : ''];    
    setSelected(newSelected);
  }, [rows])

  function handleClick(event, postalCode) {
    let newSelected = [].concat(postalCode);
    setSelected(newSelected);
  }

  function handleChoosePostalCode() {
    if (selected.length > 0) {
      let row = rows.find(item => item.postalCode === selected[0]);
      let e = { target: { value: row } }      
      handleClose(e, 'sucess');
      handlePostalCodeChange(e, 'choosePostalCode');
    }
  }

  const isSelected = _postalCode => selected.indexOf(_postalCode) !== -1;

  return (
    <ModalWrapped onClose={handleClose} open={open} paperClass={classes.paper}>
      <div className={classes.tableWrapper}>
        <Table className={classes.table} aria-labelledby="tableTitle">
          <EnhancedTableHead />
          <TableBody>
            {(rows ? rows : []).map((row, index) => {
              const isItemSelected = isSelected(row.postalCode);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  onClick={event => handleClick(event, row.postalCode)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.name}
                  selected={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isItemSelected}
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </TableCell>
                  <TableCell
                    id={labelId}
                    scope="row"
                    padding="none"
                  >
                    {row.address}
                  </TableCell>
                  <TableCell>{row.postalCode}</TableCell>
                  <TableCell>{row.neighborhood}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div>
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={handleChoosePostalCode}
        >
          Escolher Cep
          </Button>
        <Button
          variant="outlined"
          color="secondary"
          className={classes.button}
          onClick={(event) => handleClose(event, 'cancel')}
        >
          Cancelar
          </Button>
      </div>
    </ModalWrapped>
  );
}

export default React.memo(ChoosePostalCode);