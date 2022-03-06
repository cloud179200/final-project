import { KeyboardArrowLeft, KeyboardArrowRight, FirstPageRounded, LastPageRounded, ArrowDownwardRounded, ArrowUpwardRounded } from "@mui/icons-material";
import { TableContainer, useTheme, Box, IconButton, Paper, Table, TableBody, TableRow, TableCell, TablePagination, TableFooter, TableHead, FormControlLabel, Checkbox, styled, tableCellClasses } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { IUserDetail, IUserDetails } from "../../../models/user";
import { AppState } from "../../../redux/reducer";
import { setPageInfo } from "../../common/redux/dataReducer";
import UserDataTableRow from "./UserDataTableRow";


interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageRounded /> : <FirstPageRounded />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageRounded /> : <LastPageRounded />}
            </IconButton>
        </Box>
    );
}
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        padding: "0.3rem",
        borderColor: "#1B1B38",
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.head} > .MuiFormControlLabel-root > .MuiCheckbox-root`]: {
        color: theme.palette.common.white,
    },
}));
interface Props {
    users?: IUserDetails;
    selectedUsers: Array<IUserDetail>;
    setSelectedUsers: (selected: Array<IUserDetail>) => void;
    setFilterByPage: (sort: string, order_by: "ASC" | "DESC") => void;
}

const UserDataTable = (props: Props) => {
    const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>()

    const { users, selectedUsers, setSelectedUsers, setFilterByPage } = props
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [sortBy, setSortBy] = useState<{ sort: string, order_by: "ASC" | "DESC" }>({ sort: "", order_by: "ASC" })
    // Avoid a layout jump when reaching the last page with empty rows.
    // const emptyRows =
    //     page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (users ? users.detail.length : 0)) : 0;
    const handleChangePage = useCallback((
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    }, [])
    const handleChangeRowsPerPage = useCallback((
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);
    const handleCheckSelectedAll = (e: any) => {
        if (!users || rowsPerPage < 1) {
            return
        }
        if (!e.target.checked) {
            setSelectedUsers([])
            return
        }
        const currentUsersInPage = [...users.detail].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        setSelectedUsers(currentUsersInPage)
    }
    const handleCheckSelectedOne = useCallback((profile_id: string, selected: boolean) => {
        if (!users) {
            return
        }
        if (!selected) {
            const newSelectedUsers = [...selectedUsers].filter(detail => detail.profile_id !== profile_id)
            setSelectedUsers(newSelectedUsers)
            return
        }
        const userDetail = [...users.detail].find(detail => detail.profile_id === profile_id)
        if (!userDetail) {
            return
        }
        const newSelectedUsers = [...selectedUsers].filter(detail => detail.profile_id !== profile_id)
        newSelectedUsers.push({ ...userDetail })
        setSelectedUsers(newSelectedUsers)
    }, [selectedUsers, setSelectedUsers, users])
    const isSelectedAll = () => {
        if (!users || users.detail.length < 1) {
            return false
        }
        const currentUsersInPage = [...users.detail].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        currentUsersInPage.sort((a, b) => a.profile_id > b.profile_id ? 1 : a.profile_id < b.profile_id ? -1 : 0)
        const currentSelectedUsers = [...selectedUsers]
        currentSelectedUsers.sort((a, b) => a.profile_id > b.profile_id ? 1 : a.profile_id < b.profile_id ? -1 : 0)
        return JSON.stringify(currentUsersInPage) === JSON.stringify(currentSelectedUsers)
    }
    const isSelected = useCallback((profile_id: string) => {
        const currentSelectedUsers = [...selectedUsers]
        const indexDetail = currentSelectedUsers.findIndex(detail => detail.profile_id === profile_id)
        return indexDetail > -1
    }, [selectedUsers])
    const getSortIcon = useCallback((column: string) => {
        let icon = <></>
        if (sortBy.sort === column) {
            icon = sortBy.order_by === "ASC" ? <ArrowDownwardRounded /> : <ArrowUpwardRounded />
        }
        return icon
    }, [sortBy])
    const handleSwitchSortBy = useCallback((column: string) => {
        setSortBy({ sort: column, order_by: sortBy.order_by === "ASC" ? "DESC" : "ASC" })
    }, [sortBy])
    useEffect(() => {
        if (!sortBy.sort) {
            return
        }
        console.log(sortBy)
        setFilterByPage(sortBy.sort, sortBy.order_by)
    }, [sortBy, setFilterByPage])
    useEffect(() => {
        dispatch(setPageInfo({index: page, count: rowsPerPage}))
    }, [dispatch, page, rowsPerPage])
    return (
        <TableContainer component={Paper} sx={{
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
        }}>
            <Table sx={{
                width: 1, backgroundColor: "#323259",
            }}>
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center"><FormControlLabel
                            label=""
                            sx={{ m: 0 }}
                            control={
                                <Checkbox
                                    value=""
                                    checked={isSelectedAll()}
                                    onChange={handleCheckSelectedAll}
                                />
                            }
                        /></StyledTableCell>
                        <StyledTableCell align="left" sx={{ cursor: "pointer" }} onClick={(e) => handleSwitchSortBy("vendor")}>Login/Email&nbsp;{getSortIcon("vendor")}</StyledTableCell>
                        <StyledTableCell align="left" sx={{ cursor: "pointer" }} onClick={(e) => handleSwitchSortBy("fistname")}>Name&nbsp;{getSortIcon("fistname")}</StyledTableCell>
                        <StyledTableCell align="left" sx={{ cursor: "pointer" }} onClick={(e) => handleSwitchSortBy("access_level")}>Access level&nbsp;{getSortIcon("access_level")}</StyledTableCell>
                        <StyledTableCell align="left">Products</StyledTableCell>
                        <StyledTableCell align="left">Orders</StyledTableCell>
                        <StyledTableCell align="left">Wishlist</StyledTableCell>
                        <StyledTableCell align="left" sx={{ cursor: "pointer" }} onClick={(e) => handleSwitchSortBy("created")}>Created&nbsp;{getSortIcon("created")}</StyledTableCell>
                        <StyledTableCell align="left" sx={{ cursor: "pointer" }} onClick={(e) => handleSwitchSortBy("last_login")}>Last Login&nbsp;{getSortIcon("last_login")}</StyledTableCell>
                        <StyledTableCell align="left"></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users && (rowsPerPage > 0
                        ? users.detail.slice(0, rowsPerPage)
                        : users.detail
                    ).map((user) => (
                        <UserDataTableRow key={user.profile_id} user={user} selected={isSelected(user.profile_id)} setSelected={handleCheckSelectedOne} />
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[25, 50, 75, 100, { label: 'All', value: -1 }]}
                            colSpan={10}
                            count={users ? +users.recordsFiltered : 0}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: {
                                    'aria-label': 'rows per page',
                                },
                                native: true,
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}
export default UserDataTable