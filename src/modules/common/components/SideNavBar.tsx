import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';
import { GroupRounded, LocalOfferRounded } from '@mui/icons-material';
import { replace } from 'connected-react-router';
import { useDispatch } from 'react-redux';
import { ROUTES } from '../../../configs/routes';
interface Props {
    url: string;
    open: boolean;
    setOpen: (open: boolean) => void
}
const SideNavBar = (props: Props) => {
    const { url, open, setOpen } = props
    const dispatch = useDispatch()
    const [openMenu, setOpenMenu] = useState({ openCataglog: false, openUser: false });
    const handleProductsCLick = (e: any) => {
        dispatch(replace(`${url}${ROUTES.products}${ROUTES.manageProduct}`))
    }
    const handleUserListCLick = (e: any) => {
        dispatch(replace(`${url}${ROUTES.user}${ROUTES.manageUser}`))
    }
    const handleCataglogClick = (e: any) => {
        !open && setOpen(true)
        setOpenMenu({ ...openMenu, openCataglog: !openMenu.openCataglog })
    }
    const handleUserClick = (e: any) => {
        !open && setOpen(true)
        setOpenMenu({ ...openMenu, openUser: !openMenu.openUser })
    }
    useEffect(() => {
        if (!open) {
            setOpenMenu({ openCataglog: false, openUser: false })
        }
    }, [open])
    return (
        <List
            sx={{
                height: "100%",
                width:"fit-content",
                backgroundColor: "#323259",
                "& > .MuiListItemButton-root": {
                    borderBottom: "1px solid #1b1b38",
                    "&:hover": {
                        "& > .MuiListItemIcon-root > .MuiSvgIcon-root": {
                            color: "secondary.main"
                        },
                        "& > .MuiListItemText-root": {
                            color: "secondary.main"
                        },
                        "& > .MuiSvgIcon-root": {
                            color: "secondary.main"
                        },
                    }
                },
                "& > .MuiCollapse-root > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > .MuiList-root > .MuiListItemButton-root": {
                    borderBottom: "1px solid #1b1b38",
                    ml: 2,
                    "&:hover": {
                        color: "secondary.main"
                    }
                }
            }}
            component="nav"
        >
            <ListItemButton onClick={handleCataglogClick}>
                {open ?
                    <>
                        <ListItemIcon sx={{ textAlign: "center" }}>
                            <LocalOfferRounded sx={{ color: "#fff" }} />
                        </ListItemIcon>
                        <ListItemText primary="Catalog" />
                        {openMenu.openCataglog ? <ExpandLess /> : <ExpandMore />}
                    </> : <LocalOfferRounded sx={{ color: "#fff" }} />
                }
            </ListItemButton>
            {open && <Collapse in={openMenu.openCataglog} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton component="span" onClick={handleProductsCLick}>
                        <ListItemText primary="Products" />
                    </ListItemButton>
                </List>
            </Collapse>}
            <ListItemButton onClick={handleUserClick}>
                {open ?
                    <>
                        <ListItemIcon>
                            <GroupRounded sx={{ color: "#fff" }} />
                        </ListItemIcon>
                        <ListItemText primary="Users" />
                        {openMenu.openUser ? <ExpandLess /> : <ExpandMore />}
                    </> : <GroupRounded sx={{ color: "#fff" }} />
                }
            </ListItemButton>
            {open && <Collapse in={openMenu.openUser} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton component="span" onClick={handleUserListCLick}>
                        <ListItemText primary="User list" />
                    </ListItemButton>
                </List>
            </Collapse>}

        </List>
    );
}
export default SideNavBar