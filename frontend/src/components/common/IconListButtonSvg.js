import React  from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import { withStyles } from '@material-ui/core/styles';

import { Link } from 'react-router-dom'

const styles = theme => ({
  icon: {
    paddingTop: theme.spacing.unit * 0.5,      
  }, 
});

const IconListButtonSvg = props => {
  const { classes } = props;
  return (
    <Link to={props.linkTo} style={{ textDecoration: 'none' }} >
      <ListItem href={props.linkTo} button className={props.listItemClassName} onClick={props.onClickButton}>        
        <SvgIcon color='primary' className={classes.icon} fontSize="large">            
            {props.path}
        </SvgIcon> 
        <ListItemText color='primary' className={props.listItemTextClassName} primary={props.primaryText} secondary={props.secondaryText} />  
      </ListItem>  
    </Link>
  );
}


IconListButtonSvg.propTypes = {
  classes: PropTypes.object.isRequired,
  linkTo: PropTypes.string.isRequired,
  listItemClassName: PropTypes.string.isRequired,
  primaryText: PropTypes.string.isRequired,
  secondaryText: PropTypes.string,
};

export default withStyles(styles)(IconListButtonSvg);