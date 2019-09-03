import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Fab,
  Icon,
  Input,
  BottomNavigation,
} from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { withStyles } from '@material-ui/core/styles';

import clientService from '../../services/clientService';

import NumberFormatCustom from '../../components/common/NumberFormatCustom';
import AsyncSelectGeneric from '../../components/common/AsyncSelectGeneric';
import { getDateToString } from '../../utils/operators';
import SaleProductModal from './SaleProductModal';

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
  const { handleOpenMessage, message } = props;
  const [single, setSingle] = useState(null);
  const [prevSingle, setPrevSingle] = useState(null);
  const [dataProducts, setDataProducts] = useState([]); // useState(props.data.saleProducts);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [productCurrent, setProductCurrent] = useState({
    id: 0,
    description: '',
    price: 0.0,
    quantity: 0.0,
  });

  function handleDeleteProduct(key) {
    setDataProducts(dataProducts.slice(key));
  }

  function handleEditProduct(key) {
    setProductCurrent(dataProducts[key]);
    setOpenProductModal(true);
  }

  function addProduct() {
    //TODO
    //chamar showModal do produto
    setProductCurrent({
      id: 0,
      description: '',
      price: 0.0,
      quantity: 0.0,
    });
    setOpenProductModal(true);
    //inserir na grid para a pessoa poder editar a quantidade
  }

  const handleValueQuantityChange = key => event => {
    console.log(key);
    let copy = [...dataProducts];
    copy[key].quantity = event.target.value;
    copy[key].finalValue = parseFloat(copy[key].quantity * copy[key].price);
    setDataProducts(copy);

    //TODO
    //Alterar preço final da venda pois alterou a quantidade do produto
  };

  function onCloseProductModal(event, reason) {
    setOpenProductModal(false);
    handleOpenMessage(false, 'success', '');
  }

  function onSaveProduct(product) {
    if (productCurrent.id > 0) {
      //edit
    } else {
      let newProduct = {
        productId: product.id,
        description: product.description,
        quantity: product.quantity,
        price: product.price,
        finalValue: parseFloat(product.quantity) * parseFloat(product.price),
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
    if (columnSearch === 'Code') filterType = 'Eq';
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

  const {
    classes,
    data,
    handleValueChange,
    handleDateValueChange,
    handleCancel,
    handleSave,
    handleValueDecimalChange,
  } = props;

  function save() {
    data.clientId = single.clientData.id;
    data.saleProducts = dataProducts;
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
                value={data.finalValue}
                onChange={handleValueDecimalChange('finalValue')}
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
                {Object.keys(dataProducts).map(key => (
                  <TableRow hover key={key}>
                    <TableCell padding="none" size="small">
                      {dataProducts[key].productId}
                    </TableCell>
                    <TableCell padding="none" size="small">
                      {dataProducts[key].description}
                    </TableCell>
                    <TableCell padding="none" size="small">
                      {dataProducts[key].price}
                    </TableCell>
                    <TableCell padding="none" size="small">
                      <Input
                        id="quantity"
                        value={dataProducts[key].quantity}
                        onChange={handleValueQuantityChange(key)}
                        margin="normal"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell padding="none" size="large">
                      {dataProducts[key].finalValue}
                    </TableCell>
                    <TableCell padding="none" align="right">
                      <Fab
                        color="primary"
                        aria-label="Editar"
                        className={classes.fab}
                        onClick={() => handleEditProduct(key)}
                        size="small"
                      >
                        <Icon fontSize="small">edit_icon</Icon>
                      </Fab>
                      <Fab
                        color="secondary"
                        aria-label="Delete"
                        className={classes.fab}
                        onClick={() => handleDeleteProduct(key)}
                        size="small"
                      >
                        <Icon fontSize="small">delete_icon</Icon>
                      </Fab>
                    </TableCell>
                  </TableRow>
                ))}
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
