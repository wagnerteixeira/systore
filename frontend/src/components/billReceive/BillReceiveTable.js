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
import TouchApp from '@material-ui/icons/TouchApp';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import {
  getDateToString,
  getDelayedDays,
  getCurrentDate,
  getNumberDecimalToStringCurrency,
  getNumberToString,
  getValueWithInterest,
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

const styles = theme => ({
  container: {
    //marginTop: theme.spacing(3),
    display: 'block',
    maxWidth: '98.5%',
    height: `calc(100vh - ${theme.spacing(22)}px)`,
    overflowY: 'scroll',
    overflowX: 'hidden',
  },
  back: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    padding: theme.spacing(2),
    borderColor: '#C0C0C0',
    borderStyle: 'solid',
    borderWidth: '1px',
    width: '98%',
  },
  table: {
    minWidth: 500,
  },
  openRow: {
    backgroundColor: theme.palette.secondary.light,
  },
  fab: {
    marginRight: theme.spacing(0.5),
    color: theme.palette.common.white,
  },
  fabEdit: {
    backgroundColor: theme.palette.edit.main,
    '&:hover': {
      backgroundColor: theme.palette.edit.dark,
    },
  },
  button: {
    margin: theme.spacing(1),
  },
  cellValue: {
    minWidth: '100px',
  },
  cellActions: {
    minWidth: '200px',
  },
  '@global': {
    'tr > td': {
      fontWeight: '600 !important',
      fontSize: '1.1em !important',
    },
  },  
});


const stylesMenu = theme => ({
  iconPadding: {
    paddingRight: theme.spacing(1),
  }
});


function _MenuAcoes(props) {
  const {
    handleCloseMenuAcoes,
    anchorElMenuAcoes,
    handlePrintBillReceiveGroupByCode,
    handlePrintBillReceive,
    handleEditBillReceive,
    handleDeleteBillReceive,
    billReceiveKey,
    situation,
    classes,
  } = props;
  return (
    <Menu
      id="simple-menu"
      anchorEl={anchorElMenuAcoes}
      open={Boolean(anchorElMenuAcoes)}
      onClose={handleCloseMenuAcoes}
    >
      {situation === 'O' && (
        <MenuItem
          onClick={() => {
            handleEditBillReceive(billReceiveKey);
            handleCloseMenuAcoes();
          }}
        >
          <Icon className={classes.iconPadding}>attach_money</Icon>
          Baixar parcela
        </MenuItem>
      )}
      <MenuItem
        onClick={() => {
          handlePrintBillReceiveGroupByCode(billReceiveKey);
          handleCloseMenuAcoes();
        }}
      >
        <Icon className={classes.iconPadding}>print</Icon>
        Imprimir carnê
      </MenuItem>
      <MenuItem
        onClick={() => {
          handlePrintBillReceive(billReceiveKey);
          handleCloseMenuAcoes();
        }}
      >
        <Icon className={classes.iconPadding}>print </Icon>
        Imprimir parcela
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleDeleteBillReceive(billReceiveKey);
          handleCloseMenuAcoes();
        }}
      >
        <Icon className={classes.iconPadding}>delete_forever</Icon>
        Excluir carnê
      </MenuItem>
    </Menu>
  );
}


_MenuAcoes.propTypes = {
  classes: PropTypes.object.isRequired,
  handleCloseMenuAcoes: PropTypes.func.isRequired,
  anchorElMenuAcoes: PropTypes.object.isRequired,
  handlePrintBillReceiveGroupByCode: PropTypes.func.isRequired,
  handlePrintBillReceive: PropTypes.func.isRequired,
  handleEditBillReceive: PropTypes.func.isRequired,
  handleDeleteBillReceive: PropTypes.func.isRequired,
  billReceiveKey: PropTypes.string.isRequired,
  situation: PropTypes.string.isRequired,
};

const MenuAcoes = withStyles(stylesMenu)(_MenuAcoes);

function BillReceiveTable(props) {
  const { classes, clientId, clientData, handleOpenMessage } = props;
  const dateCurrent = getCurrentDate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [billReceive, setBillReceive] = useState({}); //Contém o título que está sendo editado
  const [billsReceive, setbillsReceive] = useState([]); //Contém os títulos do cliente que estão sendo exibidos na página
  const [billsReceiveComplete, setbillsReceiveComplete] = useState([]); //Contém todos os títulos do cliente
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [srcIframe, setSrcIframe] = useState('');

  const [dadosMenuAcoes, setDadosMenuAcoes] = useState({
    anchorEl: null,
    billReceiveKey: '',
    situation: 'O',
  });

  useEffect(() => {
    fetchBillsReceive();
    // eslint-disable-next-line
  }, [clientId]);

  useEffect(() => {
    handleChangePage(null, 0);
    // eslint-disable-next-line
  }, [billsReceiveComplete]);  

  const handleOpenMenuAcoes = (billReceiveKey, situation) => event => {
    setDadosMenuAcoes({
      anchorEl: event.currentTarget,
      billReceiveKey,
      situation,
    });
  };

  function handleCloseMenuAcoes() {
    setDadosMenuAcoes({ anchorEl: null, billReceiveKey: '' });
  }

  function handleSaveBillReceive(reason, print, clientData, billReceive) {
    if (reason === 'saved') {
      setOpenEditModal(false);
      handleOpenMessage(true, 'success', 'Título pago com sucesso! ');
      if (print) {
        let blobUrl = printBillsReceiveis(clientData, billReceive);
        setSrcIframe(blobUrl);
        setOpen(true);
      }
      fetchBillsReceive();
    }
  }

  async function internalPrintBillReceives(billReceives) {
    let _clientData = clientData;
    if (!clientData) _clientData = await clientService.get(clientId);

    let blobUrl = printBillsReceiveis(_clientData, billReceives);
    setSrcIframe(blobUrl);
    setOpen(true);
  }

  function handlePrintBillReceiveGroupByCode(key) {
    internalPrintBillReceives(
      billsReceive.filter(item => item.code === billsReceive[key].code)
    );
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
    internalPrintBillReceives([billsReceiveComplete[key]]);
  }

  function handleEditBillReceive(key) {
    setBillReceive(billsReceiveComplete[key]);
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
        .catch(error => {
          console.log(error.response);
          handleOpenMessage(true, 'error', getErrosFromApi(error));
        })
    );
  }

  function fetchBillsReceive() {
    if (clientId === 'clean') {
      setbillsReceiveComplete([]);
      return;
    }
    if (clientId && clientId !== '0') {
      billsReceiveservice.getBillsReceiveServiceByClient(clientId).then(res => {
        setbillsReceiveComplete(res.data);
      });
    } /*
      else
        setbillsReceive([]);*/
  }

  function onCloseCreateModal(event, reason) {
    setOpenCreateModal(false);
    if (reason === 'created') {
      handleOpenMessage(false, 'success', '');
      internalPrintBillReceives(event);
      fetchBillsReceive();
    }
  }

  function handleChangePage(event, _page) {
    setPage(_page);
    let start = _page * rowsPerPage;
    let end = start + rowsPerPage;
    setbillsReceive(billsReceiveComplete.slice(start, end));
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value));
    let start = page * parseInt(event.target.value);
    let end = start + parseInt(event.target.value);
    setbillsReceive(billsReceiveComplete.slice(start, end));
  }

  return (
    <div className={classes.container}>
      <MenuAcoes
        handleCloseMenuAcoes={handleCloseMenuAcoes}
        anchorElMenuAcoes={dadosMenuAcoes.anchorEl}
        handlePrintBillReceiveGroupByCode={handlePrintBillReceiveGroupByCode}
        handlePrintBillReceive={handlePrintBillReceive}
        handleEditBillReceive={handleEditBillReceive}
        handleDeleteBillReceive={handleDeleteBillReceive}
        billReceiveKey={dadosMenuAcoes.billReceiveKey}
        situation={dadosMenuAcoes.situation}
      />
      <div>
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          disabled={clientId === '0' || clientId === ''}
          onClick={() => setOpenCreateModal(true)}
        >
          INCLUIR
        </Button>
      </div>
      <div className={classes.back}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell size="small">Data da venda</TableCell>
              <TableCell size="small">Título</TableCell>
              <TableCell size="small">Parcela</TableCell>
              <TableCell size="small">Data de vencimento</TableCell>
              <TableCell size="small"> Data de pagamento</TableCell>
              <TableCell size="small">Valor</TableCell>
              <TableCell size="small" align="left">
                Situação
              </TableCell>
              <TableCell size="small">Valor pago/atual</TableCell>
              <TableCell size="small">Dias em atraso</TableCell>
              <TableCell size="small" align="left">
                Ações
              </TableCell>
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
                  <TableCell size="small">
                    {getDateToString(billsReceive[key].purchase_date)}
                  </TableCell>
                  <TableCell size="small">{billsReceive[key].code}</TableCell>
                  <TableCell size="small">{billsReceive[key].quota}</TableCell>
                  <TableCell>
                    {getDateToString(billsReceive[key].due_date)}
                  </TableCell>
                  <TableCell size="small">
                    {getDateToString(billsReceive[key].pay_date)}
                  </TableCell>
                  <TableCell size="small" className={classes.cellValue}>
                    {getNumberDecimalToStringCurrency(
                      billsReceive[key].original_value
                    )}
                  </TableCell>
                  <TableCell size="small" align="left">
                    {billsReceive[key].situation === 'C' ? 'QUITADO' : 'ABERTO'}
                  </TableCell>
                  <TableCell size="small" className={classes.cellValue}>
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
                  <TableCell size="small">{_daysDelay}</TableCell>
                  <TableCell size="small" align="left">
                    <Fab
                      color="primary"
                      aria-label="Delete"
                      className={classes.fab}
                      onClick={handleOpenMenuAcoes(
                        key,
                        billsReceive[key].situation
                      )}
                      size="small"
                    >
                      <TouchApp fontSize="small" />
                    </Fab>
                    {/*<Fab
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
                      onClick={() => handleEditBillReceive(key)}
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
                    </Fab>*/}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[25, 50, 100]}
                colSpan={3}
                count={billsReceiveComplete.length}
                rowsPerPage={rowsPerPage}
                page={page}
                labelDisplayedRows={({ from, to, count }) =>
                  `Títulos ${from} até ${to} de ${count}`
                }
                labelRowsPerPage={'Títulos por página:'}
                SelectProps={{
                  native: true,
                  fontSize: 12,
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
        onClose={onCloseCreateModal}
        clientId={clientId}
      />
      <PrintContainer open={open} setOpen={setOpen} src={srcIframe} />
    </div>
  );
}

BillReceiveTable.propTypes = {
  classes: PropTypes.object.isRequired,
  clientId: PropTypes.string.isRequired,
  handleOpenMessage: PropTypes.func.isRequired,
};

export default withStyles(styles)(BillReceiveTable);
