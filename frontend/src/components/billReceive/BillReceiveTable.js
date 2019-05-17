import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import classNames from 'classnames';



import {
  getDateToString,
  getDelayedDays,
  getCurrentDate,
  getNumberDecimalToStringCurrency,
  getNumberToString,
  getValueWithInterest
} from '../../utils/operators';

import BillReceiveCreateModal from './BillReceiveCreateModal';
import BillReceiveEditModal from './BillReceiveEditModal';

import { printBillsReceiveis } from '../../services/printService';

import billsReceiveservice from '../../services/billsReceiveService';
import { getErrosFromApi } from '../../utils/errorsHelper';
import clientService from '../../services/clientService';

import TablePaginationActions from '../common/TablePaginationActions';

function BillReceiveTable(props) {
  const { classes, clientId, clientData, handleOpenMessage } = props;
  console.log(clientId);
  const dateCurrent = getCurrentDate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [billReceive, setBillReceive] = useState({});
  const [billsReceive, setbillsReceive] = useState([]);
  const [billsReceiveComplete, setbillsReceiveComplete] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  useEffect(
    () => {
      fetchBillsReceive();
    },
    [clientId]
  );

  useEffect(() => {
    handleChangePage(null, 0);
  }, [billsReceiveComplete])

  function handleSaveBillReceive(reason) {
    if (reason === 'saved') {
      setOpenEditModal(false);
      handleOpenMessage(true, 'success', 'Título pago com sucesso! ');
      fetchBillsReceive();
    }
  }

  async function handlePrintBillReceiveGroupByCode(key) {
    let code = billsReceive[key].code;

    let billReceives = billsReceive.filter(item => item.code === code);

    let _clientData = clientData;
    if (!clientData) _clientData = await clientService.get(clientId);

    printBillsReceiveis(_clientData, billReceives);
  }

  function renderEditModal(bill) {
    if (openEditModal) {
      return (
        <BillReceiveEditModal
          open={openEditModal}
          bill={bill}
          handleClose={() => setOpenEditModal(false)}
          handleSave={handleSaveBillReceive}
          clientData={clientData}
        />
      );
    }
  }

  function handlePrintBillReceive(key) {
    let billReceive = billsReceive[key];
    printBillsReceiveis(clientData, [billReceive]);
  }

  function handleEditBillReceive(bill_receive) {
    setBillReceive(bill_receive);
    setOpenEditModal(true);
  }

  function handleDeleteBillReceive(key) {
    billsReceiveservice
      .remove(billsReceive[key]._id)
      .then(() => {
        let copyBill = billsReceive.slice();
        copyBill.splice(key, 1);
        setbillsReceive(copyBill);
      })
      .catch(error => handleOpenMessage(true, 'error', getErrosFromApi(error)));
  }

  function fetchBillsReceive() {
    console.log('fetch');
    if (clientId){
      billsReceiveservice
        .getBillsReceiveServiceByClient(clientId)
        .then(res => {
          setbillsReceiveComplete(res.data);          
        });
      }
      else
        setbillsReceive([]);
  }

  function handleCloseCreateModal(event, reason) {
    setOpenCreateModal(false);
    if (reason === 'created') {
      handleOpenMessage(true, 'success', 'Títulos criado com sucesso! ');
      fetchBillsReceive();
    }
  }

  function handleChangePage(event, _page){
    setPage(_page);    
    let start = _page * rowsPerPage + 1;
    let end = start + rowsPerPage;        
    setbillsReceive(billsReceiveComplete.slice(start, end));    
  }

  function handleChangeRowsPerPage(event){
    setRowsPerPage(parseInt(event.target.value));    
    let start = page * parseInt(event.target.value) + 1;
    let end = start + parseInt(event.target.value);
    setbillsReceive(billsReceiveComplete.slice(start, end));    
  } 

  return (
    <form className={classes.container} noValidate autoComplete="off">
      <div>
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={() => setOpenCreateModal(true)}
        >
          INCLUIR
        </Button>
      </div>
      <div className={classes.back}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">Data da venda</TableCell>
              <TableCell padding="checkbox">Título</TableCell>
              <TableCell padding="checkbox">Parcela</TableCell>
              <TableCell padding="checkbox">Data de vencimento</TableCell>
              <TableCell padding="checkbox">Data de pagamento</TableCell>
              <TableCell padding="checkbox">Valor</TableCell>
              <TableCell padding="checkbox" align="left">
                Situação
              </TableCell>
              <TableCell padding="checkbox">Valor pago/atual</TableCell>
              <TableCell padding="checkbox">Dias em atraso</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(billsReceive).map(key => {
              let _daysDelay =
                billsReceive[key].pay_date != null
                  ? billsReceive[key].days_delay
                  : getDelayedDays(billsReceive[key].due_date, dateCurrent);
              if (parseInt(_daysDelay) <= 0) _daysDelay = '';
              return (
                <TableRow
                  className={
                    billsReceive[key].situation === 'O' && classes.openRow
                  }
                  key={key}
                >
                  <TableCell padding="checkbox">
                    {getDateToString(billsReceive[key].purchase_date)}
                  </TableCell>
                  <TableCell padding="checkbox">
                    {billsReceive[key].code}
                  </TableCell>
                  <TableCell padding="checkbox">
                    {billsReceive[key].quota}
                  </TableCell>
                  <TableCell padding="checkbox">
                    {getDateToString(billsReceive[key].due_date)}
                  </TableCell>
                  <TableCell padding="checkbox">
                    {getDateToString(billsReceive[key].pay_date)}
                  </TableCell>
                  <TableCell padding="checkbox">
                    {getNumberDecimalToStringCurrency(
                      billsReceive[key].original_value
                    )}
                  </TableCell>
                  <TableCell padding="checkbox" align="left">
                    {billsReceive[key].situation === 'C' ? 'QUITADO' : 'ABERTO'}
                  </TableCell>
                  <TableCell padding="checkbox">
                    {getNumberToString(
                      billsReceive[key].pay_date != null
                        ? billsReceive[key].final_value['$numberDecimal']
                        : parseFloat(
                            getValueWithInterest(
                              billsReceive[key].original_value[
                                '$numberDecimal'
                              ],
                              billsReceive[key].due_date,
                              dateCurrent
                            )
                          )
                    )}
                  </TableCell>
                  <TableCell padding="checkbox">{_daysDelay}</TableCell>
                  <TableCell padding="none" align="right">
                    <Fab
                      color="secondary"
                      aria-label="Delete"
                      className={classNames(classes.fab, classes.fabEdit)}
                      onClick={() => handlePrintBillReceiveGroupByCode(key)}
                      size="small"
                    >
                      <Icon fontSize="small">event_note</Icon>
                    </Fab>
                    <Fab
                      color="secondary"
                      aria-label="Delete"
                      className={classNames(classes.fab, classes.fabEdit)}
                      onClick={() => handlePrintBillReceive(key)}
                      size="small"
                    >
                      <Icon fontSize="small">local_printshop</Icon>
                    </Fab>
                    <Fab
                      color="primary"
                      aria-label="Edit"
                      className={classNames(classes.fab, classes.fabEdit)}
                      onClick={() => handleEditBillReceive(billsReceive[key])}
                      size="small"
                    >
                      <Icon fontSize="small">edit_icon</Icon>
                    </Fab>
                    <Fab
                      color="secondary"
                      aria-label="Delete"
                      className={classes.fab}
                      onClick={() => handleDeleteBillReceive(key)}
                      size="small"
                    >
                      <Icon fontSize="small">delete_icon</Icon>
                    </Fab>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              colSpan={3}
              count={billsReceiveComplete.length}
              rowsPerPage={rowsPerPage}
              page={page}
              labelDisplayedRows={({ from, to, count }) =>
                `Títulos ${from} até ${to} de ${count}`
              }
              labelRowsPerPage={'Títulos por página:'}
              SelectProps={{
                native: true
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
        </Table>
      </div>
      <br />
      {renderEditModal(billReceive)}
      <BillReceiveCreateModal
        open={openCreateModal}
        handleClose={handleCloseCreateModal}
        clientId={clientId}
      />
    </form>
  );
}

const styles = theme => ({
  container: {
    marginTop: theme.spacing.unit * 3,
    display: 'block',
    maxWidth: '95%'
  },
  back: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    padding: theme.spacing.unit * 2,
    borderColor: '#C0C0C0',
    borderStyle: 'solid',
    borderWidth: '1px',
    width: '98%'
  },
  table: {
    minWidth: 500
  },
  openRow: {
    backgroundColor: theme.palette.secondary.light
  },
  fab: {
    marginRight: theme.spacing.unit * 0.5,
    color: theme.palette.common.white
  },
  fabEdit: {
    backgroundColor: theme.palette.edit.main,
    '&:hover': {
      backgroundColor: theme.palette.edit.dark
    }
  },
  button: {
    margin: theme.spacing.unit
  }
});

BillReceiveTable.propTypes = {
  classes: PropTypes.object.isRequired,
  clientId: PropTypes.string.isRequired,
  handleOpenMessage: PropTypes.func.isRequired
};

export default withStyles(styles)(BillReceiveTable);
