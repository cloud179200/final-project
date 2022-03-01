import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { GroupRounded, LocalOfferRounded } from '@mui/icons-material';
import { replace } from 'connected-react-router';
import { useDispatch } from 'react-redux';
import { ROUTES } from '../../../configs/routes';
interface Props{
    url:string;
}
const SideNavBar = (props: Props) => {
    const {url} = props
    const dispatch =  useDispatch()
    const [open, setOpen] = useState({ openCataglog: false, openUser: false });
    const handleProductsCLick = (e: any) => {
        dispatch(replace(`${url}${ROUTES.products}${ROUTES.manageProduct}`))
    }
    const handleUserListCLick = (e: any) => {
        dispatch(replace(`${url}${ROUTES.user}${ROUTES.manageUser}`))
    }
    return (
        <List
            sx={{ width: '100%', bgcolor: "primary.main", color: "primary.contrastText" }}
            component="nav"
        >
            <ListItemButton sx={{
                "& :hover > .MuiSvgIcon-root": {
                    color: "secondary.main"
                },
                "& :hover > .MuiTypography-root": {
                    color: "secondary.main"
                }
            }} onClick={() => setOpen({ ...open, openCataglog: !open.openCataglog })}>
                <ListItemIcon>
                    <LocalOfferRounded sx={{ color: "primary.contrastText" }} />
                </ListItemIcon>
                <ListItemText primary="Catalog" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open.openCataglog} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton component="span" sx={{
                        pl: 4, "& :hover": {
                            color: "secondary.main"
                        }
                    }} onClick={handleProductsCLick}>
                        <ListItemText primary="Products" />
                    </ListItemButton>
                </List>
            </Collapse>
            <ListItemButton sx={{
                "& :hover > .MuiSvgIcon-root": {
                    color: "secondary.main"
                },
                "& :hover > .MuiTypography-root": {
                    color: "secondary.main"
                }
            }} onClick={() => setOpen({ ...open, openUser: !open.openUser })}>
                <ListItemIcon>
                    <GroupRounded sx={{ color: "primary.contrastText" }} />
                </ListItemIcon>
                <ListItemText primary="Users" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open.openUser} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton component="span" sx={{
                        pl: 4, "& :hover": {
                            color: "secondary.main"
                        }
                    }} onClick={handleUserListCLick}>
                        <ListItemText primary="User list" />
                    </ListItemButton>
                </List>
            </Collapse>
        </List>
    );
}
export default SideNavBar