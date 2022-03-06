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
interface Props {
    url: string;
}
const SideNavBar = (props: Props) => {
    const { url } = props
    const dispatch = useDispatch()
    const [open, setOpen] = useState({ openCataglog: false, openUser: false });
    const handleProductsCLick = (e: any) => {
        dispatch(replace(`${url}${ROUTES.products}${ROUTES.manageProduct}`))
    }
    const handleUserListCLick = (e: any) => {
        dispatch(replace(`${url}${ROUTES.user}${ROUTES.manageUser}`))
    }
    return (
        <List
            sx={{
                width: '100%', height: "100%",
                "& > .MuiListItemButton-root": {
                    borderBottom: "1px solid #1b1b38",
                    "&:hover": {
                        "& > .MuiListItemIcon-root > .MuiSvgIcon-root": {
                            color: "secondary.main"
                        },
                        "& > .MuiListItemText-root": {
                            color: "secondary.main"
                        },
                        "& >  .MuiSvgIcon-root": {
                            color: "secondary.main"
                        },
                    }
                },
                "& > .MuiCollapse-root > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > .MuiList-root > .MuiListItemButton-root": {
                    borderBottom: "1px solid #1b1b38",
                    ml: 3,
                    "&:hover": {
                        color: "secondary.main"
                    }
                }
            }}
            component="nav"
        >
            <ListItemButton sx={{

            }} onClick={() => setOpen({ ...open, openCataglog: !open.openCataglog })}>
                <ListItemIcon>
                    <LocalOfferRounded sx={{
                        fontWeight: "bold",
                        color: "#fff"
                    }} />
                </ListItemIcon>
                <ListItemText primary="Catalog" />
                {open.openCataglog ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open.openCataglog} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton component="span" onClick={handleProductsCLick}>
                        <ListItemText primary="Products" />
                    </ListItemButton>
                </List>
            </Collapse>
            <ListItemButton onClick={() => setOpen({ ...open, openUser: !open.openUser })}>
                <ListItemIcon>
                    <GroupRounded sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText primary="Users" />
                {open.openUser ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open.openUser} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton component="span" onClick={handleUserListCLick}>
                        <ListItemText primary="User list" />
                    </ListItemButton>
                </List>
            </Collapse>
        </List>
    );
}
export default SideNavBar