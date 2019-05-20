import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { blue, red, green } from '@material-ui/core/colors';

const MuiTheme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary: {
      light: blue[500],
      main: blue[600],
      dark: blue[700],
      contrastText: '#fff'
    },
    secondary: {
      light: red[600],
      main: red[700],
      dark: red[800],
      contrastText: '#000'
    },
    edit: {
      light: green[500],
      main: green[600],
      dark: green[700],
      contrastText: '#fff'
    }
  }
});

export default MuiTheme;