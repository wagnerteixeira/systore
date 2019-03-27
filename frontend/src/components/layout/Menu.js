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
import Login from '../../pages/user/Login';

import IconListButton from '../common/IconListButton';

import localStorageService from '../../localStorage/localStorageService';


import axios from '../../axios';

const drawerWidth = 300;

const styles = theme => ({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  mainContent: {
    width: '100%',
    height: '100%'
  },
  content: {
    top: theme.spacing.unit * 5,
    paddingTop: theme.spacing.unit * 8,
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
    marginLeft: theme.spacing.unit * 2,
    [theme.breakpoints.down('xs')]: {
      marginLeft: theme.spacing.unit * 5,
    },
  },
  iconClassName: {
    fontSize: 35
  },
  listItemClassName: {
    paddingLeft: theme.spacing.unit * 1,
    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.spacing.unit * 0.5,
      marginTop: -10
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
    width: theme.spacing.unit * 5,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 6,
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
    margin: theme.spacing.unit * 2,
  },
  grow: {
    flexGrow: 1,
  },
  userText: {
    position: 'relative',
    marginRight: theme.spacing.unit * 4,
  }
});
class Menu extends React.Component {

  constructor(props) {
    super(props);
    this.state = { user: {}, 
                   logged: true, 
                   drawerOpen: false, 
                   headerText: props.initialheaderText,
                   userName: '',
                   password:'',
                   displayName: '',
                   messageOpen: false,
                   variantMessage: 'success',
                   messageText: '',
                   anchorEl: null,
                  };
  }

  handleOpenMenu = event => {
    this.setState({ ...this.state, anchorEl: event.currentTarget });
  };

  handleLogout = () => {    
    localStorageService.setItem('user', '');
  }

  handleCloseMenu = () => {
    this.handleLogout();
    this.setState({ 
      ...this.state, 
      displayName: '', 
      logged: false, 
      anchorEl: null,
      messageOpen: true, 
      messageText: 'Usuário saiu do sistema.', 
      variantMessage: 'success',
    });
  };

  keyPress = (e) => {
    if(e.keyCode === 13){
      console.log(e.target.value)
      this.handleLogin();
    }
  }

  handleValueChange = name => event => {
    this.setState({...this.state, [name]: event.target.value});
  };

  handleDrawer = (value) => {
    this.setState({...this.state, drawerOpen: value });
  }

  handleHeaderText = (value)=> {
    this.setState({...this.state, headerText: value });
  }

  handleLogin = async () => {
    console.log(this.state);
    let user = {
      user_name: this.state.userName,
      password: this.state.password
    }

    try {
      const res = await axios.post('/oapi/login', user);
      console.log(res);
      if (res.data.errors) {
        let errors = res.data.errors.join('\n');
        this.setState({
          user: {}, 
          logged: false,
          messageOpen: true, 
          messageText: errors, 
          variantMessage: 'error'
         });
      }
      else { 
        this.setState({
          user: user, 
          logged: true, 
          displayName: user.user_name,
          messageOpen: true, 
          messageText: 'Usuário logado com sucesso!', 
          variantMessage: 'success',
          userName: '',
          password: ''
        })
        localStorageService.setItem('user', user.user_name);
        localStorageService.setItem('token', res.data.token);
      }
    }
    catch(e){      
      console.log(e);
      let errors = e.response.data.errors ? e.response.data.errors.join('\n') : 'Verifique usuário e/ou senha!';
      this.setState({...this.state, 
                     user: {}, 
                     logged: false,
                     messageOpen: true, 
                     messageText: errors, 
                     variantMessage: 'error'
                    });
    }    
  }

  handleMessageClose = () => {
    this.setState({ ...this.state, messageOpen: false });
  }
  
  render() {
    const { classes } = this.props;     
    const { logged, 
            userName, 
            password, 
            displayName,
            messageOpen,
            variantMessage,
            messageText,
            anchorEl
          } = this.state;
    const open = Boolean(anchorEl);
    
    let _logged = logged;
    let _displayName = displayName;
    if (!_logged){
      _displayName = localStorageService.getItem('user')
      if ((_displayName != '') && (_displayName != null)){
        _logged = true;
      }
      else
        _displayName = '';
    }
    return (       
      <div>
        {!_logged ? <Login 
                      userName={userName}
                      handleLogin={this.handleLogin}
                      password={password}
                      handleValueChange={this.handleValueChange}
                      handleMessageClose={this.handleMessageClose}
                      messageOpen={messageOpen}
                      variantMessage={variantMessage}
                      messageText={messageText}
                      keyPress={this.keyPress}
                    /> :         
        <div className={classes.root}>        
          <Drawer 
            variant="permanent"
            classes={{
              paper: classNames(classes.drawerPaper, 
                              !this.state.drawerOpen && classes.drawerPaperClose),
            }}
            open={this.state.drawerOpen}
          >
            <div className={classes.toolbar}>
              <IconButton onClick={() => this.handleDrawer(false)} color="inherit">
                <ChevronLeft />
              </IconButton>
            </div>
            <Divider />            
            <List>              
              {/*<IconListButton 
                linkTo={process.env.REACT_APP_PUBLIC_URL + '/'}
                iconType='attach_money'               
                primaryText='Títulos'    
                onClickButton={() => this.handleHeaderText('Títulos')}
                listItemClassName={classes.listItemClassName} 
                iconClassName={classes.iconClassName}
                listItemTextClassName={classes.listItemTextClassName}
              />*/}
              <IconListButton 
                linkTo={process.env.REACT_APP_PUBLIC_URL + '/client'}
                iconType='assignment_ind'                
                primaryText='Clientes' 
                onClickButton={() => this.handleHeaderText('Clientes')}
                listItemClassName={classes.listItemClassName} 
                iconClassName={classes.iconClassName}
                listItemTextClassName={classes.listItemTextClassName}
              />             
              <IconListButton 
                linkTo={process.env.REACT_APP_PUBLIC_URL + '/user'}
                iconType='accessibility_new'                
                primaryText='Usuários' 
                onClickButton={() => this.handleHeaderText('Usuários')}
                listItemClassName={classes.listItemClassName} 
                iconClassName={classes.iconClassName}
                listItemTextClassName={classes.listItemTextClassName}
              />              
            </List>          
          </Drawer>             
          <div className={classes.mainContent}>
            <AppBar
              className={classNames(classes.appBar, this.state.drawerOpen && classes.appBarShift)}
            >
              <Toolbar disableGutters={!this.state.drawerOpen}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={() => this.handleDrawer(true)}
                  className={classNames(classes.menuButton, this.state.drawerOpen && classes.hide)}
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
                <div>
                  <ButtonBase
                    onClick={this.handleOpenMenu}
                  >
                    <Typography 
                      variant="h6" 
                      color="inherit" 
                      className={classes.userText}
                    >
                      { _displayName }
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
                    open={open}
                    onClose={this.handleClose}
                  >
                    <MenuItem onClick={this.handleCloseMenu}>&nbsp;&nbsp;&nbsp;&nbsp;Sair&nbsp;&nbsp;&nbsp;&nbsp;</MenuItem>
                  </MaterialMenu>                
                </div>
              </Toolbar>
            </AppBar>    
            <div className={classes.content}>
              {this.props.children}
            </div>
          </div>
        </div>}
        <MessageSnackbar
          handleClose={this.handleMessageClose}
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
};

export default withStyles(styles, { withTheme: true })(Menu);
