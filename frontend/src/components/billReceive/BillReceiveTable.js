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
import MaterialTable from 'material-table';


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
import Confirm from '../common/ConfirmAlert';

import PrintContainer from '../common/PrintContainer';

function BillReceiveTable(props) {
  const { classes, clientId, clientData, handleOpenMessage } = props;
  const dateCurrent = getCurrentDate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [billReceive, setBillReceive] = useState({}); //Contém o título que está sendo editado
  const [billsReceive, setbillsReceive] = useState([]); //Contém os títulos do cliente que estão sendo exibidos na página
  const [billsReceiveComplete, setbillsReceiveComplete] = useState([]); //Contém todos os títulos do cliente
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);  
  const [srcIframe, setSrcIframe] = useState('');  

  useEffect(
    () => {
      
      fetchBillsReceive();
      console.log(`use efect ${clientId}`)
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

  async function internalPrintBillReceives(billReceives){
    let _clientData = clientData;
    if (!clientData) _clientData = await clientService.get(clientId);

    let blobUrl = printBillsReceiveis(_clientData, billReceives);   
    setSrcIframe(blobUrl);
    setOpen(true);    
  }

  function handlePrintBillReceiveGroupByCode(key) {
    internalPrintBillReceives(billsReceive.filter(item => item.code === billsReceive[key].code));
  }

  function renderEditModal(bill) {
    if (openEditModal) {
      return (
        <BillReceiveEditModal
          open={openEditModal}
          bill={bill}
          onClose={() => setOpenEditModal(false)}
          handleSave={handleSaveBillReceive}
          clientData={clientData}
        />
      );
    }
  }

  function handlePrintBillReceive(key) {    
    internalPrintBillReceives([billsReceive[key]]);
  }

  function handleEditBillReceive(bill_receive) {
    setBillReceive(bill_receive);
    setOpenEditModal(true);
  }

  function handleDeleteBillReceive(key) {    
    Confirm('Atenção', 'Confirma a exclusão?', () => 
    billsReceiveservice
      .remove(billsReceive[key]._id)
      .then(() => {        
        let copyBillComplete = billsReceiveComplete.slice();
        copyBillComplete.splice(key, 1);
        setbillsReceiveComplete(copyBillComplete);
      })
      .catch(error => { console.log(error.response); handleOpenMessage(true, 'error', getErrosFromApi(error))}));
  }

  function fetchBillsReceive() {
    console.log('fetch');
    if (clientId){
      billsReceiveservice
        .getBillsReceiveServiceByClient(clientId)
        .then(res => {
          setbillsReceiveComplete(res.data);          
        });
    }/*
      else
        setbillsReceive([]);*/
  }

  function onCloseCreateModal(event, reason) {
    setOpenCreateModal(false);
    if (reason === 'created') {
      handleOpenMessage(true, 'success', 'Títulos criado com sucesso! ');
      fetchBillsReceive();
    }
  }

  function handleChangePage(event, _page){
    setPage(_page);    
    let start = _page * rowsPerPage;
    let end = start + rowsPerPage;        
    setbillsReceive(billsReceiveComplete.slice(start, end));    
  }

  function handleChangeRowsPerPage(event){
    setRowsPerPage(parseInt(event.target.value));    
    let start = page * parseInt(event.target.value);
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
          disabled={(clientId === 0) || (clientId === '')}
          onClick={() => setOpenCreateModal(true)}
        >
          INCLUIR
        </Button>
      </div>
      <div className={classes.back}>
        {/*<Table className={classes.table}>
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
            </Table> */}

        <MaterialTable
        title='Títulos'
        localization={{
          pagination: {
              labelDisplayedRows: '{from}-{to} de {count}',
              labelRowsSelect:'Linhas'
          },
          toolbar: {
              nRowsSelected: '{0} registro(s) selecionados',            
              searchTooltip: 'Procurar' ,
              exportTitle:  'Gerar arquivo CSV dos dados da tela'             
          },
          header: {
              actions: 'Ações'
          },
          body: {
              emptyDataSourceMessage: 'Nenhum título encontrado',
              filterRow: {
                  filterTooltip: 'Filtro'
              }
          }
        }} 
          options={{            
            actionsColumnIndex: -1,
            rowStyle: rowData => ({ backgroundColor: rowData.situation == 'O' ?  'red' : 'white'}) ,
            
            headerStyle: {              
              fontSize: '16px'
            }
          }}
          columns={[
            { title: 'Data da venda', field: 'purchase_date', type:'string', render: rowData => getDateToString(rowData.purchase_date), cellStyle: { fontWeight: 'bold', fontSize: '16px'}},
            { title: 'Título', field: 'code', cellStyle: { fontWeight: 'bold', fontSize: '16px'} },
            { title: 'Parcela', field: 'quota', cellStyle: { fontWeight: 'bold', fontSize: '16px'} },
            { title: 'Data de vencimento', field: 'due_date', type:'string', render: rowData => getDateToString(rowData.due_date), cellStyle: { fontWeight: 'bold', fontSize: '16px'}},
            { title: 'Data de pagamento', field: 'pay_date', type:'string', render: rowData => getDateToString(rowData.pay_date), cellStyle: { fontWeight: 'bold', fontSize: '16px'}},
            { title: 'Situação', field: 'situation', tpe: 'string', render: rowData => rowData.situation === 'O' ? 'ABERTO' : 'QUITADO', cellStyle: { fontWeight: 'bold', fontSize: '16px'}},
            { title: 'Valor pago/atual', field: `original_value['$numberDecimal']` , type: 'currency', cellStyle: { fontWeight: 'bold', fontSize: '16px'}},
            { title: 'Dias em atraso', field: 'due_date', render: rowData => rowData.pay_date != null ? rowData.days_delay : (parseInt(getDelayedDays(rowData.due_date, dateCurrent)) <= 0 ? '' : getDelayedDays(rowData.due_date, dateCurrent)), cellStyle: { fontWeight: 'bold', fontSize: '16px'}}
          ]}
          data={billsReceiveComplete}
          actions={[
            {
              icon: 'event_note',
              iconProps:{                
                style:{ fontSize: 25 , color: 'white'}              
              },
              tooltip: 'Imprimir todas as parcelas',
              onClick: (event, rowData) => handlePrintBillReceiveGroupByCode(rowData),              
            },
            {
              icon: 'local_printshop',
              iconProps:{
                style:{ fontSize: 25 }
              },
              tooltip: 'Imprimir esta parcela',
              onClick: (event, rowData) => handlePrintBillReceive(rowData),              
            },
            {
              icon: 'edit_icon',
              iconProps:{
                style:{ fontSize: 25 }
              },
              tooltip: 'Pagar',
              onClick: (event, rowData) => handleEditBillReceive(rowData),              
            },
            {
              icon: 'delete_outline',
              iconProps:{
                style:{ fontSize: 25 }               
              },
              tooltip: 'Excluir',
              onClick: (event, rowData) => handleDeleteBillReceive(rowData),              
            },
          ]}
           
        />
      </div>
      <br />
      {renderEditModal(billReceive)}
      <BillReceiveCreateModal
        open={openCreateModal}
        onClose={onCloseCreateModal}
        clientId={clientId}
      />
      <PrintContainer open={open} setOpen={setOpen}  src={srcIframe} />
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
