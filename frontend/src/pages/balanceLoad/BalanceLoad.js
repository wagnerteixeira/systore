import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles';
import MessageSnackbar from '../../components/common/MessageSnackbar';
import { Grid } from '@material-ui/core';
import {
    Fab,
    RadioGroup,
    FormControlLabel,
    Radio,
    Paper
} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(1),
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        paddingLeft: theme.spacing(1),
        paddingTop: theme.spacing(1),
    },
    fab: {
        margin: theme.spacing(1),
    },
    radioGroup:{
        paddingTop: theme.spacing(2)
    }
}));

function BalanceLoad(props) {
    const [initialDate, setInitialDate] = useState(new Date())
    const [exportType, setExportType] = useState('onlyChanged')
    const [message, setMessage] = useState({
        messageOpen: false,
        variantMessage: 'success',
        messageText: ''
    });

    const classes = useStyles();

    console.log('classes', classes);

    return (
        <Paper className={classes.root}>
            <MessageSnackbar
                onClose={() => setMessage({ messageOpen: false })}
                open={message.messageOpen}
                variant={message.variantMessage}
                message={message.messageText}
            />
            <Grid container spacing={5} direction="row">
                <Grid
                    item
                    xs={12}
                    sm={4}
                    md={4}
                    lg={4}
                    xl={4}
                >
                    <RadioGroup
                        aria-label="export-type"
                        name="export-type"
                        value={exportType}
                        row
                        className={classes.radioGroup}
                        onChange={(event) => setExportType(event.target.value)}
                    >
                        <FormControlLabel
                            value="onlyChanged"
                            control={<Radio color="primary" />}
                            label="Apenas modificados"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="all"
                            control={<Radio color="primary" />}
                            label="Todos"
                            labelPlacement="end"
                        />
                    </RadioGroup>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={4}
                    md={4}
                    lg={4}
                    xl={4}
                >
                    <Fab color="primary" aria-label="search" className={classes.fab}>
                        <SearchIcon />
                    </Fab>
                </Grid>
            </Grid>
        </Paper>
    )
}

BalanceLoad.propTypes = {

}

export default BalanceLoad

