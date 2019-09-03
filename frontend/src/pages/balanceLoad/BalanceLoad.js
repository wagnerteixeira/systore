import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import MessageSnackbar from '../../components/common/MessageSnackbar';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Checkbox,
  Button,
  Fab,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';

import productService from '../../services/productService';

import { sendFileToDownload } from '../../utils/helpers';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
  fab: {
    margin: theme.spacing(1),
  },
  radioGroup: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(4),
  },
  button: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  tableHeight: {
    height: `300px`,
    overflowY: 'scroll',
  },
  buttonCntainer: {
    paddingTop: theme.spacing(2),
  },
  radioGroupContainer: {
    paddingLeft: '0px !important',
    paddingRight: '0px !important',
  },
}));

function BalanceLoad(props) {
  const [exportType, setExportType] = useState('1');
  const [message, setMessage] = useState({
    messageOpen: false,
    variantMessage: 'success',
    messageText: '',
  });

  const [products, setProducts] = useState([]);
  const [selected, setSelected] = React.useState([]);

  const classes = useStyles();

  async function getProducts() {
    try {
      let response = await productService.getProductsForExportToBalance({
        typeOfSearchProductsToBalance: exportType,
      });
      setProducts(response.data);
      let selecteds = response.data.map(p => p.id);
      setSelected(selecteds);
    } catch (err) {
      console.error(err);
      setMessage({
        messageOpen: true,
        messageText: 'Houve um erro ao buscar os dados.',
        variantMessage: 'error',
      });
      setProducts([]);
    }
  }
  function handleSelectAllClick(event) {
    if (event.target.checked) {
      const newSelecteds = products.map(n => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }

  function handleSelectClick(event, name) {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  }
  async function handleGenerateFile() {
    try {
      if (selected.length > 0) {
        const response = await productService.generateFileToBalance(selected);
        sendFileToDownload('BALANCA.txt', response.data);
      }
    } catch (err) {
      setMessage({
        messageOpen: true,
        messageText: 'Houve um erro ao buscar os gerar o arquivo.',
        variantMessage: 'error',
      });
      console.error(err);
    }
  }

  const getProductsMemoized = useCallback(getProducts, [exportType]);

  useEffect(() => {
    getProductsMemoized();
  }, [getProductsMemoized]);

  const isSelected = id => selected.indexOf(id) !== -1;
  console.log(selected.length, selected.length > 0);

  return (
    <Paper className={classes.root}>
      <MessageSnackbar
        onClose={() => setMessage({ ...message, messageOpen: false })}
        open={message.messageOpen}
        variant={message.variantMessage}
        message={message.messageText}
      />
      <Grid container spacing={5} direction="row">
        <Grid
          item
          xs={12}
          sm={3}
          md={3}
          lg={3}
          xl={3}
          className={classes.radioGroupContainer}
        >
          <RadioGroup
            aria-label="export-type"
            name="export-type"
            value={exportType}
            row
            className={classes.radioGroup}
            onChange={event => {
              setExportType(event.target.value);
            }}
          >
            <FormControlLabel
              value="0"
              control={<Radio color="primary" />}
              label="Apenas modificados"
              labelPlacement="end"
            />
            <FormControlLabel
              value="1"
              control={<Radio color="primary" />}
              label="Todos"
              labelPlacement="end"
            />
          </RadioGroup>
        </Grid>
        <Grid item xs={12} sm={1} md={1} lg={1} xl={1}>
          <Fab color="primary" aria-label="search" className={classes.fab}>
            <SearchIcon onClick={getProducts} />
          </Fab>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          md={4}
          lg={4}
          xl={4}
          className={classes.buttonCntainer}
        >
          <Button
            disabled={!selected.length}
            variant="outlined"
            color="primary"
            onClick={handleGenerateFile}
            className={classes.button}
          >
            Gerar Arquivo
          </Button>
        </Grid>
      </Grid>

      <Table size="small" className={classes.tableHeight}>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={
                  selected.length > 0 && selected.length < products.length
                }
                checked={selected.length === products.length}
                onChange={handleSelectAllClick}
                inputProps={{ 'aria-label': 'select all desserts' }}
              />
            </TableCell>
            <TableCell align="right">Descrição</TableCell>
            <TableCell align="right">Valor</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className={classes.tableHeight}>
          {products.map((product, index) => {
            const isItemSelected = isSelected(product.id);
            const labelId = `enhanced-table-checkbox-${index}`;
            return (
              <TableRow
                hover
                onClick={event => handleSelectClick(event, product.id)}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={product.id}
                selected={isItemSelected}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isItemSelected}
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {product.description}
                </TableCell>
                <TableCell align="right">{product.price}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

BalanceLoad.propTypes = {};

export default BalanceLoad;
