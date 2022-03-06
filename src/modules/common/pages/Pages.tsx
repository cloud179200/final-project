import { AppBar, Box, CircularProgress, createTheme, Grid, IconButton, ListItemText, Menu, MenuItem, Modal, Theme, ThemeOptions, Toolbar, Typography, ThemeProvider } from "@mui/material"
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
import NewUserPage from "../../user/pages/NewUserPage";
import { removeUserInfo } from "../../auth/redux/authReducer";
import Cookies from "js-cookie";
import { ACCESS_TOKEN_KEY } from "../../../utils/constants";

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
            primary: "#fff",
            disabled: "#fff"
        }
    },
};

const theme: Theme = createTheme(themeOptions);
interface Props {
}
const Pages = (props: Props) => {
    const dispatch = useDispatch()
    const { path, url } = useRouteMatch();
    const { user, loadingData } = useSelector((state: AppState) => ({
        user: state.profile.user,
        loadingData: state.data.loadingData
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
                                <Route path={`${path}${ROUTES.user}${ROUTES.newUser}`} component={NewUserPage}></Route>
                                <Route path="*" render={() => <Redirect to={`${path}${ROUTES.products}${ROUTES.manageProduct}`} />} />
                            </Switch>
                        </Grid>
                    </Grid>
                </Box>
                <Modal open={loadingData}><Box sx={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress color='primary' /></Box>
                </Modal>
            </ThemeProvider>
        </>)
}
export default Pages