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

import AsyncSelect from 'react-select/lib/Async';

import BillReceiveTable from '../../components/billReceive/BillReceiveTable';
import MessageSnackbar from '../../components/common/MessageSnackbar';
import clientService from '../../services/clientService';
import { debounceTimeWithParams } from '../../utils/operators';

const styles = theme => ({
  root: {
    width: '100%',
    height: '100vh',
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit,
    overflowX: 'auto',
    padding: theme.spacing.unit * 2,
  },
  input: {
    display: 'flex',
    padding: 0
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden'
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  loadingMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  select: {
    maxWidth: '95%'
  },
});

async function fetchClients(inputValue, callback) {
  console.log('get');
  let result = await clientService.getAll(
    0,
    10,
    'name',
    'asc',
    'rg',
    inputValue
  );
  let _clients = result.data.map(client => ({
    value: client._id,
    label: `Código: ${client.code} Nome: ${client.name} Cpf: ${client.cpf}`,
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
          ...props.innerProps
        }
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
        fontWeight: props.isSelected ? 500 : 400
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
  LoadingMessage
};

function BillReceive(props) {
  const { classes } = props;
  const [single, setSingle] = React.useState(null);
  const [prevSingle, setPrevSingle] = React.useState(null);
  //const [inputValue, setIputValue] = React.useState('');
  const [messageData, setMessageData] = React.useState({
    messageOpen: false,
    messageText: '',
    variantMessage: 'success'
  });

  function handleChangeSingle(value) {

    setSingle(value);
  }

  function loadOptions(inputValue, callback) {
    console.log('loadOptions');
    fetchClientsDebounce(inputValue, callback);
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
        font: 'inherit'
      }
    })
  };

  function handleBlurAsyncSelect() {
    if ((!single) && (prevSingle)){
      setSingle(prevSingle);
      setPrevSingle(null);
    }
  }

  function handleMenuOpenAsyncSelect() {    
    if (single) {
      setPrevSingle(single)
      setSingle(null);
    }
  }

  return (
    <Paper className={classes.root}>
      <AsyncSelect
        className={classes.select}
        classes={classes}
        styles={selectStyles}
        components={components}
        loadOptions={loadOptions}
        onChange={handleChangeSingle}
        onInputChange={handleInputChangeAsync}
        placeholder="Digite o nome do cliente"
        loadingMessage={() => 'Buscando clientes'}
        noOptionsMessage={() => 'Nenhum cliente encontrado'}
        onBlur={handleBlurAsyncSelect}
        onMenuOpen={handleMenuOpenAsyncSelect}
        value={single}
        onFocus={() => console.log('focus')}
        openMenuOnFocus
      />      
      <BillReceiveTable
        clientId={single ? single.value : 0}
        clientData={single ? single.clientData : {}}
        handleOpenMessage={handleOpenMessage}
      />      
      <MessageSnackbar
        handleClose={() => setMessageData({ messageOpen: false })}
        open={messageData.messageOpen}
        variant={messageData.variantMessage}
        message={messageData.messageText}
      />
    </Paper>
  );
}

BillReceive.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(BillReceive);
