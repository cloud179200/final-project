import { Container, Grid, TextField, Typography, Button, FormControl, InputLabel, Select, OutlinedInput, MenuItem } from "@mui/material"
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../../../redux/reducer";
import { Action } from "redux";
import { useCallback, useEffect, useState } from "react";
import { setStates } from "../../common/redux/dataReducer";
import { validateCreateAddress, validCreateAddress } from "../utils";
import { IInfoUserDetailAddressBook, IInfoUserDetailAddressBookValidation } from "../../../models/account";

const labelColumn = 0
interface Props {
    getStates: (country_code: string) => void;
    onCreateAddress: (values: IInfoUserDetailAddressBook) => void;
}
const UserDetailCreateAddressForm = (props: Props) => {
    const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>()
    const { countries, states } = useSelector((state: AppState) => ({
        countries: state.data.countries,
        states: state.data.states
    }));
    const [formValues, setFormValues] = useState<IInfoUserDetailAddressBook>({
        id: "",
        address: "",
        city: "",
        country_code: "",
        first_name: "",
        is_billing: 0,
        is_shipping: 0,
        last_name: "",
        phone: "",
        state: "",
        state_code: "",
        state_id: "",
        tax: "",
        zip_code: "",
    })
    const [validate, setValidate] = useState<IInfoUserDetailAddressBookValidation>({
        id: "",
        address: "",
        city: "",
        country_code: "",
        first_name: "",
        is_billing: "",
        is_shipping: "",
        last_name: "",
        phone: "",
        state: "",
        state_code: "",
        state_id: "",
        tax: "",
        zip_code: "",
    })
    const { getStates, onCreateAddress } = props
    const handleCountryChange = (e: any) => {
        setFormValues({ ...formValues, country_code: e.target.value, state: "", state_code: "", state_id: "" })
    }
    const handleStateChange = (e: any) => {
        if (!states) {
            return
        }
        const state = [...states].find((item) => item.state_id === e.target.value)
        state && setFormValues({ ...formValues, state: state.state, state_code: state.code.toString(), state_id: state.state_id })
    }
    const handleStateInputChange = (e: any) => {
        setFormValues({ ...formValues, state: e.target.value, state_code: e.target.value, state_id: e.target.value })
    }

    const submit = useCallback((e: any) => {
        e.preventDefault();
        const validateValues = validateCreateAddress(formValues);
        console.log(validateValues);
        setValidate(validateValues);

        if (!validCreateAddress(validateValues)) {
            return;
        }
        onCreateAddress(formValues)
    }, [formValues, onCreateAddress])
    useEffect(() => {
        const validateValues = validateCreateAddress(formValues);

        setValidate(validateValues);
    }, [formValues])

    useEffect(() => {
        if (formValues.country_code) {
            getStates(formValues.country_code)
            return
        }
        dispatch(setStates([]))
    }, [formValues.country_code, dispatch, getStates])
    return <Container maxWidth="sm" component="form" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }} onSubmit={submit}>
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
                <Typography color="#fff" variant="body1" fontSize=".9375rem" fontWeight="bold">Address details</Typography>
            </Grid>
            <Grid item xs={12} sx={{
                borderBottom: "1px solid #1b1b38", maxHeight: "40vh", overflow: "auto",
                "&::-webkit-scrollbar": {
                    height: "0.3125rem",
                    width: "0.3125rem"
                },
                "&::-webkit-scrollbar-thumb": {
                    background: "#13132b",
                    borderRadius: "0.15625rem",
                    cursor: "pointer"
                },
                "&::-webkit-scrollbar-track": {
                    background: "#252547",
                }
            }}>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}></Grid>
                    <Grid item xs><TextField
                        fullWidth
                        required
                        autoComplete="off"
                        size="small"
                        label={!!validate?.first_name ? validate.first_name : "First name"}
                        error={!!validate?.first_name}
                        type="text"
                        value={formValues.first_name}
                        onChange={(e) => setFormValues({ ...formValues, first_name: e.target.value })}
                    /></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}></Grid>
                    <Grid item xs><TextField
                        fullWidth
                        required
                        autoComplete="off"
                        size="small"
                        label={!!validate?.last_name ? validate.last_name : "Last name"}
                        error={!!validate?.last_name}
                        type="text"
                        value={formValues.last_name}
                        onChange={(e) => setFormValues({ ...formValues, last_name: e.target.value })}
                    /></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}></Grid>
                    <Grid item xs><TextField
                        fullWidth
                        required
                        autoComplete="off"
                        size="small"
                        label={!!validate?.address ? validate.address : "Address"}
                        error={!!validate?.address}
                        type="text"
                        value={formValues.address}
                        onChange={(e) => setFormValues({ ...formValues, address: e.target.value })}
                    /></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}></Grid>
                    <Grid item xs><TextField
                        fullWidth
                        required
                        autoComplete="off"
                        size="small"
                        label={!!validate?.city ? validate.city : "City"}
                        error={!!validate?.city}
                        type="text"
                        value={formValues.city}
                        onChange={(e) => setFormValues({ ...formValues, city: e.target.value })}
                    /></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}></Grid>
                    <Grid item xs>
                        <FormControl size="small" required fullWidth sx={{ color: "#fff" }}>
                            <InputLabel>Country</InputLabel>
                            <Select
                                value={countries?.find((item) => item.code === formValues.country_code)?.code || ""}
                                onChange={handleCountryChange}
                                input={<OutlinedInput label="Country" />}
                            >
                                {countries && countries.map((item) => <MenuItem key={item.country} value={item.code}>{item.country}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                {formValues.country_code && <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}></Grid>
                    <Grid item xs>
                        {(states && states.length > 0 && true) ? <FormControl required size="small" fullWidth sx={{ color: "#fff" }}>
                            <InputLabel>State</InputLabel>
                            <Select
                                value={formValues.state_id}
                                onChange={handleStateChange}
                                input={<OutlinedInput label="State" />}
                            >
                                {states.map((item) => <MenuItem key={item.state} value={item.state_id}>{item.state}</MenuItem>)}
                            </Select>
                        </FormControl> : <TextField required size="small" fullWidth value={formValues.state} onChange={handleStateInputChange} label="State" type="state" />
                        }
                    </Grid>
                </Grid>}
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}></Grid>
                    <Grid item xs><TextField
                        fullWidth
                        required
                        autoComplete="off"
                        size="small"
                        label={!!validate?.zip_code ? validate.zip_code : "Zip code"}
                        error={!!validate?.zip_code}
                        type="text"
                        value={formValues.zip_code}
                        onChange={(e) => setFormValues({ ...formValues, zip_code: e.target.value })}
                    /></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}></Grid>
                    <Grid item xs><TextField
                        fullWidth
                        required
                        autoComplete="off"
                        size="small"
                        label={!!validate?.phone ? validate.phone : "Phone"}
                        error={!!validate?.phone}
                        type="text"
                        value={formValues.phone}
                        onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
                    /></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}></Grid>
                    <Grid item xs><TextField
                        fullWidth
                        autoComplete="off"
                        size="small"
                        label={"Tax number"}
                        error={!!validate?.tax}
                        type="text"
                        value={formValues.tax}
                        onChange={(e) => setFormValues({ ...formValues, tax: e.target.value })}
                    /></Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} p={2} sx={{ justifyContent: "flex-start", alignItems: "center", borderBottom: "1px solid #1b1b38" }}>
                <Button disabled={!validCreateAddress(validate)} color="secondary" variant="contained" type="submit">Add AddressBook</Button>
            </Grid>
        </Grid>
    </Container>
}
export default UserDetailCreateAddressForm