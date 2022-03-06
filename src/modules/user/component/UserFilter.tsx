import { Checkbox, Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, ListItemText, OutlinedInput, Collapse, Typography, FormLabel, RadioGroup, Radio, FormControlLabel } from "@mui/material"
import {  useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { ICountry, IState, IUserCommonRole, IUserFilter } from "../../../models/user"
import { AppState } from "../../../redux/reducer"
import { KeyboardDoubleArrowDownRounded, KeyboardDoubleArrowUpRounded } from "@mui/icons-material"
import { DateRange, DateRangePicker, LocalizationProvider } from "@mui/lab"
import AdapterDateFns from '@mui/lab/AdapterDateFns';
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
const styledForField = {
    '& .MuiSelect-select': {
        color: "white",
    },
    '& label.Mui-focused': {
        color: "white",
    },
    '& .MuiInputLabel-root': {
        color: "white",
    },
    '& .MuiInput-underline:after': {
        color: "white",
        borderBottomColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
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
    },
}
const styledForSelect = {
    color: "#fff",
}

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

    const [filter, setFilter] = useState<IUserFilter>({ search: "", memberships: [], types: [], status: "", country: "", state: "", address: "", phone: "", date_range: [null, null], date_type: "R", sort: "", order_by: "ASC", tz: 7 })
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
        const country = [...countries].find(country => country.country === filter.country)
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
        <Grid container width={1} sx={{ borderBottom: "1px solid inherit" }}>
            <Box component="div" width={1} sx={{ display: "flex", justifyContent: "space-around", alignItems: "center", borderRadius: 20, flexWrap: "wrap" }}>
                <Box component="div" width={1} p={1} sx={{ borderBottom: "1px solid inherit", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                    <TextField size="small" sx={{ width: "20%", ...styledForField }} value={filter.search} onChange={handleSearchChange} label="Search keywords" type="search" />
                    <FormControl size="small" sx={{ m: 1, width: "20%", color: "#fff", ...styledForField }}>
                        <InputLabel>Memberships</InputLabel>
                        <Select
                            multiple
                            value={filter.memberships.length === 0 ? ["All memberships"] : filter.memberships}
                            onChange={handleMembershipsChange}
                            input={<OutlinedInput label="Memberships" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                            sx={{ ...styledForSelect }}
                        >
                            <Typography ml={2}>Memberships</Typography>
                            {membershipTypes.memberships.map((type) =>
                                <MenuItem key={type.label} value={type.value}>
                                    <Checkbox checked={filter.memberships.indexOf(type.value) > -1} />
                                    <ListItemText primary={type.value} />
                                </MenuItem>)
                            }
                            <Typography ml={2}>PendingMemberships</Typography>
                            {membershipTypes.pendingMemberships.map((type) =>
                                <MenuItem key={type.label} value={type.value}>
                                    <Checkbox checked={filter.memberships.indexOf(type.value) > -1} />
                                    <ListItemText primary={type.value} />
                                </MenuItem>)
                            }
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ m: 1, width: "20%", color: "#fff", ...styledForField }}>
                        <InputLabel>User types</InputLabel>
                        <Select
                            multiple
                            value={filter.types.length === 0 ? ["All user types"] : filter.types}
                            onChange={handleTypesChange}
                            input={<OutlinedInput label="User types" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            <Typography ml={2}>Administrator</Typography>
                            {userTypes?.administrator.map((type) =>
                                <MenuItem key={type.name} value={type.name}>
                                    <Checkbox checked={filter.types.indexOf(type.name) > -1} />
                                    <ListItemText primary={type.name} />
                                </MenuItem>)
                            }
                            <Typography ml={2}>Customer</Typography>
                            {userTypes?.customer.map((type) =>
                                <MenuItem key={type.name} value={type.name}>
                                    <Checkbox checked={filter.types.indexOf(type.name) > -1} />
                                    <ListItemText primary={type.name} />
                                </MenuItem>)
                            }
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{
                        m: 1, width: "20%", ...styledForField
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
                            <Grid item xs={5} ml={1} mr={1} pr={4} pt={1.5} sx={{ display: "flex", flexDirection: "column" }}>
                                <FormControl size="small" fullWidth sx={{ m: 1, color: "#fff", ...styledForField }}>
                                    <InputLabel>Country</InputLabel>
                                    <Select
                                        value={filter.country}
                                        onChange={handleCountryChange}
                                        input={<OutlinedInput label="Country" />}
                                        MenuProps={MenuProps}
                                    >
                                        {cloneCountries && cloneCountries.map((item) => <MenuItem key={item.country} value={item.country}>{item.country}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                {(cloneStates && cloneStates.length > 0 && true) ? <FormControl size="small" fullWidth sx={{ m: 1, color: "#fff", ...styledForField }}>
                                    <InputLabel>State</InputLabel>
                                    <Select
                                        value={filter.state}
                                        onChange={handleStateChange}
                                        input={<OutlinedInput label="State" />}
                                    >
                                        {cloneStates && cloneStates.map((item) => <MenuItem key={item.state} value={item.state}>{item.state}</MenuItem>)}
                                    </Select>
                                </FormControl> : <TextField size="small" fullWidth sx={{ m: 1, ...styledForField }} value={filter.state} onChange={handleStateChange} label="State" type="state" />
                                }
                                <TextField size="small" fullWidth sx={{ m: 1, ...styledForField }} value={filter.address} onChange={handleAddressChange} label="Address" type="address" />
                                <TextField size="small" fullWidth sx={{ m: 1, ...styledForField }} value={filter.phone} onChange={handlePhoneChange} label="Phone" type="phone" />
                            </Grid>
                            <Grid item xs={5} ml={1} mr={1} pr={2} pt={1.5} sx={{ display: "flex", flexDirection: "column" }}>
                                <FormControl size="small" fullWidth sx={{ color: "#fff", paddingBottom: 1 }} >
                                    <FormLabel sx={{ color: "#fff", "&.Mui-focused": { color: "#fff" } }}>User activity</FormLabel>
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
                                        disablePast
                                        value={filter.date_range}
                                        onChange={handleDateRangeChange}
                                        renderInput={(startProps, endProps) => (
                                            <>
                                                <TextField size="small" fullWidth {...startProps} sx={{ ...styledForField }} />
                                                <Box sx={{ mx: 2 }}> to </Box>
                                                <TextField size="small" fullWidth {...endProps} sx={{ ...styledForField }} />
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
