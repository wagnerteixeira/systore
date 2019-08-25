import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AsyncSelect from 'react-select/async';
import {
  FormControl,
  Typography,
  TextField,
  Paper,
  MenuItem,
} from '@material-ui/core';

import { debounceTimeWithParams } from '../../utils/operators';

const styles = theme => ({
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
});

function AsyncSelectGeneric(props) {
  const {
    placeholder,
    loadingMessage,
    noOptionsMessage,
    single,
    prevSingle,
    fetch,
    setSingle,
    setPrevSingle,
    columnSearch,
    handleOpenMessage,
    classes,
  } = props;
  const fetchDebounce = debounceTimeWithParams(500, fetch);

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

  function handleChangeSingle(value) {
    setSingle(value);
  }

  function loadOptions(inputValue, callback) {
    fetchDebounce(inputValue, columnSearch, callback, handleOpenMessage);
  }

  function handleInputChangeAsync(newValue, action) {
    const inputValue = newValue.toUpperCase();
    return inputValue;
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

  return (
    <FormControl fullWidth>
      <AsyncSelect
        className={classes.select}
        classes={classes}
        styles={selectStyles}
        components={components}
        loadOptions={loadOptions}
        onChange={handleChangeSingle}
        onInputChange={handleInputChangeAsync}
        placeholder={placeholder}
        loadingMessage={loadingMessage}
        noOptionsMessage={noOptionsMessage}
        onBlur={handleBlurAsyncSelect}
        onMenuOpen={handleMenuOpenAsyncSelect}
        value={single}
        openMenuOnFocus
      />
    </FormControl>
  );
}

export default withStyles(styles)(AsyncSelectGeneric);
