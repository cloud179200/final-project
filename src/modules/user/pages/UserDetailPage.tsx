import { ArrowBackRounded, DeleteOutlineRounded } from "@mui/icons-material";
import { Box, Button, Container, Grid, IconButton, Modal, Tab, Tabs, Typography } from "@mui/material"
import { replace } from "connected-react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router"
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { API_PATHS } from "../../../configs/api";
import { ROUTES } from "../../../configs/routes";
import { IInfoUserDetailAddressBook, IUpdateUserParams } from "../../../models/account";
import { AppState } from "../../../redux/reducer";
import { getErrorMessageResponse } from "../../../utils";
import { setLoadingData, setInfoUserDetail, setInfoUserDetailAddressBook, setStates, setCountries } from "../../common/redux/dataReducer";
import { addNotification } from "../../common/redux/notificationReducer";
import { fetchThunk } from "../../common/redux/thunk";
import UserDetailCreateAddressForm from "../component/UserDetailCreateAddressForm";
import UserDetailUpdateAddressForm from "../component/UserDetailUpdateAddressForm";
import UserDetailUpdateForm from "../component/UserDetailUpdateForm";
import UserDetailUpdateProfileForm from "../component/UserDetailUpdateProfileForm";


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

interface Props {
    url: string;
}
interface UserDetailParams {
    id: string;
}
function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
}

const UserDetailPage = (props: Props) => {
    const { url } = props
    const target = useQuery().get("target")
    const { id } = useParams<UserDetailParams>()

    const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>()
    const { infoUserDetail, countries } = useSelector((state: AppState) => ({
        infoUserDetail: state.data.infoUserDetail,
        countries: state.data.countries
    }));
    const [tabIndex, setTabIndex] = useState(0);
    const [modal, setModal] = useState({ openDeleteAddress: false, openUpdateAddress: false, openCreateAddress: false })
    const [currentAddressBook, setCurrentAddressBook] = useState<IInfoUserDetailAddressBook>()
    const handleBackClick = (e: any) => dispatch(replace(`${url}${ROUTES.user}${ROUTES.manageUser}`))
    const handleChangeTabIndex = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const onUpdateUserDetail = useCallback(async (values: IUpdateUserParams) => {
        dispatch(setLoadingData(true))
        const json = await dispatch(
            fetchThunk(API_PATHS.usersEdit, "post", { params: [{ ...values }] })
        );
        dispatch(setLoadingData(false))
        if (!json?.errors) {
            dispatch(addNotification({ message: "Update successfully", type: "success" }))
            return;
        }
        dispatch(addNotification({ message: getErrorMessageResponse(json), type: "error" }))
    }, [dispatch])
    const getUserDetail = useCallback(async () => {
        dispatch(setLoadingData(true))
        const json = await dispatch(
            fetchThunk(API_PATHS.profileDetail, "post", { id })
        );
        dispatch(setLoadingData(false))
        if (!json?.errors) {
            dispatch(setInfoUserDetail({ ...json.data }))
            return;
        }
        dispatch(addNotification({ message: getErrorMessageResponse(json), type: "error" }))
    }, [dispatch, id])

    const getAddressBook = useCallback(async () => {
        dispatch(setLoadingData(true))
        const json = await dispatch(
            fetchThunk(API_PATHS.addressBook, "post", { id })
        );
        dispatch(setLoadingData(false))
        if (!json?.errors) {
            dispatch(setInfoUserDetailAddressBook(Object.entries(json.data).map(item => {
                // @ts-ignore
                return { id: item[0], ...item[1] }
            })))
            return;
        }
        dispatch(addNotification({ message: getErrorMessageResponse(json), type: "error" }))
    }, [dispatch, id])
    const onDeleteAddressBook = useCallback(async (profile_id: string, address_id: string) => {
        dispatch(setLoadingData(true))
        const json = await dispatch(
            fetchThunk(API_PATHS.addressBookDelete, "post", { profile_id, id: address_id })
        );
        dispatch(setLoadingData(false))
        if (!json?.errors) {
            dispatch(addNotification({ message: "Delete successfully", type: "success" }))
            setModal({ ...modal, openDeleteAddress: false })
            getAddressBook()
            return;
        }
        dispatch(addNotification({ message: getErrorMessageResponse(json), type: "error" }))
    }, [dispatch, modal, getAddressBook])
    const onCreateAddress = useCallback(async (values: IInfoUserDetailAddressBook) => {
        dispatch(setLoadingData(true))
        const json = await dispatch(
            fetchThunk(API_PATHS.addressBookEdit, "post", {
                address: values.address,
                city: values.city,
                country_code: values.country_code,
                first_name: values.first_name,
                id: null,
                last_name: values.last_name,
                phone: values.phone,
                profile_id: id,
                state: values.state,
                state_id: values.state_id,
                tax: values.tax,
                zip_code: values.zip_code
            })
        );
        dispatch(setLoadingData(false))
        if (!json?.errors) {
            dispatch(addNotification({ message: "Create successfully", type: "success" }))
            setModal({ ...modal, openCreateAddress: false })
            getAddressBook()
            return;
        }
        dispatch(addNotification({ message: getErrorMessageResponse(json), type: "error" }))
    }, [dispatch, modal, id, getAddressBook])
    const onUpdateAddress = useCallback(async (values: IInfoUserDetailAddressBook) => {
        dispatch(setLoadingData(true))
        const json = await dispatch(
            fetchThunk(API_PATHS.addressBookEdit, "post", {
                address: values.address,
                city: values.city,
                country_code: values.country_code,
                first_name: values.first_name,
                id: values.id,
                last_name: values.last_name,
                phone: values.phone,
                profile_id: id,
                state: values.state,
                state_id: values.state_id,
                tax: values.tax,
                zip_code: values.zip_code
            })
        );
        dispatch(setLoadingData(false))
        if (!json?.errors) {
            dispatch(addNotification({ message: "Update successfully", type: "success" }))
            setModal({ ...modal, openUpdateAddress: false })
            getAddressBook()
            return;
        }
        dispatch(addNotification({ message: getErrorMessageResponse(json), type: "error" }))
    }, [dispatch, modal, id, getAddressBook])
    const handleDeleteAddressConfirmClick = (e: any) => {
        if (!infoUserDetail || !infoUserDetail.addressBook || !currentAddressBook) {
            return
        }
        id && onDeleteAddressBook(id, currentAddressBook.id)
    }
    const handleOpenDeleteAddressClick = (address: IInfoUserDetailAddressBook) => {
        setModal({ ...modal, openDeleteAddress: true })
        setCurrentAddressBook({ ...address })
    }
    const handleOpenUpdateAddressClick = (address: IInfoUserDetailAddressBook) => {
        setModal({ ...modal, openUpdateAddress: true })
        setCurrentAddressBook({ ...address })
    }
    const handleOpenCreateAddressClick = (e: any) => {
        setModal({ ...modal, openCreateAddress: true })
    }





    const getCountries = useCallback(async () => {
        dispatch(setLoadingData(true))
        const json = await dispatch(
            fetchThunk(API_PATHS.commonsCountry)
        );
        dispatch(setLoadingData(false))
        if (!json?.errors) {
            dispatch(setCountries(json.data))
            return;
        }
    }, [dispatch])
    const getStates = useCallback(async (countryCode: string) => {

        dispatch(setLoadingData(true))
        const json = await dispatch(
            fetchThunk(API_PATHS.commonsState, "post", { code: countryCode })
        );
        dispatch(setLoadingData(false))
        if (!json?.errors) {
            dispatch(setStates(json.data))
            return;
        }
    }, [dispatch])
    useEffect(() => {
        getCountries()
    }, [getCountries])
    useEffect(() => {
        switch (tabIndex) {
            case 0:
                getUserDetail()
                break;
            case 1:
                getAddressBook()
                break;
            case 2:

                break;
            case 3:

                break;
            case 4:

                break;
            case 5:

                break;
            case 6:

                break;
            default:
                break;
        }
    }, [tabIndex, getUserDetail, getAddressBook])
    useEffect(() => {
        switch (target) {
            case "address":
                setTabIndex(1)
                break;
            default:

                break;
        }
        // eslint-disable-next-line
    }, [])
    return <Box component="div" sx={{
        overflow: "auto",
        maxHeight: "95vh",
        maxWidth: 1,
        "&::-webkit-scrollbar": {
            height: "10px",
            width: "10px"
        },
        "&::-webkit-scrollbar-thumb": {
            background: "#b18aff",
            borderRadius: "3px"
        },
        "&::-webkit-scrollbar-track": {
            background: "#13132b",
            borderRadius: "3px"
        }
    }} p={2}>
        <Grid container width={1}>
            <Box width={1} maxWidth="200px">
                <IconButton sx={{
                    padding: "0.5rem"
                }} onClick={handleBackClick}>
                    <ArrowBackRounded />
                </IconButton>
            </Box>
            <Grid pl={2} container width={1}>
                {infoUserDetail && <Typography variant="h4" sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>{infoUserDetail.info?.email}</Typography>}
                <Grid item xs={12} width={1} sx={{ borderBottom: 1, borderBottomColor: "#B18AFF", borderColor: 'divider' }}>
                    <Tabs value={tabIndex} onChange={handleChangeTabIndex} >
                        <Tab label="Account details"  {...a11yProps(0)} />
                        <Tab label="Address book" {...a11yProps(1)} />
                        <Tab label="My Shop Settings" {...a11yProps(2)} />
                        <Tab label="Financial Details" {...a11yProps(3)} />
                        <Tab label="Wishlist" {...a11yProps(4)} />
                        <Tab label="Saved credit cards" {...a11yProps(5)} />
                        <Tab label="Payout Information"{...a11yProps(6)} />
                    </Tabs>
                </Grid>
                <Grid item xs={12}>
                    <TabPanel value={tabIndex} index={0}>
                        {infoUserDetail &&
                            <UserDetailUpdateForm
                                onUpdateUserDetail={onUpdateUserDetail}
                                infoUserDetail={infoUserDetail} />
                        }
                    </TabPanel>
                    <TabPanel value={tabIndex} index={1}>
                        <Typography>
                            The addresses in this section are used for when the vendor shops on the marketplace or surfs the store site as a regular shopper. This information does not show on the vendor page and is never shared with buyers.
                        </Typography>
                        <Grid container width={1}>
                            {infoUserDetail?.addressBook && infoUserDetail?.addressBook.map((address) => {
                                return <Grid key={address.address} item xs={12} md={3} p={2} mr={1} ml={1} sx={{ border: "1px solid hsla(0,0%,100%,.3)", borderRadius: "10px" }}>
                                    <Grid item xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                        <Grid item xs={8}>
                                            <Grid item xs={12}>
                                                <Box>
                                                    <Grid item xs={12}><Typography>{address.first_name}</Typography></Grid>
                                                    <Grid item xs={12}><Typography>{address.last_name}</Typography></Grid>
                                                    <Grid item xs={12}><Typography>{address.address}</Typography></Grid>
                                                    <Grid item xs={12}><Typography>{address.city}</Typography></Grid>
                                                    <Grid item xs={12}><Typography>{countries ? countries.find(item => item.code === address.country_code)?.country : ""}</Typography></Grid>
                                                    <Grid item xs={12}><Typography>{address.state}</Typography></Grid>
                                                    <Grid item xs={12}><Typography>{address.zip_code}</Typography></Grid>
                                                    <Grid item xs={12}><Typography>{address.phone}</Typography></Grid>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button color="secondary" variant="contained" onClick={(e) => handleOpenUpdateAddressClick(address)}>Change</Button>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Button fullWidth color="secondary" variant="contained" onClick={(e) => handleOpenDeleteAddressClick(address)}><DeleteOutlineRounded /></Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            })}
                            <Grid item xs={12} md={3} p={2} mr={1} ml={1} minHeight="228px" sx={{ border: "1px solid hsla(0,0%,100%,.3)", borderRadius: "10px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Button color="secondary" variant="contained" onClick={handleOpenCreateAddressClick}>Add new address</Button>
                            </Grid>
                        </Grid>
                        {currentAddressBook && <Modal
                            open={modal.openDeleteAddress}
                            onClose={() => setModal({ ...modal, openDeleteAddress: false })}
                        >
                            <Container maxWidth="xs" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                    style={{
                                        borderRadius: 4,
                                        backgroundColor: "#323259",
                                        border: `1px solid #13132b`,
                                    }}>
                                    <Grid item xs={12} pb={1} p={2} sx={{ justifyContent: "flex-start", alignItems: "center", borderBottom: "1px solid #1b1b38" }}>
                                        <Typography color="#fff" variant="body1" fontSize=".9375rem" fontWeight="bold">Confirm Delete</Typography>
                                    </Grid>
                                    <Grid item xs={12} p={2} sx={{ justifyContent: "flex-start", alignItems: "center", borderBottom: "1px solid #1b1b38" }}>
                                        <Typography color="#fff" variant="body1" fontSize=".9375rem">Do you want to delete this address book?</Typography>
                                    </Grid>
                                    <Box component="span" width={1} p={2} sx={{ display: "flex", flexDirection: "column", '& .MuiTextField-root': { width: '100%', pb: 2 }, '& .MuiFormControl-root': { pb: 2 }, "& .MuiAlert-root": { mb: 2 } }}>
                                        <Box width={1} display="flex" justifyContent="space-between" alignItems="center">
                                            <Button variant="contained" color="secondary" onClick={handleDeleteAddressConfirmClick}>Yes</Button>
                                            <Button variant="contained" color="error" onClick={(e) => setModal({ ...modal, openDeleteAddress: false })}>No</Button>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Container>
                        </Modal>}
                        {currentAddressBook && <Modal
                            open={modal.openUpdateAddress}
                            onClose={() => setModal({ ...modal, openUpdateAddress: false })}
                        >
                            <>
                                <UserDetailUpdateAddressForm addressToUpdate={{ ...currentAddressBook }} onUpdateAddress={onUpdateAddress} getStates={getStates} />
                            </>
                        </Modal>}
                        <Modal
                            open={modal.openCreateAddress}
                            onClose={() => setModal({ ...modal, openCreateAddress: false })}
                        >
                            <>
                                <UserDetailCreateAddressForm onCreateAddress={onCreateAddress} getStates={getStates} />
                            </>
                        </Modal>

                    </TabPanel>
                    <TabPanel value={tabIndex} index={2}>
                        <UserDetailUpdateProfileForm />
                    </TabPanel>
                    <TabPanel value={tabIndex} index={3}>
                        {id}
                    </TabPanel>
                    <TabPanel value={tabIndex} index={4}>
                        {id}
                    </TabPanel>
                    <TabPanel value={tabIndex} index={5}>
                        {id}
                    </TabPanel>
                    <TabPanel value={tabIndex} index={6}>
                        {id}
                    </TabPanel>
                </Grid>
            </Grid>
        </Grid >
    </Box >
}
export default UserDetailPage

