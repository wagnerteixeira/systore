import React, { useState } from 'react'
import { Grid, TextField, Button, FormControlLabel, Checkbox, Typography, FormControl, MenuItem, Paper, Select, InputLabel } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AsyncSelect from 'react-select/async';

import clientService from '../../services/clientService';

import NumberFormatCustom from '../../components/common/NumberFormatCustom';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { getDateToString, debounceTimeWithParams } from '../../utils/operators';
import MaterialTable from 'material-table';

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
  itens: {
    paddingTop: theme.spacing(2),
  },
  item: {
    padding: `${theme.spacing(1)}px !important `,
  },
  titleGroup: {
    margin: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(1)
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  noOptionsMessage: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  loadingMessage: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  select: {
    paddingTop: theme.spacing(1) * 1.65,
    maxWidth: '95%',
  },
  gridSearch: {
    paddingLeft: `${theme.spacing(0.2)}px !important `,
    [theme.breakpoints.down('xs')]: {
      marginLeft: theme.spacing(1),
    },
  },

});

function EditSale(props) {

  const columns = [
    { title: 'Name', field: 'name' },
    { title: 'Surname', field: 'surname', initialEditValue: 'initial edit value' },
    { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
    {
      title: 'Birth Place',
      field: 'birthCity',
      lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
    },
  ]

  const { handleOpenMessage } = props;
  const [single, setSingle] = useState(null);
  const [prevSingle, setPrevSingle] = useState(null);
  const [dataProducts, setDataProducts] = useState(props.data.saleProducts);

  const selectStyles = {
    input: base => ({
      ...base,
      color: 'primary',
      '& input': {
        font: 'inherit',
      },
    }),
  };
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
      label: `Código: ${client.id} Nome: ${client.name} Cpf: ${client.cpf} Data Nasc.: ${getDateToString(client.dateOfBirth)}`,
      clientData: client,
    }));
    callback(_clients);
  }

  const fetchClientsDebounce = debounceTimeWithParams(500, fetchClients);

  function NoOptionsMessage(props) {
    return (
      <Typography
        color="textSecondary"
        className={props.selectProps.classes.noOptionsMessage}
        {...props.innerProps}
      >
        {props.children}
      </Typography>
    );
  }

  function inputComponent({ inputRef, ...props }) {
    return <div ref={inputRef} {...props} />;
  }

  function Control(props) {
    return (
      <TextField
        fullWidth
        InputProps={{
          inputComponent,
          inputProps: {
            className: props.selectProps.classes.input,
            inputRef: props.innerRef,
            children: props.children,
            ...props.innerProps,
          },
        }}
        {...props.selectProps.textFieldProps}
      />
    );
  }

  function Option(props) {
    return (
      <MenuItem
        buttonRef={props.innerRef}
        selected={props.isFocused}
        component="div"
        style={{
          fontWeight: props.isSelected ? 500 : 400,
        }}
        {...props.innerProps}
      >
        {props.children}
      </MenuItem>
    );
  }

  function Placeholder(props) {
    return (
      <Typography
        color="textSecondary"
        className={props.selectProps.classes.placeholder}
        {...props.innerProps}
      >
        {props.children}
      </Typography>
    );
  }

  function ValueContainer(props) {
    return (
      <div className={props.selectProps.classes.valueContainer}>
        {props.children}
      </div>
    );
  }

  function LoadingMessage(props) {
    return (
      <Typography
        color="textSecondary"
        className={props.selectProps.classes.loadingMessage}
        {...props.innerProps}
      >
        {props.children}
      </Typography>
    );
  }

  function Menu(props) {
    return (
      <Paper
        square
        className={props.selectProps.classes.paper}
        {...props.innerProps}
      >
        {props.children}
      </Paper>
    );
  }

  const [columnSearch, setColumnSearch] = React.useState('name');

  function handleChangeSingle(value) {
    setSingle(value);
  }

  function loadOptions(inputValue, callback) {
    fetchClientsDebounce(inputValue, columnSearch, callback, handleOpenMessage);
    /*inputValue,
  columnSearch,
  callback,
  handleOpenMessage*/
  }

  function handleInputChangeAsync(newValue, action) {
    const inputValue = newValue.toUpperCase();
    return inputValue;
  }


  function handleChangeColumnSearch(event) {
    if (columnSearch !== event.target.value) {
      setColumnSearch(event.target.value);
      //setPrevSingle(null);
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


  const components = {
    Control,
    Menu,
    NoOptionsMessage,
    Option,
    Placeholder,
    ValueContainer,
    LoadingMessage,
  };


  function handleBlurAsyncSelect() {
    if (!single && prevSingle) {
      setSingle(prevSingle);
      setPrevSingle(null);
    }
  }

  function handleMenuOpenAsyncSelect() {
    if (single) {
      setPrevSingle(single);
      setSingle(null);
    }
  }

  const { classes,
    data,
    handleValueChange,
    handleDateValueChange,
    handleCancel,
    handleSave,
    handleValueDecimalChange
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
              <Grid
                sm={12}
                md={12}
                lg={12}
                xl={12}>
                <Typography variant="h6" className={classes.titleGroup} > Dados da venda</Typography>
              </Grid>
            </Grid>
            <Grid className={classes.item} item xs={12} sm={1} md={1} lg={1} xl={1}>
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
              className={classes.item}
              item
              xs={12}
              sm={11}
              md={11}
              lg={11}
              xl={11}
            >
              <FormControl fullWidth>
                <AsyncSelect
                  className={classes.select}
                  classes={classes}
                  styles={selectStyles}
                  components={components}
                  loadOptions={loadOptions}
                  onChange={handleChangeSingle}
                  onInputChange={handleInputChangeAsync}
                  placeholder={`Digite o ${textPlaceHolder} do cliente`}
                  loadingMessage={() => 'Buscando clientes'}
                  noOptionsMessage={() => 'Nenhum cliente encontrado'}
                  onBlur={handleBlurAsyncSelect}
                  onMenuOpen={handleMenuOpenAsyncSelect}
                  value={single}
                  openMenuOnFocus
                />
              </FormControl>
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
            <MaterialTable
              title="Produtos"
              columns={columns}
              data={dataProducts}
              editable={{
                onRowAdd: newData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      {
                        const data = dataProducts;
                        data.push(newData);
                        setDataProducts({ data }, () => resolve());
                      }
                      resolve()
                    }, 1000)
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      {
                        const data = dataProducts;
                        const index = data.indexOf(oldData);
                        data[index] = newData;
                        setDataProducts({ data }, () => resolve());
                      }
                      resolve()
                    }, 1000)
                  }),
                onRowDelete: oldData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      {
                        let data = dataProducts;
                        const index = data.indexOf(oldData);
                        data.splice(index, 1);
                        setDataProducts({ data }, () => resolve());
                      }
                      resolve()
                    }, 1000)
                  }),
              }}
            />
          </Grid>
          <br />
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