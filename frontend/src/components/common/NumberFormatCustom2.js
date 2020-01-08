import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

function NumberFormatCustom2(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      decimalSeparator=","
      decimalScale={3}
    />
  );
}

NumberFormatCustom2.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};
export default NumberFormatCustom2;
