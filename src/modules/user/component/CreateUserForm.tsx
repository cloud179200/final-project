import { Box, Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { ICreateUserParams, ICreateUserValidation } from "../../../models/user";
import { AppState } from "../../../redux/reducer";
import { validCreateUser } from "../utils";
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
    createUserFormValues: ICreateUserParams;
    createUserValidate: ICreateUserValidation;
    setCreateUserFormValues: (values: ICreateUserParams) => void;
}
const CreateUserForm = (props: Props) => {
    const { createUserFormValues, createUserValidate, setCreateUserFormValues } = props
    const { commonsRole } = useSelector((state: AppState) => ({
        commonsRole: state.data.commonsRole,
    }));
    const handleRolesChange = (e: any) => {
        setCreateUserFormValues({ ...createUserFormValues, roles: [...e.target.value] });
    };
    const handleForceChangePassword = (e: any) => {
        setCreateUserFormValues({ ...createUserFormValues, forceChangePassword: e.target.checked ? 1 : 0 })
    }
    const handleTaxExemptChange = (e: any) => {
        setCreateUserFormValues({ ...createUserFormValues, taxExempt: e.target.checked ? 1 : 0 })
    }
    return (
        <><Grid pl={4} mb={2} container width={1} direction="column" sx={{ backgroundColor: '#1B1B38' }}>
            <Typography variant="body1" sx={{ fontSize: "1.75rem", paddingBottom: "1rem", fontWeight: "bold" }}>Create Profile</Typography>
            <Typography>Email & password</Typography>
            <Box component="div" width={1} maxWidth={"900px"} p={3} pl="20%" sx={{ display: "flex", flexDirection: "column", '& .MuiTextField-root': { width: '100%', pb: 2 }, '& .MuiFormControl-root': { pb: 2 }, "& .MuiAlert-root": { mb: 2 } }}>
                <TextField
                    required
                    autoComplete="off"
                    size="small"
                    label={!!createUserValidate?.firstName ? createUserValidate.firstName : "First Name"}
                    type="text"
                    error={!!createUserValidate?.firstName}
                    value={createUserFormValues.firstName}
                    onChange={(e) => setCreateUserFormValues({ ...createUserFormValues, firstName: e.target.value })}
                />
                <TextField
                    required
                    autoComplete="off"
                    size="small"
                    label={!!createUserValidate?.lastName ? createUserValidate.lastName : "Last Name"}
                    type="text"
                    error={!!createUserValidate?.lastName}
                    value={createUserFormValues.lastName}
                    onChange={(e) => setCreateUserFormValues({ ...createUserFormValues, lastName: e.target.value })}
                />
                <TextField
                    required
                    autoComplete="off"
                    size="small"
                    label={!!createUserValidate?.email ? createUserValidate.email : "Email"}
                    type="email"
                    error={!!createUserValidate?.email}
                    value={createUserFormValues.email}
                    onChange={(e) => setCreateUserFormValues({ ...createUserFormValues, email: e.target.value })}
                />
                <TextField
                    required
                    autoComplete="off"
                    size="small"

                    label={!!createUserValidate?.password ? createUserValidate.password : "Password"}
                    type="password"
                    error={!!createUserValidate?.password}
                    value={createUserFormValues.password}
                    onChange={(e) => setCreateUserFormValues({ ...createUserFormValues, password: e.target.value })}
                />
                <TextField
                    required
                    autoComplete="off"
                    size="small"
                    label={!!createUserValidate?.confirm_password ? createUserValidate.confirm_password : "Confirm Password"}
                    type="password"
                    error={!!createUserValidate?.confirm_password}
                    value={createUserFormValues.confirm_password}
                    onChange={(e) => setCreateUserFormValues({ ...createUserFormValues, confirm_password: e.target.value })}
                />
                <FormControl size="small" error={!!createUserValidate?.paymentRailsType}>
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={createUserFormValues.paymentRailsType}
                        label={!!createUserValidate?.paymentRailsType ? createUserValidate.paymentRailsType : "Type"}
                        onChange={(e) => setCreateUserFormValues({ ...createUserFormValues, paymentRailsType: e.target.value })}
                    >
                        <MenuItem value="individual">Individual</MenuItem>
                        <MenuItem value="business">Business</MenuItem>
                    </Select>
                </FormControl >
            </Box>
        </Grid>
            <Grid p={2} pl={4} mb={2} container width={1} direction="column" sx={{ backgroundColor: '#1B1B38' }}>
                <Typography>Access Information</Typography>
                <Box component="div" width={1} maxWidth={"900px"} p={3} pl="20%" sx={{ display: "flex", flexDirection: "column", '& .MuiTextField-root': { width: '100%', pb: 2 }, '& .MuiFormControl-root': { pb: 2 }, "& .MuiAlert-root": { mb: 2 } }}>
                    <FormControl size="small" required>
                        <InputLabel>Access level</InputLabel>
                        <Select
                            value={createUserFormValues.access_level}
                            label="Access level"
                            onChange={(e) => setCreateUserFormValues({ ...createUserFormValues, access_level: e.target.value })}
                        >
                            <MenuItem value="100">Admin</MenuItem>
                            <MenuItem value="10">Vendor</MenuItem>
                        </Select>
                    </FormControl >
                    {createUserFormValues.access_level === "100" && <FormControl size="small">
                        <InputLabel>Roles</InputLabel>
                        <Select
                            multiple
                            multiline
                            rows={4}
                            value={createUserFormValues.roles}
                            onChange={handleRolesChange}
                            input={<OutlinedInput label="Roles" />}
                            renderValue={(selected) => { return commonsRole ? selected.map((id) => commonsRole?.administrator.find(i => i.id === id)?.name || undefined).join(', ') : selected.join(', ') }}
                            MenuProps={MenuProps}
                        >
                            {commonsRole?.administrator.map((type) =>
                                <MenuItem key={type.name} value={type.id}>
                                    <Checkbox checked={createUserFormValues.roles.indexOf(type.id) > -1} />
                                    <ListItemText primary={type.name} />
                                </MenuItem>)
                            }
                        </Select>
                    </FormControl>}
                    <FormControl size="small">
                        <InputLabel>Membership</InputLabel>
                        <Select
                            value={createUserFormValues.membership_id}
                            label="Membership"
                            onChange={(e) => setCreateUserFormValues({ ...createUserFormValues, membership_id: e.target.value })}
                        >
                            <MenuItem value="null">Ignore Membership</MenuItem>
                            <MenuItem value="4">General</MenuItem>
                        </Select>
                    </FormControl >

                    <FormControlLabel
                        control={
                            <Checkbox name="Require to change password on next log in" checked={createUserFormValues.forceChangePassword === 1} onChange={handleForceChangePassword} />
                        }
                        label="Require to change password on next log in"
                    />
                </Box>
            </Grid>
            <Grid p={2} pl={4} pb={1} mb={2} container width={1} sx={{ backgroundColor: '#1B1B38' }}>
                <Grid item xs={12}>
                    <Typography>Tax Information</Typography>
                    <Box component="div" width={1} maxWidth={"900px"} p={3} pl="20%" sx={{ display: "flex", flexDirection: "column", '& .MuiTextField-root': { width: '100%', pb: 2 }, '& .MuiFormControl-root': { pb: 2 }, "& .MuiAlert-root": { mb: 2 } }}>
                        <FormControlLabel
                            control={
                                <Checkbox name="Tax exempt" checked={createUserFormValues.taxExempt === 1} onChange={handleTaxExemptChange} />
                            }
                            label="Tax exempt"
                        />
                    </Box>
                </Grid>
                <Grid ml={2} mr={2} item width={1} p={2} xs={12} sx={{ backgroundColor: "#323259", position: "sticky", border: "1px solid #1b1b38", borderWidth: "0 0 1px 1px", boxShadow: "0 0 13px 0 #b18aff", bottom: "0" }}>
                    <Button disabled={!validCreateUser(createUserValidate)} type="submit" variant="contained" color="warning">Create account</Button>
                </Grid>
            </Grid>
        </>)
}
export default CreateUserForm

