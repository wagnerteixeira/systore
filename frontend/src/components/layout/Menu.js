import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import MaterialMenu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ButtonBase from '@material-ui/core/ButtonBase';

import MessageSnackbar from '../common/MessageSnackbar';

import IconListButton from '../common/IconListButton';

import config from '../../config/config.json';

const drawerWidth = 300;

const styles = theme => ({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  mainContent: {
    width: '100%',
    height: '100%',
  },
  content: {
    top: theme.spacing(5),
    paddingTop: theme.spacing(8),
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  typographyDawerOpen: {
    marginLeft: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      marginLeft: theme.spacing(5),
    },
  },
  iconClassName: {
    fontSize: 35,
  },
  listItemClassName: {
    paddingLeft: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.spacing(0.5),
      marginTop: -10,
    },
  },
  listItemTextClassName: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(5),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(6),
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    ...theme.mixins.toolbar,
  },
  icon: {
    margin: theme.spacing(2),
  },
  marginRight: {
    marginRight: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
  userText: {
    position: 'relative',
    marginRight: theme.spacing(4),
  },
  headerToolbar: {
    display: 'flex',
    flexDirection: 'row',
  },
});
class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,

      drawerOpen: false,
      headerText: '',
      password: '',
      userName: '',
      messageOpen: false,
      variantMessage: 'success',
      messageText: '',
      anchorEl: null,
      date: new Date().toLocaleString().slice(0, 16),
      interval: 0,
    };
  }

  componentWillMount() {
    let _interval = setInterval(
      () => this.setState({ date: new Date().toLocaleString().slice(0, 16) }),
      60000
    );

    this.setState({ interval: _interval });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  handleOpenMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMessageClose = () => {
    this.setState({ messageOpen: false });
  };

  onClose = () => {
    this.setState({ anchorEl: null });
  };

  /*onCloseMenu = () => {
    this.props.handleLogout();
    this.setState({
      anchorEl: null,
      messageOpen: true,
      messageText: 'Usuário saiu do sistema.',
      variantMessage: 'success'
    });
  };*/

  handleDrawer = value => {
    this.setState({ drawerOpen: value });
  };

  handleHeaderText = value => {
    this.setState({ headerText: value });
  };

  render() {
    const { classes, handleLogout } = this.props;
    const { messageOpen, variantMessage, messageText, anchorEl } = this.state;

    return (
      <div className={classes.root}>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(
              classes.drawerPaper,
              !this.state.drawerOpen && classes.drawerPaperClose
            ),
          }}
          open={this.state.drawerOpen}
        >
          <div className={classes.toolbar}>
            <IconButton
              onClick={() => this.handleDrawer(false)}
              color="inherit"
            >
              <ChevronLeft />
            </IconButton>
          </div>
          <Divider />
          <List>
            <IconListButton
              linkTo={process.env.REACT_APP_PUBLIC_URL + '/billsReceive'}
              iconType="attach_money"
              primaryText="Títulos"
              onClickButton={() => this.handleHeaderText('Títulos')}
              listItemClassName={classes.listItemClassName}
              iconClassName={classes.iconClassName}
              listItemTextClassName={classes.listItemTextClassName}
            />
            <IconListButton
              linkTo={process.env.REACT_APP_PUBLIC_URL + '/client'}
              iconType="assignment_ind"
              primaryText="Clientes"
              onClickButton={() => this.handleHeaderText('Clientes')}
              listItemClassName={classes.listItemClassName}
              iconClassName={classes.iconClassName}
              listItemTextClassName={classes.listItemTextClassName}
            />
            <IconListButton
              linkTo={process.env.REACT_APP_PUBLIC_URL + '/user'}
              iconType="accessibility_new"
              primaryText="Usuários"
              onClickButton={() => this.handleHeaderText('Usuários')}
              listItemClassName={classes.listItemClassName}
              iconClassName={classes.iconClassName}
              listItemTextClassName={classes.listItemTextClassName}
            />
            {this.state.user.admin && (
              <IconListButton
                linkTo={process.env.REACT_APP_PUBLIC_URL + '/log'}
                iconType="assignment"
                primaryText="Auditoria"
                onClickButton={() => this.handleHeaderText('Auditoria')}
                listItemClassName={classes.listItemClassName}
                iconClassName={classes.iconClassName}
                listItemTextClassName={classes.listItemTextClassName}
              />
            )}
          </List>
        </Drawer>
        <div className={classes.mainContent}>
          <AppBar
            className={classNames(
              classes.appBar,
              this.state.drawerOpen && classes.appBarShift
            )}
          >
            <Toolbar
              className={classes.headerToolbar}
              disableGutters={!this.state.drawerOpen}
            >
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => this.handleDrawer(true)}
                className={classNames(
                  classes.menuButton,
                  this.state.drawerOpen && classes.hide
                )}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                className={classes.typographyDawerOpen}
                variant="h6"
                color="inherit"
                noWrap
              >
                {this.state.headerText}
              </Typography>
              <div className={classes.grow} />
              <Typography
                variant="subtitle2"
                color="inherit"
                className={classes.marginRight}
              >
                {this.state.date}
              </Typography>
              <Typography variant="caption" className={classes.marginRight}>
                {config.version}
              </Typography>
              <div className={classes.userMenu}>
                <ButtonBase aria-haspopup="true" onClick={this.handleOpenMenu}>
                  <Typography
                    variant="h6"
                    color="inherit"
                    className={classes.userText}
                  >
                    {this.state.user.user_name}
                  </Typography>
                </ButtonBase>
                <MaterialMenu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={this.onClose}
                >
                  <MenuItem onClick={handleLogout}>
                    &nbsp;&nbsp;&nbsp;&nbsp;Sair&nbsp;&nbsp;&nbsp;&nbsp;
                  </MenuItem>
                </MaterialMenu>
              </div>
            </Toolbar>
          </AppBar>
          <div className={classes.content}>{this.props.children}</div>
        </div>
        <MessageSnackbar
          onClose={this.handleMessageClose}
          open={messageOpen}
          variant={variantMessage}
          message={messageText}
        />
      </div>
    );
  }
}

Menu.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  handleLogout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Menu);
