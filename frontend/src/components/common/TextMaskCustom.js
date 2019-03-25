import React from 'react';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';


function TextMaskCustom(props) {
  const { inputRef, mask, showMask, placeholderChar, ...other } = props;  
  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={mask}
      showMask={showMask}
      placeholderChar={placeholderChar}
    />
  );
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
};


export default TextMaskCustom;