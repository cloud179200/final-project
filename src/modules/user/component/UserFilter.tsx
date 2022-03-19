import { Checkbox, Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, ListItemText, OutlinedInput, Collapse, FormLabel, RadioGroup, Radio, FormControlLabel, ListSubheader } from "@mui/material"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { IUserFilter } from "../../../models/user"
import { AppState } from "../../../redux/reducer"
import { KeyboardDoubleArrowDownRounded, KeyboardDoubleArrowUpRounded } from "@mui/icons-material"
import { DateRange, DateRangePicker, LocalizationProvider } from "@mui/lab"
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { ICountry, IState, IUserCommonRole } from "../../../models/data"
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

interface Props {
    getStates: (countryCode: string) => void;
    setFilterByPage: (filter: IUserFilter) => void;
}

const UserFilter = (props: Props) => {
    const { getStates, setFilterByPage } = props
    const { commonsRole, countries, states } = useSelector((state: AppState) => ({
        commonsRole: state.data.commonsRole,
        countries: state.data.countries,
        states: state.data.states,
    }));

    const [filter, setFilter] = useState<IUserFilter>({ search: "", memberships: [], types: [], status: "", country: "", state: "", address: "", phone: "", date_range: [null, null], date_type: "R", sort: "", order_by: "DESC", tz: 7 })
    const [openMoreFilter, setOpenMoreFilter] = useState(false)
    const [userTypes, setUserTypes] = useState<IUserCommonRole>()
    const [cloneCountries, setCloneCountries] = useState<Array<ICountry>>()
    const [cloneStates, setCloneStates] = useState<Array<IState>>()

    const membershipTypes = { memberships: [{ label: "general", value: "general" }], pendingMemberships: [{ label: "general", value: "general" }] }
    const statuses = [{ label: "Any status", value: "all" }, { label: "Enable", value: "E" }, { label: "Disable", value: "D" }, { label: "Unapproved vendor", value: "U" }]

    const handleSearchChange = (e: any) => {
        setFilter({ ...filter, search: e.target.value })
    }
    const handleTypesChange = (e: any) => {
        setFilter({ ...filter, types: [...e.target.value].filter(type => type !== "All user types") });
    };
    const handleMembershipsChange = (e: any) => {
        setFilter({ ...filter, memberships: [...e.target.value].filter(type => type !== "All memberships") });
    };
    const handleCountryChange = (e: any) => {
        setFilter({ ...filter, country: e.target.value, state: "" });
    };
    const handleStateChange = (e: any) => {
        setFilter({ ...filter, state: e.target.value });
    };
    const handleAddressChange = (e: any) => {
        setFilter({ ...filter, address: e.target.value });
    };
    const handlePhoneChange = (e: any) => {
        setFilter({ ...filter, phone: e.target.value });
    };
    const handleDateTypeChange = (e: any) => {
        setFilter({ ...filter, date_type: e.target.value })
    };
    const handleDateRangeChange = (newValue: DateRange<Date | null>) => {
        setFilter({ ...filter, date_range: newValue })
    }
    const handleSearchClick = () => {
        setFilterByPage({ ...filter })
    }

    useEffect(() => {
        if (!countries || !filter.country) {
            return
        }
        const country = [...countries].find(country => country.code === filter.country)
        if (!country) {
            return
        }
        getStates(country.code)
        // eslint-disable-next-line
    }, [filter.country])
    useEffect(() => {
        if (!commonsRole) {
            return
        }
        const newCommonsRole = { ...commonsRole }
        const newAdministratorRole = [...newCommonsRole.administrator]
        const newCustomerRole = [...newCommonsRole.customer]
        newCommonsRole.administrator = newAdministratorRole
        newCommonsRole.customer = newCustomerRole
        setUserTypes(newCommonsRole)
    }, [commonsRole])
    useEffect(() => {
        countries && setCloneCountries([...countries])
    }, [countries])
    useEffect(() => {
        states && setCloneStates([...states])
    }, [states])
    return <Box sx={{ display: "flex", justifyContent: "center", alighItems: "center", backgroundColor: "#323259" }}>
        <Grid container width={1}>
            <Box component="div" width={1} sx={{ display: "flex", justifyContent: "space-around", alignItems: "center", borderRadius: 20, flexWrap: "wrap" }}>
                <Box component="div" width={1} p={1} sx={{ borderBottom: openMoreFilter ? "1px solid #1B1B38" : "", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                    <TextField size="small" sx={{ width: "20%" }} value={filter.search} onChange={handleSearchChange} label="Search keywords" type="search" />
                    <FormControl size="small" sx={{ m: 1, width: "20%", color: "#fff" }}>
                        <InputLabel>Memberships</InputLabel>
                        <Select
                            multiple
                            value={filter.memberships.length === 0 ? ["All memberships"] : filter.memberships}
                            onChange={handleMembershipsChange}
                            input={<OutlinedInput label="Memberships" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            <ListSubheader>Memberships</ListSubheader>
                            {membershipTypes.memberships.map((type) =>
                                <MenuItem key={type.label} value={type.value}>
                                    <Checkbox checked={filter.memberships.indexOf(type.value) > -1} />
                                    <ListItemText primary={type.value} />
                                </MenuItem>)
                            }
                            <ListSubheader>Pending Memberships</ListSubheader>
                            {membershipTypes.pendingMemberships.map((type) =>
                                <MenuItem key={type.label} value={type.value}>
                                    <Checkbox checked={filter.memberships.indexOf(type.value) > -1} />
                                    <ListItemText primary={type.value} />
                                </MenuItem>)
                            }
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ m: 1, width: "20%", color: "#fff" }}>
                        <InputLabel>User types</InputLabel>
                        <Select
                            multiple
                            multiline
                            value={filter.types.length === 0 ? ["All user types"] : filter.types}
                            onChange={handleTypesChange}
                            input={<OutlinedInput label="User types" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            <ListSubheader>Administrator</ListSubheader>
                            {userTypes?.administrator.map((type) =>
                                <MenuItem key={type.name} value={type.name}>
                                    <Checkbox checked={filter.types.indexOf(type.name) > -1} />
                                    <ListItemText primary={type.name} />
                                </MenuItem>)
                            }
                            <ListSubheader>Customer</ListSubheader>
                            {userTypes?.customer.map((type) =>
                                <MenuItem key={type.name} value={type.name}>
                                    <Checkbox checked={filter.types.indexOf(type.name) > -1} />
                                    <ListItemText primary={type.name} />
                                </MenuItem>)
                            }
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{
                        m: 1, width: "20%"
                    }} >
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={filter.status ? filter.status : "all"}
                            label="Status"
                            onChange={(e) => e.target.value === "all" ? setFilter({ ...filter, status: "" }) : setFilter({ ...filter, status: e.target.value })}
                        >
                            {statuses.map((item) => <MenuItem key={item.label} value={item.value}>{item.label}</MenuItem>)}
                        </Select>
                    </FormControl >
                    <Button color="secondary" variant="contained" sx={{ width: "10%" }} onClick={handleSearchClick}>Search</Button>
                </Box>
                <Box component="div" width={1} flexGrow={1} sx={{ position: "relative" }}>
                    <Button color="primary" size="small" variant="contained" sx={{
                        position: "absolute", bottom: "0%", left: "50%", transform: "translate(-50%, 100%)", boxShadow: "none", p: 0, borderRadius: "none", "&:hover": {
                            backgroundColor: "primary.main",
                            boxShadow: "none"
                        }
                    }} onClick={() => setOpenMoreFilter(!openMoreFilter)}>{openMoreFilter ? <KeyboardDoubleArrowUpRounded /> : <KeyboardDoubleArrowDownRounded />}</Button>
                    <Collapse in={openMoreFilter} timeout="auto" unmountOnExit>
                        <Box width={1} p={1} sx={{ display: "flex" }}>
                            <Grid item xs={6} ml={1} mr={1} pr={4} pt={1.5} sx={{ display: "flex", flexDirection: "column" }}>
                                <FormControl size="small" fullWidth sx={{ m: 1, color: "#fff" }}>
                                    <InputLabel>Country</InputLabel>
                                    <Select
                                        value={filter.country}
                                        onChange={handleCountryChange}
                                        input={<OutlinedInput label="Country" />}
                                        MenuProps={MenuProps}
                                    >
                                        <MenuItem value="">None</MenuItem>
                                        {cloneCountries && cloneCountries.map((item) => <MenuItem key={item.country} value={item.code}>{item.country}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                {(cloneStates && cloneStates.length > 0 && true) ? <FormControl size="small" fullWidth sx={{ m: 1, color: "#fff" }}>
                                    <InputLabel>State</InputLabel>
                                    <Select
                                        value={filter.state}
                                        onChange={handleStateChange}
                                        input={<OutlinedInput label="State" />}
                                        MenuProps={MenuProps}

                                    >
                                        <MenuItem value="">None</MenuItem>
                                        {cloneStates && cloneStates.map((item) => <MenuItem key={item.state} value={item.state}>{item.state}</MenuItem>)}
                                    </Select>
                                </FormControl> : <TextField size="small" fullWidth sx={{ m: 1 }} value={filter.state} onChange={handleStateChange} label="State" type="state" />
                                }
                                <TextField size="small" fullWidth sx={{ m: 1 }} value={filter.address} onChange={handleAddressChange} label="Address" type="address" />
                                <TextField size="small" fullWidth sx={{ m: 1 }} value={filter.phone} onChange={handlePhoneChange} label="Phone" type="phone" />
                            </Grid>
                            <Grid item xs={6} ml={1} mr={1} pr={2} pt={1.5} sx={{ display: "flex", flexDirection: "column" }}>
                                <FormControl size="small" fullWidth sx={{ color: "#fff", paddingBottom: 1 }} >
                                    <FormLabel>User activity</FormLabel>
                                    <RadioGroup
                                        row
                                        name="user-activity"
                                        value={filter.date_type}
                                        onChange={handleDateTypeChange}
                                    >
                                        <FormControlLabel value="R" control={<Radio sx={{
                                            color: "#fff",
                                            '&.Mui-checked': {
                                                color: "#fff",
                                            },
                                        }} />} label="Register" />
                                        <FormControlLabel value="L" control={<Radio sx={{
                                            color: "#fff",
                                            '&.Mui-checked': {
                                                color: "#fff",
                                            },
                                        }} />} label="Last logged in" />
                                    </RadioGroup>
                                </FormControl>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DateRangePicker
                                        disableFuture
                                        value={filter.date_range}
                                        onChange={handleDateRangeChange}
                                        mask="____-__-__"
                                        inputFormat="yyyy-MM-dd"
                                        renderInput={(startProps, endProps) => (
                                            <>
                                                <Box width={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                    <TextField autoComplete="off" size="small" fullWidth {...startProps} />
                                                    <Box sx={{ mx: 2, color: "#fff" }}> to </Box>
                                                    <TextField autoComplete="off" size="small" fullWidth {...endProps} />
                                                    <Button sx={{ marginLeft: 2 }} variant="contained" color="secondary" onClick={(e) => setFilter({ ...filter, date_range: [null, null] })}>Clear</Button>
                                                </Box>
                                            </>
                                        )}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Box>
                    </Collapse>
                </Box>
            </Box>
        </Grid>
    </Box>
}
export default UserFilter
