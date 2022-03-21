import {
  AppBar,
  Box,
  CircularProgress,
  createTheme,
  Grid,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Theme,
  ThemeOptions,
  Toolbar,
  Typography,
  ThemeProvider,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SideNavBar from '../components/SideNavBar';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../redux/reducer';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import { ROUTES } from '../../../configs/routes';
import ProductPage from '../../product/pages/ProductPage';
import UserPage from '../../user/pages/UserPage';
import { removeUserInfo } from '../../auth/redux/authReducer';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_KEY } from '../../../utils/constants';
import { removeNotification } from '../redux/notificationReducer';
import UserDetailPage from '../../user/pages/UserDetailPage';
import CreateUserPage from '../../user/pages/CreateUserPage';
import CreateProductPage from '../../product/pages/CreateProductPage';
import { red } from '@mui/material/colors';
import ProductDetailPage from '../../product/pages/ProductDetailPage';

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#323259',
      contrastText: '#fff',
    },
    secondary: {
      main: '#b18aff',
      contrastText: '#fff',
    },
    text: {
      primary: '#fff',
      disabled: '#fff',
    },
    background: {
      paper: '#323259',
      default: '#fff',
    },
  },
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        noOptions: {
          color: '#fff',
        },
        listbox: {
          '&::-webkit-scrollbar': {
            height: '10px',
            width: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#b18aff',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#13132b',
            borderRadius: '3px',
          },
        },
        loading: {
          color: '#fff',
        },
        tag: {
          backgroundColor: '#A16EFF',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#fff',
          '&.Mui-checked': {
            color: '#fff',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#fff',
          '&.Mui-focused': {
            color: '#fff',
          },
          '&.Mui-focused:valid': {
            color: '#fff',
          },
          '&.Mui-focused:invalid': {
            color: red[700],
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: 'white',
          backgroundColor: '#252547',
          transitionDuration: '.15s',
          transitionProperty: 'border,background-color,color,box-shadow',
          transitionTimingFunction: 'ease-in',
          '& label.Mui-focused:valid': {
            color: '#fff',
          },
          '& label.Mui-focused:invalid': {
            color: red[700],
          },
          '&:hover': {
            '& input:invalid + fieldset': {
              borderColor: red[700],
              color: red[700],
            },
            '& input:valid + fieldset': {
              borderColor: '#fff',
              color: '#fff',
            },
          },
          '&.Mui-focused:valid fieldset': {
            borderColor: '#fff',
          },
          '&.Mui-focused:invalid fieldset': {
            borderColor: red[700],
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '&.MuiInput-underline:after': {
            color: 'white',
            borderBottomColor: 'white',
          },
          '& label.Mui-focused': {
            borderColor: '#fff',
            color: '#fff',
          },
          '& label.Mui-focused:valid': {
            borderColor: '#fff',
            color: '#fff',
          },
          '& label.Mui-focused:invalid': {
            borderColor: red[700],
            color: red[700],
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: '#fff',
          '&.MuiSvgIcon-root': {
            color: '#fff',
          },
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          '& p': {
            color: '#fff',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: 'black',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "#fff"
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'center',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          '&::-webkit-scrollbar': {
            height: '10px',
            width: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#b18aff',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#13132b',
            borderRadius: '3px',
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          color: '#fff',
          '& p': {
            color: '#fff',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
        caption: {
          color: '#fff',
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          color: '#fff',
          '& p': {
            margin: 0,
          },
        },
        selectIcon: {
          color: '#fff',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
          color: '#007bff',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& > .MuiTabs-scroller > .MuiTabs-indicator ': {
            backgroundColor: '#B181D9',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#b4b4db',
          borderColor: '#a16eff',
          '&.Mui-selected': {
            color: '#a16eff',
            '&:hover': {
              color: '#B187F3',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: '#fff',
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
      },
    },
  },
  typography: {
    body1: {
      fontSize: '0.9rem',
    },
  },
};

const theme: Theme = createTheme(themeOptions);
interface Props {}
const Pages = (props: Props) => {
  const dispatch = useDispatch();
  const { path, url } = useRouteMatch();
  const { user, loadingData, loadingUserData, loadingProductData, notifications } = useSelector((state: AppState) => ({
    user: state.profile.user,
    loadingData: state.data.loadingData,
    loadingUserData: state.user.loadingUserData,
    loadingProductData: state.product.loadingProductData,
    notifications: state.notification.notifications,
  }));
  const [openSideBar, setOpenSideBar] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (e: any) => {
    setOpenSideBar(!openSideBar);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    dispatch(removeUserInfo());
    Cookies.remove(ACCESS_TOKEN_KEY);
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            height: '100vh',
            maxHeight: '100vh',
            width: '100%',
            backgroundColor: '#1B1B38',
            overflow: 'hidden',
          }}
        >
          <Grid container item xs={12} sx={{ position: 'relative', justifyContent: 'space-between', height: '100%' }}>
            <Grid item xs={12} sx={{ boxShadow: '0 0.5rem 1rem 0 #1a1f33', zIndex: 1100 }}>
              <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                  <Toolbar>
                    <IconButton
                      size="large"
                      edge="start"
                      aria-label="menu"
                      sx={{ mr: 2, color: '#fff' }}
                      onClick={handleMenuClick}
                    >
                      <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: '1.75rem' }}>
                      Gear Focus Admin
                    </Typography>
                    <IconButton onClick={handleClick}>
                      <PersonRoundedIcon sx={{ color: '#fff' }} />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                      <MenuItem>
                        <ListItemText primary="My Profile" secondary={user?.login} />
                      </MenuItem>
                      <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
                    </Menu>
                  </Toolbar>
                </AppBar>
              </Box>
            </Grid>
            <Grid container width={1} height="100vh" sx={{ flexWrap: 'nowrap' }}>
              <Grid item sx={{ position: 'sticky', left: '0', height: 1, flex: '0 1 fit-content', zIndex: 1099 }}>
                <SideNavBar
                  url={url}
                  open={openSideBar}
                  setOpen={(open: boolean) => {
                    setOpenSideBar(open);
                  }}
                />
              </Grid>
              <Grid item xs sx={{ flex: '1 1 fit-content' }}>
                <Switch>
                  <Route path={`${path}${ROUTES.products}${ROUTES.manageProduct}`}>
                    <ProductPage url={url} />
                  </Route>
                  <Route path={`${path}${ROUTES.products}${ROUTES.newProduct}`}>
                    <CreateProductPage url={url} />
                  </Route>
                  <Route path={`${path}${ROUTES.products}${ROUTES.detailProduct}/:id`}>
                    <ProductDetailPage url={url} />
                  </Route>
                  <Route path={`${path}${ROUTES.user}${ROUTES.manageUser}`}>
                    <UserPage url={url} />
                  </Route>
                  <Route path={`${path}${ROUTES.user}${ROUTES.newUser}`}>
                    <CreateUserPage url={url} />
                  </Route>
                  <Route path={`${path}${ROUTES.user}${ROUTES.detailUser}/:id`}>
                    <UserDetailPage url={url} />
                  </Route>
                  <Route path="*" render={() => <Redirect to={`${path}${ROUTES.products}${ROUTES.manageProduct}`} />} />
                </Switch>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Modal open={loadingData || loadingUserData || loadingProductData}>
          <Box sx={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress color="secondary" />
          </Box>
        </Modal>
      </ThemeProvider>
      {notifications.map((item) => (
        <Stack spacing={2} key={item.id} sx={{ width: '100%' }}>
          <Snackbar
            open={true}
            anchorOrigin={item.anchorOrigin}
            autoHideDuration={4000}
            onClose={(e) => dispatch(removeNotification(item.id))}
          >
            <Alert onClose={(e) => dispatch(removeNotification(item.id))} severity={item.type} sx={{ width: '100%' }}>
              {item.message}
            </Alert>
          </Snackbar>
        </Stack>
      ))}
    </>
  );
};
export default Pages;
