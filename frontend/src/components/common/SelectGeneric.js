import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';

const styles = theme => ({
  inputLabel: {
    transform: 'none !important',
    position: 'relative',
  },
});

function SelectGeneric(props) {
  const { value, onChange, showEmpty, itens, description } = props;
  return(
    <FormControl fullWidth>
      <InputLabel
        htmlFor='typeEvaluation'
      >
        {description}
      </InputLabel>
      <Select
        value={value}          
        fullWidth
        input={
          <Input
            name='typeEvaluationName'
            id='typeEvaluationInput'
            fullWidth
            value={value}
            onChange={(event) => onChange(event)}
          />                           
        }                             
      >            
        {showEmpty === true && (<MenuItem value={0}>
          <em></em>
        </MenuItem>)}
        {Object.keys(itens).map(key => { 
          return (
            <MenuItem key={key} value={itens[key].value}>
              <em>{itens[key].description}</em>
            </MenuItem>)
            }
          )
        }                    
      </Select>                            
    </FormControl> 
  );       
}

export default withStyles(styles)(SelectGeneric);
