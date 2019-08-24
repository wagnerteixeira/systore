/*import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({});

function BillReceive(props) {
  const { classes } = props;
  return <div />;
}

BillReceive.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(BillReceive);
*/

/* eslint-disable react/prop-types, react/jsx-handler-names */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import AsyncSelect from 'react-select/async';

import BillReceiveTable from '../../components/billReceive/BillReceiveTable';
import MessageSnackbar from '../../components/common/MessageSnackbar';
import clientService from '../../services/clientService';
import { debounceTimeWithParams, getDateToString } from '../../utils/operators';

const styles = theme => ({
  root: {
    width: '100%',
    height: `calc(100vh - ${theme.spacing(16)}px)`,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    overflowX: 'auto',
    padding: theme.spacing(2),
  },
  input: {
    display: 'flex',
    padding: 0,
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
  '@global': {
    'tr > td': {
      fontWeight: '600 !important',
      fontSize: '1.1em !important',
    },
  },
});

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

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  ValueContainer,
  LoadingMessage,
};

function BillReceive(props) {
  const { classes } = props;
  const [single, setSingle] = React.useState(null);
  const [prevSingle, setPrevSingle] = React.useState(null);
  //const [inputValue, setIputValue] = React.useState('');
  const [messageData, setMessageData] = React.useState({
    messageOpen: false,
    messageText: '',
    variantMessage: 'success',
  });

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

  function handleOpenMessage(messageOpen, variantMessage, messageText) {
    setMessageData({ messageOpen, variantMessage, messageText });
  }

  const selectStyles = {
    input: base => ({
      ...base,
      color: 'primary',
      '& input': {
        font: 'inherit',
      },
    }),
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

  return (
    <Paper className={classes.root}>
      <Grid container spacing={24}>
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
          className={classes.gridSearch}
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
              //onFocus={() => console.log('focus')}
              openMenuOnFocus
            />
          </FormControl>
        </Grid>
      </Grid>
      <BillReceiveTable
        clientId={single ? single.value : prevSingle ? prevSingle.value : '0'}
        clientData={single ? single.clientData : {}}
        handleOpenMessage={handleOpenMessage}
      />
      <MessageSnackbar
        onClose={() =>
          setMessageData({
            messageOpen: false,
            messageText: '',
            variantMessage: 'success',
          })
        }
        open={messageData.messageOpen}
        variant={messageData.variantMessage}
        message={messageData.messageText}
      />
    </Paper>
  );
}

BillReceive.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BillReceive);
