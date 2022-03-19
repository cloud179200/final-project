import { DeleteOutlineRounded } from "@mui/icons-material"
import { FormControlLabel, ListItemText, TableRow, Checkbox, Link, styled, tableCellClasses, TableCell, Button, Box } from "@mui/material"
import { replace } from "connected-react-router";
import moment from "moment";
import { memo, useRef } from "react"
import { useDispatch } from "react-redux";
import { ROUTES } from "../../../configs/routes";
import { IUserDetail } from "../../../models/user"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        padding: "0.5rem",
        borderColor: "#1B1B38",
        color: theme.palette.common.white,
        [`& > .MuiFormControlLabel-root > .MuiCheckbox-root`]: {
            color: theme.palette.common.white,
        },
        [`& > a`]: {
            color: "#0d6efd",
        },
        [`& > .MuiListItemText-root > .MuiTypography-root > a`]: {
            color: "#0d6efd",
        },
        [`&:first-of-type > :first-of-type`]: {
            borderRight: '1px dotted #fff',
        },
        [`&:last-of-type > :first-of-type`]: {
            borderLeft: '1px dotted #fff',
        },
    },

}));
interface Props {
    user: IUserDetail;
    selected: boolean;
    setSelected: (profile_id: string, selected: boolean) => void;
    url: string;
}

const UserDataTableRow = (props: Props) => {
    const { user, selected, setSelected, url } = props
    const selectedRef = useRef<any>()
    const linkToDetail = `${url}${ROUTES.user}${ROUTES.detailUser}/${user.profile_id}`
    const dispatch = useDispatch()
    const handleDeleteIconClick = (e: any) => {
        selectedRef.current && selectedRef.current.click()
    }

    return <TableRow>
        <StyledTableCell align="left">
            <FormControlLabel
                label=""
                sx={{
                    m: 0,
                }}
                control={
                    <Checkbox
                        ref={selectedRef}
                        checked={selected}
                        onChange={(e) => setSelected(user.profile_id, e.target.checked)}
                    />
                }
            />
        </StyledTableCell>
        <StyledTableCell align="left" sx={{ width: "20%" }}>
            <ListItemText primary={<Link onClick={(e) => dispatch(replace(linkToDetail))}>{user.vendor}</Link>} secondary={user.storeName} />
        </StyledTableCell>
        <StyledTableCell align="left">
            <Link onClick={(e) => dispatch(replace(linkToDetail + "?target=address"))}>{(user.fistName || "") + " " + (user.lastName || "")}</Link>
        </StyledTableCell>
        <StyledTableCell align="left">
            {user.access_level}
        </StyledTableCell>
        <StyledTableCell align="left">
            <Link href="#">{user.product}</Link>
        </StyledTableCell>
        <StyledTableCell align="left">
            {user.order.order_as_buyer_total > 0 ? <Link href="#">{user.order.order_as_buyer_total}</Link> : user.order.order_as_buyer_total}
        </StyledTableCell>
        <StyledTableCell align="left">
            <Link href="#">{user.wishlist}</Link>
        </StyledTableCell>
        <StyledTableCell align="left">
            {moment.unix(+user.created).format("MMM DD, YYYY, hh:mm A")}
        </StyledTableCell>
        <StyledTableCell align="left">
            {user.last_login === "0" ? "Never" : moment.unix(+user.last_login).format("MMM DD, YYYY, hh:mm A")}
        </StyledTableCell>
        <StyledTableCell align="center">
            <Box pl={1.5} pt={.5} pb={.5} sx={{ width: "8%" }}>
                <Button color="secondary" variant="contained" onClick={handleDeleteIconClick}>
                    <DeleteOutlineRounded /></Button>
            </Box>
        </StyledTableCell>
    </TableRow>
}
export default memo(UserDataTableRow)