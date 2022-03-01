import { AppBar, Box, Grid, IconButton, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import SideNavBar from "../components/SideNavBar";
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../redux/reducer";
import { Redirect, Route, Switch, useRouteMatch } from "react-router";
import { ROUTES } from "../../../configs/routes";
import productPage from "../../product/pages/productPage";
import userPage from "../../user/pages/userPage";
import newProductPage from "../../product/pages/newProductPage";
import newUserPage from "../../user/pages/newUserPage";
import { removeUserInfo } from "../../auth/redux/authReducer";
import Cookies from "js-cookie";
import { ACCESS_TOKEN_KEY } from "../../../utils/constants";


interface Props {
}
const Pages = (props: Props) => {
    const dispatch = useDispatch()
    const { path, url } = useRouteMatch();
    const { user } = useSelector((state: AppState) => ({
        user: state.profile.user,
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
    return (<Box sx={{ height: "100vh", width: "100%", backgroundColor: "#1B1B38" }}>
        <Grid item xs={12} sx={{ boxShadow: "0 0.5rem 1rem 0 #1a1f33" }}>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: "1.75rem" }}>
                            Gear Focus Admin
                        </Typography>
                        <IconButton onClick={handleClick} color="inherit"><PersonRoundedIcon /></IconButton>
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
        <Grid container xs={12}>
            <Grid item xs={2}><SideNavBar url={url} /></Grid>
            <Grid item xs>
                <Switch>
                    <Route path={`${path}${ROUTES.products}${ROUTES.manageProduct}`} component={productPage}></Route>
                    <Route path={`${path}${ROUTES.products}${ROUTES.newProduct}`} component={newProductPage}></Route>
                    <Route path={`${path}${ROUTES.user}${ROUTES.manageUser}`} component={userPage}></Route>
                    <Route path={`${path}${ROUTES.user}${ROUTES.newUser}`} component={newUserPage}></Route>
                    <Route path="*" render={() => <Redirect to={`${path}${ROUTES.products}${ROUTES.manageProduct}`} />} />
                </Switch>
            </Grid>
        </Grid>
    </Box>)
}
export default Pages