import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import accounting from 'accounting';

import saleService from '../../services/saleService';
import { getErrosFromApi } from '../../utils/errorsHelper';

import MessageSnackbar from '../../components/common/MessageSnackbar';
import EditSale from './EditSale';
import ViewSale from './ViewSale';
import Confirm from '../../components/common/ConfirmAlert';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
});

function Sale(props) {
  const [sales, setSales] = useState([]);
  const [data, setData] = useState({});
  const [stateData, setStateData] = useState('LIST');
  const [columnSearch, setColumnSearch] = useState('vendor');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState({
    messageOpen: false,
    variantMessage: 'success',
    messageText: '',
  });

  function handleCancel(previusOperation) {
    let nextMessage = message;
    if (previusOperation === 'SAVE') {
      nextMessage.messageOpen = true;
      nextMessage.messageText = 'Venda salva com sucesso!';
      nextMessage.variantMessage = 'success';
    } else if (previusOperation === 'DELETE') {
      nextMessage.messageOpen = true;
      nextMessage.messageText = 'Venda excluída com sucesso!';
      nextMessage.variantMessage = 'success';
    }
    setStateData('LIST');
    setMessage(nextMessage);
    fetchSales();
  }

  function handleDelete(rowData) {
    Confirm('Atenção', 'Confirma a exclusão?', () =>
      saleService
        .remove(rowData.id)
        .then(() => handleCancel('DELETE'))
        .catch(error => {
          setMessage({
            messageOpen: true,
            messageText: getErrosFromApi(error),
            variantMessage: 'error',
          });
        })
    );
  }

  function handleSave() {
    if (data.id > 0) {
      saleService
        .update(data)
        .then(res => {
          handleCancel('SAVE');
          fetchSales();
        })
        .catch(error => {
          setMessage({
            messageOpen: true,
            messageText: getErrosFromApi(error),
            variantMessage: 'error',
          });
        });
    } else {
      saleService
        .create(data)
        .then(res => {
          handleCancel('SAVE');
          fetchSales();
        })
        .catch(error => {
          setMessage({
            messageOpen: true,
            messageText: getErrosFromApi(error),
            variantMessage: 'error',
          });
        });
    }
  }

  function handleEdit(rowData) {
    setStateData('EDIT_INSERT');
    saleService
      .getSaleFullById(rowData.id)
      .then(res => {
        setData(res.data);
        console.log(res.data);
      })
      .catch(error => {
        setMessage({
          messageOpen: true,
          messageText: getErrosFromApi(error),
          variantMessage: 'error',
        });
      });
  }

  function handleCreate() {
    setStateData('EDIT_INSERT');
    setData({
      id: 0,
      clientId: 0,
      vendor: '',
      saleDate: new Date(),
      finalValue: 0.0,
      saleProducts: [],
    });
  }

  function handleOpenMessage(messageOpen, variantMessage, messageText) {
    setMessage({
      messageOpen: messageOpen,
      messageText: messageText,
      variantMessage: variantMessage,
    });
  }

  const handleValueChange = name => event => {
    setData({ ...data, [name]: event.target.value });
  };

  const handleDateValueChange = name => date => {
    setData({ ...data, [name]: date });
  };

  const handleValueDecimalChange = name => event => {
    let _value = 0.0;
    if (typeof event.target.value === 'string') {
      _value = accounting.unformat(
        (_value = event.target.value.replace('.', ','))
      );
    } else _value = event.target.value;
    setData({ ...data, [name]: _value });
  };

  function fetchSales() {
    if (search.length === 0) {
      setColumnSearch(columnSearch);
      return;
    }
    if (columnSearch === 'Id' && /\D/.test(search)) {
      setMessage({
        messageOpen: true,
        messageText: 'Informe somente números na pesquisa por código.',
        variantMessage: 'warning',
      });
      return;
    }

    let filterType = '';
    if (columnSearch === 'id') filterType = 'Eq';
    else filterType = 'StW';

    saleService
      .getAll(0, 99999, columnSearch, '', '', filterType, search)
      .then(res => {
        setSales(res.data);
      })
      .catch(error =>
        setMessage({
          messageOpen: true,
          messageText: getErrosFromApi(error),
          variantMessage: 'warning',
        })
      );
  }

  const handleRequestSearch = event => {
    setColumnSearch(event.target.value);
  };

  function handleSearch() {
    fetchSales();
  }

  const handleChangeTextSearch = event => {
    setSearch(event.target.value.toUpperCase());
  };

  const { classes } = props;

  return (
    <div className={classes.root}>
      <MessageSnackbar
        onClose={() =>
          setMessage({
            messageOpen: false,
            messageText: '',
            variantMessage: 'success',
          })
        }
        open={message.messageOpen}
        variant={message.variantMessage}
        message={message.messageText}
      />
      {stateData === 'LIST' && (
        <ViewSale
          data={sales}
          columnSearch={columnSearch}
          search={search}
          handleSearch={handleSearch}
          handleCreate={handleCreate}
          handleChangeTextSearch={handleChangeTextSearch}
          handleRequestSearch={handleRequestSearch}
          actions={[
            {
              icon: 'edit',
              tooltip: 'Editar',
              iconProps: {
                color: 'primary',
              },
              onClick: (event, rowData) => handleEdit(rowData),
            },
            {
              icon: 'delete',
              tooltip: 'Excluir',
              iconProps: {
                color: 'secondary',
              },
              onClick: (event, rowData) => handleDelete(rowData),
            },
          ]}
        />
      )}
      {stateData === 'EDIT_INSERT' && (
        <EditSale
          data={data}
          handleValueChange={handleValueChange}
          handleDateValueChange={handleDateValueChange}
          handleValueDecimalChange={handleValueDecimalChange}
          handleCancel={handleCancel}
          handleSave={handleSave}
          handleOpenMessage={handleOpenMessage}
          message={message}
        />
      )}
    </div>
  );
}

export default withStyles(styles)(Sale);
