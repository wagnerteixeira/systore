import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  container: {
    marginTop: theme.spacing(3),
    display: 'block'
  },
  back: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    padding: theme.spacing(2),
    borderColor: '#C0C0C0',
    borderStyle: 'solid',
    borderWidth: '1px',
    width: '90%'
  },
  textField: {
    marginTop: '0px',
    marginBotton: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  textFieldInput: {
    padding: '0px'
  },
  inputFile: {
    display: 'none'
  },
  formControl: {
    margin: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1)
  },
  divPhone: {
    display: 'flex',
    flexDirection: 'wrap'
  },
  img: {
    height: theme.spacing(25),
    width: theme.spacing(40)
  },
  itens: {
    paddingTop: theme.spacing(2)
  },
  item: {
    paddingTop: `${theme.spacing(0.2)}px !important `,
    paddingBottom: `${theme.spacing(0.2)}px !important `
  }
});

function EditUser(props) {
  const { classes, handleValueChange, data, handleSave, handleCancel } = props;
  return (
    <div>
      <form className={classes.container} noValidate autoComplete="off">
        <div className={classes.back}>
          <Grid className={classes.itens} container spacing={3}>
            <Grid
              className={classes.item}
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <TextField
                id="name"
                label="Nome"
                className={classes.textField}
                value={data.userName}
                onChange={handleValueChange('userName')}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid
              className={classes.item}
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <TextField
                id="password"
                label="Senha"
                className={classes.textField}
                value={data.password}
                onChange={handleValueChange('password')}
                margin="normal"
                type="password"
                fullWidth
                autoComplete="current-password"
              />
            </Grid>
            <div className={classes.divRow}>
              <Button
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={handleSave}
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
          </Grid>
        </div>
      </form>
    </div>
  );
}

EditUser.propTypes = {
  classes: PropTypes.object.isRequired,
  handleValueChange: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

export default withStyles(styles)(EditUser);
