import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import accounting from 'accounting';

import productService from '../../services/productService';
import { getErrosFromApi } from '../../utils/errorsHelper';

import MessageSnackbar from '../../components/common/MessageSnackbar';
import EditProduct from './EditProduct';
import ViewProduct from './ViewProduct';
import Confirm from '../../components/common/ConfirmAlert';
import { SaleType } from '../../utils/enums';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
});

function Product(props) {
  const maxLength = 56;
  const [products, setProducts] = useState([]);
  const [data, setData] = useState({});
  const [stateData, setStateData] = useState('LIST');
  const [columnSearch, setColumnSearch] = useState('description');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState({
    messageOpen: false,
    variantMessage: 'success',
    messageText: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  function handleCancel(previusOperation) {
    setIsSaving(false);
    let nextMessage = message;
    if (previusOperation === 'SAVE') {
      nextMessage.messageOpen = true;
      nextMessage.messageText = 'Produto salvo com sucesso!';
      nextMessage.variantMessage = 'success';
    } else if (previusOperation === 'DELETE') {
      nextMessage.messageOpen = true;
      nextMessage.messageText = 'Produto excluído com sucesso!';
      nextMessage.variantMessage = 'success';
    }
    setStateData('LIST');
    setMessage(nextMessage);
    fetchProducts();
  }

  function handleDelete(rowData) {
    setIsSaving(true);
    Confirm('Atenção', 'Confirma a exclusão?', () =>
      productService
        .remove(rowData.id)
        .then(() => handleCancel('DELETE'))
        .catch(error => {
          setIsSaving(false);
          setMessage({
            messageOpen: true,
            messageText: getErrosFromApi(error),
            variantMessage: 'error',
          });
        })
    );
  }

  function handleSave() {
    setIsSaving(true);
    if (data.id > 0) {
      productService
        .update(data)
        .then(res => {
          setData(res.data);
          handleCancel('SAVE');          
          //fetchProducts();
        })
        .catch(error => {
          setIsSaving(false);
          setMessage({
            messageOpen: true,
            messageText: getErrosFromApi(error),
            variantMessage: 'error',
          });
        });
    } else {
      productService
        .create(data)
        .then(res => {
          setData(res.data);
          handleCancel('SAVE');          
          //fetchProducts();
        })
        .catch(error => {
          setIsSaving(false);
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
    setData(rowData);
  }

  function handleCreate() {
    setStateData('EDIT_INSERT');
    setData({
      id: 0,
      saleType: SaleType.Weight,
      price: 0.0,
      expirationDays: 0,
      description: '',
      extraInformation: '',
      printExpirationDate: false,
      printDateOfPackaging: false,
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

  function handleValueChangeText(event) {
    var text = event.target.value;
    var lines = text.split(/(\r\n|\n|\r)/gm);
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].length > maxLength) {
        lines[i] = lines[i].substring(0, maxLength);
      }
    }

    setData({ ...data, extraInformation: lines.join('') });
  }

  const handleValueChangeInteger = name => event => {
    let _value = parseInt(event.target.value.replace(/[^0-9]/g, ''));
    if (isNaN(_value)) _value = 0;
    setData({ ...data, [name]: _value });
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

  const handleValueCheckedChange = name => event => {
    setData({ ...data, [name]: event.target.checked });
  };

  function fetchProducts() {
    if (search.length === 0) {
      setColumnSearch(columnSearch);
      return;
    }
    if (columnSearch === 'id' && /\D/.test(search)) {
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

    productService
      .getAll(0, 99999, columnSearch, '', '', filterType, search)
      .then(res => {
        setProducts(res.data);
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
    fetchProducts();
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
        <ViewProduct
          data={products}
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
        <EditProduct
          data={data}
          handleValueChange={handleValueChange}
          handleValueChangeInteger={handleValueChangeInteger}
          handleValueCheckedChange={handleValueCheckedChange}
          handleValueDecimalChange={handleValueDecimalChange}
          handleCancel={handleCancel}
          handleSave={handleSave}
          handleOpenMessage={handleOpenMessage}
          handleValueChangeText={handleValueChangeText}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}

export default withStyles(styles)(Product);
