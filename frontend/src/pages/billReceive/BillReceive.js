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
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import BillReceiveTable from '../../components/billReceive/BillReceiveTable';
import MessageSnackbar from '../../components/common/MessageSnackbar';
import clientService from '../../services/clientService';
import { getDateToString } from '../../utils/operators';
import AsyncSelectGeneric from '../../components/common/AsyncSelectGeneric';

const styles = theme => ({
  root: {
    width: '100%',
    height: `calc(100vh - ${theme.spacing(16)}px)`,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    overflowX: 'auto',
    padding: theme.spacing(2),
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

function BillReceive(props) {
  const { classes } = props;
  const [single, setSingle] = React.useState(null);
  const [prevSingle, setPrevSingle] = React.useState(null);
  const [messageData, setMessageData] = React.useState({
    messageOpen: false,
    messageText: '',
    variantMessage: 'success',
  });

  const [columnSearch, setColumnSearch] = React.useState('name');

  function handleOpenMessage(messageOpen, variantMessage, messageText) {
    setMessageData({ messageOpen, variantMessage, messageText });
  }

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

  return (
    <Paper className={classes.root}>
      <Grid container spacing={8}>
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
