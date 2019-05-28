import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import { Link } from 'react-router-dom';

const IconListButton = props => (
  <Link to={props.linkTo} style={{ textDecoration: 'none' }}>
    <ListItem
      href={props.linkTo}
      button
      className={props.listItemClassName}
      onClick={props.onClickButton}
    >
      <ListItemIcon>
        <Icon color="primary" className={props.iconClassName}>
          {props.iconType}
        </Icon>
      </ListItemIcon>
      <ListItemText
        color="primary"
        className={props.listItemTextClassName}
        primary={props.primaryText}
        secondary={props.secondaryText}
      />
    </ListItem>
  </Link>
);

IconListButton.propTypes = {
  //classes: PropTypes.object.isRequired,
  linkTo: PropTypes.string.isRequired,
  listItemClassName: PropTypes.string.isRequired,
  primaryText: PropTypes.string.isRequired,
  secondaryText: PropTypes.string,
};

export default IconListButton;
