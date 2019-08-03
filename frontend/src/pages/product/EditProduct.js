import React from 'react'
import { Grid, TextField, Button, FormControlLabel, Checkbox, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import NumberFormatCustom from '../../components/common/NumberFormatCustom';

const styles = theme => ({
  container: {
    marginTop: theme.spacing(3),
    display: 'block',
  },
  back: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    padding: theme.spacing(2),
    borderColor: '#C0C0C0',
    borderStyle: 'solid',
    borderWidth: '1px',
    width: '90%',
  },
  textField: {
    marginTop: '0px',
    marginBotton: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  itens: {
    paddingTop: theme.spacing(2),
  },
  item: {
    padding: `${theme.spacing(1)}px !important `,
  },
  titleGroup: {
    margin: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(1)
  },
});

function EditProduct(props) {

  const { classes,
    data,
    handleValueChange,
    handleValueChangeInteger,
    handleValueCheckedChange,
    handleCancel,
    handleSave,
    handleValueDecimalChange
  } = props;

  return (
    <>
      <form className={classes.container} noValidate autoComplete="off">
        <div className={classes.back}>
          <Grid className={classes.itens} container spacing={1}>
            <Grid container spacing={1}>
              <Grid
                sm={12}
                md={12}
                lg={12}
                xl={12}>
                <Typography variant="h6" className={classes.titleGroup} > Dados gerais</Typography>
              </Grid>
            </Grid>
            <Grid
              className={classes.item}
              item
              xs={12}
              sm={6}
              md={6}
              lg={6}
              xl={3}
            >
              <TextField
                id="firstDescription"
                label="Descrição 1"
                className={classes.textField}
                value={data.firstDescription}
                onChange={handleValueChange('firstDescription')}
                margin="normal"
                fullWidth
                inputProps={{
                  maxLength: 30,
                }}
              />
            </Grid>
            <Grid
              className={classes.item}
              item
              xs={12}
              sm={6}
              md={6}
              lg={6}
              xl={3}
            >
              <TextField
                id="secondDescription"
                label="Descrição 2"
                className={classes.textField}
                value={data.secondDescription}
                onChange={handleValueChange('secondDescription')}
                margin="normal"
                fullWidth
                inputProps={{
                  maxLength: 30,
                }}
              />
            </Grid>
            <Grid
              className={classes.item}
              item
              xs={12}
              sm={6}
              md={6}
              lg={6}
              xl={3}
            >
              <TextField
                id="thirdDescription"
                label="Descrição 3"
                className={classes.textField}
                value={data.thirdDescription}
                onChange={handleValueChange('thirdDescription')}
                margin="normal"
                fullWidth
                inputProps={{
                  maxLength: 30,
                }}
              />
            </Grid>
            <Grid
              className={classes.item}
              item
              xs={12}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <TextField
                className={classes.textField}
                label="Preço (R$)"
                value={data.price}
                onChange={handleValueDecimalChange('price')}
                id="price"
                fullWidth
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
              />
            </Grid>
            <Grid
              className={classes.item}
              item
              xs={12}
              sm={6}
              md={3}
              lg={3}
              xl={3}
            >
              <TextField
                id="expirationDays"
                label="Dias de validade"
                className={classes.textField}
                value={data.expirationDays}
                onChange={handleValueChangeInteger('expirationDays')}
                fullWidth
              />
            </Grid>
            <Grid container spacing={1}>
              <Grid
                sm={12}
                md={12}
                lg={12}
                xl={12}>
                <Typography variant="h6" className={classes.titleGroup} > Configurações de impressão</Typography>
              </Grid>
            </Grid>
            <Grid
              className={classes.item}
              item
              xs={12}
              sm={6}
              md={6}
              lg={3}
              xl={3}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.printExpirationDate}
                    onChange={handleValueCheckedChange('printExpirationDate')}
                    value="printExpirationDate"
                    color="primary"
                  />
                }
                label="Imprimir validade"
              />
            </Grid>
            <Grid
              className={classes.item}
              item
              xs={12}
              sm={6}
              md={6}
              lg={3}
              xl={3}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.printDateOfPackaging}
                    onChange={handleValueCheckedChange('printDateOfPackaging')}
                    value="printDateOfPackaging"
                    color="primary"
                  />
                }
                label="Imprimir data de embalamento"
              />
            </Grid>
          </Grid>
          <br />
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
        </div>
      </form>
    </>
  );
}

export default withStyles(styles)(EditProduct);