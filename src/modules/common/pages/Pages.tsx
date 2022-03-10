import { AppBar, Box, CircularProgress, createTheme, Grid, IconButton, ListItemText, Menu, MenuItem, Modal, Theme, ThemeOptions, Toolbar, Typography, ThemeProvider, Stack, Snackbar, Alert } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import SideNavBar from "../components/SideNavBar";
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../redux/reducer";
import { Redirect, Route, Switch, useRouteMatch } from "react-router";
import { ROUTES } from "../../../configs/routes";
import ProductPage from "../../product/pages/ProductPage";
import UserPage from "../../user/pages/UserPage";
import NewProductPage from "../../product/pages/NewProductPage";
import { removeUserInfo } from "../../auth/redux/authReducer";
import Cookies from "js-cookie";
import { ACCESS_TOKEN_KEY } from "../../../utils/constants";
import { removeNotification } from "../redux/notificationReducer";
import UserDetailPage from "../../user/pages/UserDetailPage";
import CreateUserPage from "../../user/pages/CreateUserPage";


const themeOptions: ThemeOptions = {
    components: {
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: "#fff",
                    "&.Mui-checked": {
                        color: "#fff"
                    }
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& label.Mui-focused': {
                        color: "white",
                    },
                    '& .MuiInput-underline:after': {
                        color: "white",
                        borderBottomColor: 'white',
                    },
                },
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    color: "white",
                    backgroundColor: "#252547",
                    transitionDuration: ".15s",
                    transitionProperty: "border,background-color,color,box-shadow",
                    transitionTimingFunction: "ease-in",
                    '&:hover': {
                        backgroundColor: "#1B1B38",
                        color: "white",
                    },
                    '& fieldset': {
                        borderColor: '#1B1B38',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'white',
                    },
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: "#fff",
                    "&.Mui-focused": {
                        color: "#fff",
                    }
                }
            }
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    color: "#fff",
                    "&.MuiSvgIcon-root": {
                        color: "#fff"
                    },
                }
            }
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: "black",
                }
            }
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    color: "#fff",
                }
            }
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    color: "#fff",
                }
            }
        },
        MuiFormControlLabel: {
            styleOverrides: {
                root: {
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center"
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    "&::-webkit-scrollbar": {
                        height: "10px",
                        width: "10px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: "#b18aff",
                        borderRadius: "3px"
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "#13132b",
                        borderRadius: "3px"
                    }
                }
            }
        },
        MuiListItemText: {
            styleOverrides: {
                root: {
                    color: "#fff",
                    "& p": {
                        color: "#fff"
                    }
                }
            }
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: "#fff"
                }
            }
        },
        MuiTablePagination: {
            styleOverrides: {
                root: {
                    color: "#fff",
                    "& p": {
                        margin: 0
                    }
                }
            }
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    cursor: "pointer",
                    color: "#007bff"
                }
            }
        },
        MuiTabs: {
            styleOverrides: {
                root: {
                    "& > .MuiTabs-scroller > .MuiTabs-indicator ": {
                        backgroundColor: "#B181D9"
                    }
                }
            }
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    color: "#b4b4db",
                    borderColor: "#a16eff",
                    "&.Mui-selected": {
                        color: "#a16eff",
                        "&:hover": {
                            color: "#B187F3"
                        }
                    }
                }
            }
        },

    },
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
            primary: "#fff",
            disabled: "#fff"
        },
        background: {
            paper: '#323259',
            default: '#fff'
        },
    },
};

const theme: Theme = createTheme(themeOptions);
interface Props {
}
const Pages = (props: Props) => {
    const dispatch = useDispatch()
    const { path, url } = useRouteMatch();
    const { user, loadingData, notifications } = useSelector((state: AppState) => ({
        user: state.profile.user,
        loadingData: state.data.loadingData,
        notifications: state.notification.notifications
    }));
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        dispatch(removeUserInfo())
        Cookies.remove(ACCESS_TOKEN_KEY)
    }
    return (
        <>
            <ThemeProvider theme={theme}>
                <Box sx={{ height: "100vh", maxHeight: "100vh", width: "100%", backgroundColor: "#1B1B38", overflow: "hidden" }}>
                    <Grid container height={1} sx={{ display: "flex", position: "relative" }}>
                        <Grid item xs={12} sx={{ boxShadow: "0 0.5rem 1rem 0 #1a1f33", zIndex: "1100" }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <AppBar position="static">
                                    <Toolbar>
                                        <IconButton
                                            size="large"
                                            edge="start"
                                            aria-label="menu"
                                            sx={{ mr: 2, color: "#fff" }}
                                        >
                                            <MenuIcon />
                                        </IconButton>
                                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: "1.75rem" }}>
                                            Gear Focus Admin
                                        </Typography>
                                        <IconButton onClick={handleClick}><PersonRoundedIcon sx={{ color: "#fff" }} /></IconButton>
                                        <Menu anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}>
                                            <MenuItem><ListItemText primary="My Profile" secondary={user?.login} /></MenuItem>
                                            <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
                                        </Menu>
                                    </Toolbar>
                                </AppBar>
                            </Box>
                        </Grid>
                        <Grid item xs={2} height={1} sx={{ backgroundColor: "#323259", color: "#fff" }}><SideNavBar url={url} /></Grid>
                        <Grid item xs={10}>
                            <Switch>
                                <Route path={`${path}${ROUTES.products}${ROUTES.manageProduct}`} component={ProductPage}></Route>
                                <Route path={`${path}${ROUTES.products}${ROUTES.newProduct}`} component={NewProductPage}></Route>
                                <Route path={`${path}${ROUTES.user}${ROUTES.manageUser}`}><UserPage url={url} /></Route>
                                <Route path={`${path}${ROUTES.user}${ROUTES.newUser}`}><CreateUserPage url={url} /></Route>
                                <Route path={`${path}${ROUTES.user}${ROUTES.detailUser}/:id`}><UserDetailPage url={url} /></Route>
                                <Route path="*" render={() => <Redirect to={`${path}${ROUTES.products}${ROUTES.manageProduct}`} />} />
                            </Switch>
                        </Grid>
                    </Grid>
                </Box>
                <Modal open={loadingData}><Box sx={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress color='primary' /></Box>
                </Modal>
            </ThemeProvider>
            {notifications.map((item) => <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={true} key={item.id} anchorOrigin={item.anchorOrigin} autoHideDuration={4000} onClose={(e) => dispatch(removeNotification(item.id))}>
                    <Alert onClose={(e) => dispatch(removeNotification(item.id))} severity={item.type} sx={{ width: '100%' }}>
                        {item.message}
                    </Alert>
                </Snackbar>
            </Stack>
            )}
        </>)
}
export default Pages