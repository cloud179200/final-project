import { Box, Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { ICreateUserParams } from "../../../models/user";
import { AppState } from "../../../redux/reducer";
import { LABEL_COLUMN } from "../../../utils/constants";
import { validationCreateUserSchema } from "../utils";
import { useFormik } from 'formik';
import SeperatedSpace from "../../common/components/SpreratedSpace";
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
    onCreateUser: (values: ICreateUserParams) => void;
}
const CreateUserForm = (props: Props) => {
    const { onCreateUser } = props
    const { commonsRole } = useSelector((state: AppState) => ({
        commonsRole: state.data.commonsRole,
    }));
    const formik = useFormik({
        initialValues: {
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            confirm_password: "",
            membership_id: "",
            forceChangePassword: false,
            taxExempt: false,
            paymentRailsType: "individual",
            access_level: "10",
            roles: []
        },
        validationSchema: validationCreateUserSchema,
        onSubmit: (values) => {
            const { email, firstName, lastName, password, confirm_password, membership_id, forceChangePassword, taxExempt, paymentRailsType, access_level, roles } = values
            const formValues: ICreateUserParams = {
                email,
                firstName,
                lastName, password, confirm_password,
                membership_id,
                forceChangePassword: forceChangePassword ? 1 : 0,
                taxExempt: taxExempt ? 1 : 0,
                paymentRailsType,
                access_level,
                roles
            }
            onCreateUser({ ...formValues })
        },
    });
    return (
        <>
            <Box width={1} component="form" onSubmit={formik.handleSubmit}>
                <Grid container width={1} position="relative">
                    <Grid pl={4} pt={2} pb={2} item xs={12}>
                        <Typography sx={{ fontSize: "1.75rem", paddingBottom: "1rem", fontWeight: "bold" }}>Create Profile</Typography>
                        <Typography sx={{ fontSize: "1.25rem" }}>Email & password</Typography>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">First Name</Typography></Grid>
                            <Grid item xs><TextField
                                fullWidth
                                required
                                autoComplete="off"
                                size="small"
                                name="firstName"
                                label={formik.errors.firstName || "First Name"}
                                type="text"
                                error={Boolean(formik.errors.firstName)}
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                            /></Grid>
                        </Grid>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Last Name</Typography></Grid>
                            <Grid item xs> <TextField
                                fullWidth
                                required
                                name="lastName"
                                autoComplete="off"
                                size="small"
                                label={formik.errors.lastName || "Last Name"}
                                type="text"
                                error={Boolean(formik.errors.lastName)}
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                            /></Grid>
                        </Grid>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Email</Typography></Grid>
                            <Grid item xs><TextField
                                fullWidth
                                required
                                autoComplete="off"
                                size="small"
                                name="email"
                                label={formik.errors.email || "email"}
                                type="email"
                                error={Boolean(formik.errors.email)}
                                value={formik.values.email}
                                onChange={formik.handleChange}
                            /></Grid>
                        </Grid>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Password</Typography></Grid>
                            <Grid item xs><TextField
                                fullWidth
                                required
                                autoComplete="off"
                                size="small"
                                name="password"
                                label={formik.errors.password || "Password"}
                                type="password"
                                error={Boolean(formik.errors.password)}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                            /></Grid>
                        </Grid>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Confirm Password</Typography></Grid>
                            <Grid item xs>  <TextField
                                fullWidth
                                required
                                autoComplete="off"
                                size="small"
                                name="confirm_password"
                                label={formik.errors.confirm_password || "Confirm Password"}
                                type="password"
                                error={Boolean(formik.errors.confirm_password)}
                                value={formik.values.confirm_password}
                                onChange={formik.handleChange}
                            /></Grid>
                        </Grid>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Type</Typography></Grid>
                            <Grid item xs>
                                <FormControl fullWidth size="small" error={Boolean(formik.errors.paymentRailsType)}>
                                    <InputLabel>{formik.errors.paymentRailsType || "Payment Rails Type"}</InputLabel>
                                    <Select
                                        id="paymentRailsType"
                                        name="paymentRailsType"
                                        label={formik.errors.paymentRailsType || "Payment Rails Type"}
                                        value={formik.values.paymentRailsType}
                                        onChange={formik.handleChange}
                                    >
                                        <MenuItem value="individual">Individual</MenuItem>
                                        <MenuItem value="business">Business</MenuItem>
                                    </Select>
                                </FormControl >
                            </Grid>
                        </Grid>
                    </Grid>
                    <SeperatedSpace />
                    <Grid pl={4} pt={2} pb={2} item xs={12}>
                        <Typography sx={{ fontSize: "1.25rem" }}>Access Information</Typography>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Access level</Typography></Grid>
                            <Grid item xs>
                                <FormControl fullWidth size="small" required>
                                    <InputLabel>Access level</InputLabel>
                                    <Select
                                        id="access_level"
                                        name="access_level"
                                        label={formik.errors.access_level || "Access level"}
                                        value={formik.values.access_level}
                                        onChange={formik.handleChange}
                                    >
                                        <MenuItem value="100">Admin</MenuItem>
                                        <MenuItem value="10">Vendor</MenuItem>
                                    </Select>
                                </FormControl >
                            </Grid>
                        </Grid>
                        {formik.values.access_level === "100" && <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Roles</Typography></Grid>
                            <Grid item xs>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Roles</InputLabel>
                                    <Select
                                        multiple
                                        multiline
                                        rows={4}
                                        id="roles"
                                        name="roles"
                                        label={formik.errors.roles || "Roles"}
                                        value={formik.values.roles}
                                        onChange={formik.handleChange}
                                        input={<OutlinedInput label="Roles" />}
                                        renderValue={(selected) => { return commonsRole ? selected.map((id) => commonsRole?.administrator.find(i => i.id === id)?.name || undefined).join(', ') : selected.join(', ') }}
                                        MenuProps={MenuProps}
                                    >
                                        {commonsRole?.administrator.map((type) =>
                                            <MenuItem key={type.name} value={type.id}>
                                                <Checkbox checked={formik.values.roles.includes(type.id as never)} />
                                                <ListItemText primary={type.name} />
                                            </MenuItem>)
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>}
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Membership</Typography></Grid>
                            <Grid item xs>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Membership</InputLabel>
                                    <Select
                                        name="membership_id"
                                        label="Membership"
                                        displayEmpty
                                        value={formik.values.membership_id}
                                        onChange={formik.handleChange}
                                    >
                                        <MenuItem value="">Ignore Membership</MenuItem>
                                        <MenuItem value="4">General</MenuItem>
                                    </Select>
                                </FormControl >
                            </Grid>
                        </Grid>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Require to change password on next log in</Typography></Grid>
                            <Grid item xs><FormControlLabel
                                control={
                                    <Checkbox name="forceChangePassword" checked={formik.values.forceChangePassword} onChange={formik.handleChange} />
                                }
                                label=""
                            /></Grid>
                        </Grid>

                    </Grid>
                    <SeperatedSpace />
                    <Grid pl={4} pt={2} pb={2} item xs={12}>
                        <Typography sx={{ fontSize: "1.25rem" }}>Tax Information</Typography>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Tax exempt</Typography></Grid>
                            <Grid item xs>  <FormControlLabel
                                control={
                                    <Checkbox name="taxExempt" checked={formik.values.taxExempt} onChange={formik.handleChange} />
                                }
                                label=""
                            /></Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} m={2} mb={4} sx={{ backgroundColor: "#323259", position: "sticky", border: "1px solid #1b1b38", borderWidth: "0 0 1px 1px", boxShadow: "0 0 13px 0 #b18aff", bottom: "0" }}>
                        <Grid p={2} item xs={12} >
                            <Button disabled={!formik.isValid} type="submit" variant="contained" color="warning">Create account</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

        </>)
}
export default CreateUserForm

