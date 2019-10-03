import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  MenuItem,
  Select,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Fab,
  Icon,
  Input,
} from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { withStyles } from '@material-ui/core/styles';

import clientService from '../../services/clientService';

import NumberFormatCustom from '../../components/common/NumberFormatCustom';
import AsyncSelectGeneric from '../../components/common/AsyncSelectGeneric';
import {
  getDateToString,
  getNumberDecimalToStringCurrency,
} from '../../utils/operators';
import SaleProductModal from './SaleProductModal';

import { ActionItem } from '../../utils/enums';

const styles = theme => ({
  container: {
    marginTop: theme.spacing(3),
    display: 'block',
  },
  root: {
    width: '100%',
    height: `calc(100vh - ${theme.spacing(16)}px)`,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    overflowX: 'auto',
    padding: theme.spacing(2),
  },
  back: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    padding: theme.spacing(2),
    borderColor: '#C0C0C0',
    borderStyle: 'solid',
    borderWidth: '1px',
    width: '90%',
  },
  textField: {
    marginTop: '0px',
    marginBotton: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  table: {
    minWidth: 700,
  },
  fab: {
    marginRight: `${theme.spacing(1)}px !important`,
    color: theme.palette.common.white,
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  itens: {
    paddingTop: theme.spacing(2),
  },
  item: {
    padding: `${theme.spacing(1)}px !important `,
  },
  titleGroup: {
    margin: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
});

function EditSale(props) {
  const {
    classes,
    data,
    handleValueChange,
    handleDateValueChange,
    handleCancel,
    handleSave,
    handleOpenMessage,
    message,
    clientData,
    handleChangeData,
  } = props;

  const [single, setSingle] = useState(null);
  const [prevSingle, setPrevSingle] = useState(null);
  const [dataProducts, setDataProducts] = useState([]);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [productCurrent, setProductCurrent] = useState({
    id: 0,
    productId: 0,
    productDescription: '',
    price: 0.0,
    quantity: 0.0,
  });
  const [finalValue, setFinalValue] = useState(props.data.finalValue);

  useEffect(() => {
    updateFinalValue();
  }, [dataProducts]);

  useEffect(() => {
    if (props.data && props.data.itemSale) setDataProducts(props.data.itemSale);
  }, [props.data.itemSale]);

  function handleDeleteProduct(index) {
    let _dataProducts = [];
    if (dataProducts[index].action === ActionItem.Insert)
      _dataProducts = [].concat(
        dataProducts.filter((_item, _index) => _index !== index)
      );
    else {
      _dataProducts = [...dataProducts];
      _dataProducts[index].action = ActionItem.Delete;
    }
    console.log(_dataProducts);
    setDataProducts(_dataProducts);
  }

  useEffect(() => {
    if (clientData.id) {
      setSingle({
        value: clientData.id,
        label: `Código: ${clientData.id} Nome: ${clientData.name} Cpf: ${
          clientData.cpf
        } Data Nasc.: ${getDateToString(clientData.dateOfBirth)}`,
        clientData: clientData,
      });
    } else setSingle(null);
  }, [clientData]);

  function handleEditProduct(key) {
    setProductCurrent(dataProducts[key]);
    setOpenProductModal(true);
  }

  function addProduct() {
    setProductCurrent({
      id: 0,
      productId: 0,
      productDescription: '',
      price: 0.0,
      quantity: 0.0,
    });
    setOpenProductModal(true);
  }

  const handleValueQuantityChange = key => event => {
    let copy = [...dataProducts];
    copy[key].quantity = event.target.value;
    copy[key].totalPrice = parseFloat(copy[key].quantity * copy[key].price);
    copy[key].action = ActionItem.Alter;
    setDataProducts(copy);
  };

  function updateFinalValue() {
    let total = 0.0;
    if (dataProducts)
      dataProducts.forEach(produto => {
        if (produto.action !== ActionItem.Delete) total += produto.totalPrice;
      });
    setFinalValue(total);
  }

  function onCloseProductModal(event, reason) {
    setOpenProductModal(false);
    handleOpenMessage(false, 'success', '');
  }

  function onSaveProduct(product) {
    if (!(productCurrent.id > 0)) {
      let newProduct = {
        id: 0,
        saleId: data.id,
        productId: product.id,
        productDescription: product.description,
        quantity: product.quantity,
        price: product.price,
        totalPrice: parseFloat(product.quantity) * parseFloat(product.price),
        action: ActionItem.Insert,
      };
      setDataProducts([...dataProducts, newProduct]);
    }
    setOpenProductModal(false);
  }

  async function fetchClients(
    inputValue,
    columnSearch,
    callback,
    handleOpenMessage
  ) {
    if (columnSearch === 'id' && /\D/.test(inputValue)) {
      handleOpenMessage(
        true,
        'warning',
        'Informe somente números na pesquisa por código.'
      );
      callback([]);
      return;
    }

    let filterType = '';
    if (columnSearch === 'id') filterType = 'Eq';
    else filterType = 'StW';

    const _limit = inputValue.trim().split(' ').length < 3 ? 10 : 1000;

    let result = await clientService.getAll(
      0,
      _limit,
      columnSearch,
      columnSearch,
      'Asc',
      filterType,
      inputValue
    );
    let _clients = result.data.map(client => ({
      value: client.id,
      label: `Código: ${client.id} Nome: ${client.name} Cpf: ${
        client.cpf
      } Data Nasc.: ${getDateToString(client.dateOfBirth)}`,
      clientData: client,
    }));
    callback(_clients);
  }

  const [columnSearch, setColumnSearch] = React.useState('name');

  function handleChangeColumnSearch(event) {
    if (columnSearch !== event.target.value) {
      setColumnSearch(event.target.value);
      setSingle({ value: 'clean' });
      setTimeout(() => setSingle(null), 80);
    }
  }

  let textPlaceHolder = '';
  switch (columnSearch) {
    case 'id':
      textPlaceHolder = 'código';
      break;
    case 'name':
      textPlaceHolder = 'nome';
      break;
    case 'cpf':
      textPlaceHolder = 'cpf';
      break;
    default:
      textPlaceHolder = 'nome';
  }

  function validateSale() {
    if (!single || !single.value) {
      handleOpenMessage(true, 'warning', 'Cliente não informado');
      return false;
    }

    if (!data.vendor || data.vendor.length === 0) {
      handleOpenMessage(true, 'warning', 'Vendedor não informado');
      return false;
    }

    return true;
  }

  function save() {
    if (!validateSale()) return;
    data.clientId = single.value;
    data.finalValue = finalValue;
    data.itemSale = dataProducts;
    handleChangeData(data);
    handleSave();
  }

  return (
    <>
      <form className={classes.container} noValidate autoComplete="off">
        <div className={classes.back}>
          <Grid className={classes.itens} container spacing={1}>
            <Grid container spacing={1}>
              <Grid sm={12} md={12} lg={12} xl={12}>
                <Typography variant="h6" className={classes.titleGroup}>
                  {' '}
                  Dados da venda
                </Typography>
              </Grid>
            </Grid>
            <Grid
              className={classes.item}
              item
              xs={12}
              sm={1}
              md={1}
              lg={1}
              xl={1}
            >
              <FormControl fullWidth>
                <Select
                  value={columnSearch}
                  onChange={handleChangeColumnSearch}
                  inputProps={{
                    name: 'sort',
                    id: 'sort',
                  }}
                >
                  <MenuItem value={'id'}>Código</MenuItem>
                  <MenuItem value={'name'}>Nome</MenuItem>
                  <MenuItem value={'cpf'}>Cpf</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid
              className={classes.gridSearch}
              item
              xs={12}
              sm={11}
              md={11}
              lg={11}
              xl={11}
            >
              <AsyncSelectGeneric
                single={single}
                prevSingle={prevSingle}
                placeholder={`Digite o ${textPlaceHolder} do cliente`}
                loadingMessage={() => 'Buscando clientes'}
                noOptionsMessage={() => 'Nenhum cliente selecionado'}
                fetch={fetchClients}
                setSingle={setSingle}
                setPrevSingle={setPrevSingle}
                columnSearch={columnSearch}
                handleOpenMessage={handleOpenMessage}
              />
            </Grid>
            <Grid
              className={classes.item}
              item
              xs={12}
              sm={6}
              md={6}
              lg={4}
              xl={4}
            >
              <TextField
                id="vendor"
                label="Vendedor"
                className={classes.textField}
                value={data.vendor}
                onChange={handleValueChange('vendor')}
                margin="normal"
                fullWidth
                inputProps={{
                  maxLength: 30,
                }}
              />
            </Grid>
            <Grid
              className={classes.item}
              item
              xs={12}
              sm={6}
              md={6}
              lg={4}
              xl={4}
            >
              <KeyboardDatePicker
                id="saleDate"
                label="Data da venda"
                className={classes.textField}
                value={data.saleDate}
                onChange={handleDateValueChange('saleDate')}
                margin="normal"
                format={'dd/MM/yyyy'}
                fullWidth
              />
            </Grid>
            <Grid
              className={classes.item}
              item
              xs={12}
              sm={6}
              md={6}
              lg={4}
              xl={4}
            >
              <TextField
                id="finalValue"
                label="Valor total (R$)"
                className={classes.textField}
                value={getNumberDecimalToStringCurrency(finalValue)}
                margin="normal"
                fullWidth
                disabled
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
              />
            </Grid>
            <Grid
              className={classes.item}
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <Button
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={addProduct}
              >
                Adicionar produto
              </Button>
            </Grid>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell padding="none" size="small">
                    Código do produto
                  </TableCell>
                  <TableCell padding="none" size="small">
                    Descrição do produto
                  </TableCell>
                  <TableCell padding="none" className={classes.headerCpf}>
                    Preço do produto
                  </TableCell>
                  <TableCell padding="none">Quantidade</TableCell>
                  <TableCell padding="none">Total</TableCell>
                  <TableCell
                    padding="none"
                    className={classes.headerAcoes}
                    align="right"
                  >
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataProducts &&
                  dataProducts
                    .filter(item => item.action !== ActionItem.Delete)
                    .map((item, index) => {
                      return (
                        <TableRow hover key={index}>
                          <TableCell padding="none" size="small">
                            {item.productId}
                          </TableCell>
                          <TableCell padding="none" size="small">
                            {item.productDescription}
                          </TableCell>
                          <TableCell padding="none" size="small">
                            {item.price}
                          </TableCell>
                          <TableCell padding="none" size="small">
                            <Input
                              id="quantity"
                              value={item.quantity}
                              onChange={handleValueQuantityChange(index)}
                              margin="normal"
                              fullWidth
                            />
                          </TableCell>
                          <TableCell padding="none" size="large">
                            {getNumberDecimalToStringCurrency(item.totalPrice)}
                          </TableCell>
                          <TableCell padding="none" align="right">
                            {/*                      
                      <Fab
                        color="primary"
                        aria-label="Editar"
                        className={classes.fab}
                        onClick={() => handleEditProduct(key)}
                        size="small"
                      >
                        <Icon fontSize="small">edit_icon</Icon>
                      </Fab>  
*/}
                            <Fab
                              color="secondary"
                              aria-label="Delete"
                              className={classes.fab}
                              onClick={() => handleDeleteProduct(index)}
                              size="small"
                            >
                              <Icon fontSize="small">delete_icon</Icon>
                            </Fab>
                          </TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
          </Grid>
          <br />
          {openProductModal && (
            <SaleProductModal
              open={openProductModal}
              onClose={onCloseProductModal}
              productCurrent={productCurrent}
              message={message}
              handleOpenMessage={handleOpenMessage}
              onSave={onSaveProduct}
            />
          )}

          <div className={classes.divRow}>
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              onClick={save}
            >
              Salvar
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              className={classes.button}
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}

export default withStyles(styles)(EditSale);
