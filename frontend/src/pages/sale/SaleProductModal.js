import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import ModalWrapped from '../../components/common/Modal';
import productService from '../../services/productService';
import AsyncSelectGeneric from '../../components/common/AsyncSelectGeneric';

import { getErrosFromApi } from '../../utils/errorsHelper';
import { FormControl, MenuItem, Select } from '@material-ui/core';

const styles = theme => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    outline: 'none',
    width: theme.spacing(80),
    overflowY: 'auto',
    overflowX: 'hidden',
    maxHeight: '80%',
  },
  margin: {
    margin: theme.spacing(1),
  },
  fab: {
    color: theme.palette.common.white,
  },
  item: {
    padding: `${theme.spacing(1)}px !important`,
  },
  button: {
    margin: theme.spacing(1),
  },
  table: {
    margin: `${theme.spacing(1)}px`,
  },
});

function SaleProductModal(props) {
  const { open, onClose, classes, message, handleOpenMessage, onSave } = props;
  const [productData, setProductData] = useState({
    id: props.productId,
    firstDescription: '',
    price: 0.0,
  });
  const [quantity, setQuantity] = useState(0.0);
  const [single, setSingle] = useState(null);
  const [prevSingle, setPrevSingle] = useState(null);

  useEffect(() => {
    if (single) setProductData(single.productData);
  }, single);

  async function fetchProducts(
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

    let result = await productService.getAll(
      0,
      _limit,
      columnSearch,
      columnSearch,
      'Asc',
      filterType,
      inputValue
    );
    let _products = result.data.map(product => ({
      value: product.id,
      label: `Código: ${product.id} Descrição 1: ${
        product.firstDescription
      } Descrição 2: ${product.secondDescription} Descrição 3: ${
        product.thirtDescription
      }`,
      productData: product,
    }));
    callback(_products);
  }

  const [columnSearch, setColumnSearch] = useState('firstDescription');

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
    case 'firstDescription':
      textPlaceHolder = 'descrição 1';
      break;
    case 'secondDescription':
      textPlaceHolder = 'descrição 2';
      break;
    default:
      textPlaceHolder = 'descrição 1';
  }

  function handleQuantityValue(event) {
    let _quantity = parseFloat(event.target.value);
    if (isNaN(_quantity)) _quantity = 0;
    setQuantity(_quantity);
  }

  const handleCancel = () => {
    props.onClose(null, 'cancel');
  };

  function handleSave() {
    if (!productData.id) {
      handleOpenMessage(true, 'warning', 'Produto não informado');
    } else if (!quantity)
      handleOpenMessage(true, 'warning', 'Quantidade não informada');
    else {
      let product = JSON.parse(JSON.stringify({ ...productData }));
      product.quantity = quantity;
      onSave(product);
    }
  }

  return (
    <ModalWrapped onClose={onClose} open={open} paperClass={classes.paper}>
      <Grid className={classes.itens} container spacing={3}>
        <Grid
          className={classes.item}
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
        >
          <Typography align="center" variant="h6">
            INCLUSÃO DE PRODUTOS
          </Typography>
        </Grid>
        <Grid
          className={classes.item}
          item
          xs={12}
          sm={12}
          md={2}
          lg={2}
          xl={2}
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
              <MenuItem value={'firstDescription'}>Descrição 1</MenuItem>
              <MenuItem value={'secondDescription'}>Descrição 2</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid
          className={classes.item}
          item
          xs={12}
          sm={12}
          md={10}
          lg={10}
          xl={10}
        >
          <AsyncSelectGeneric
            single={single}
            prevSingle={prevSingle}
            placeholder={`Digite o ${textPlaceHolder} do produto`}
            loadingMessage={() => 'Buscando produtos'}
            noOptionsMessage={() => 'Nenhum produto selecionado'}
            fetch={fetchProducts}
            setSingle={setSingle}
            setPrevSingle={setPrevSingle}
            columnSearch={columnSearch}
            handleOpenMessage={handleOpenMessage}
          />
        </Grid>
        <Grid className={classes.item} item xs={12} sm={3} md={3} lg={3} xl={3}>
          <TextField
            id="price"
            label="Preço"
            className={classes.margin}
            value={productData.price === 0 ? '' : productData.price}
            margin="normal"
            disabled
            fullWidth
          />
        </Grid>
        <Grid className={classes.item} item xs={12} sm={3} md={3} lg={3} xl={3}>
          <TextField
            id="quantity"
            label="Quantidade"
            className={classes.margin}
            value={quantity}
            onChange={handleQuantityValue}
            margin="normal"
            fullWidth
          />
        </Grid>
      </Grid>
      <div>
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={handleSave}
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
    </ModalWrapped>
  );
}

SaleProductModal.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  productId: PropTypes.string.isRequired,
};

export default withStyles(styles)(SaleProductModal);