import { Grid, Typography, Link, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, Button, Box } from "@mui/material";
import { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { IUpdateUserParams, IUpdateUserValidation } from "../../../models/account";
import { IInfoUserDetail } from "../../../models/user";
import { validateUpdateUser, validUpdateUser } from "../utils";


const labelColumn = 3
// const contentColumn = 3
// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//     PaperProps: {
//         style: {
//             maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//             width: 250,
//         },
//     },
// };


interface Props {
    onUpdateUserDetail: (values: IUpdateUserParams) => void;
    infoUserDetail: IInfoUserDetail;
}
const UserDetailUpdateForm = (props: Props) => {
    const [formValues, setFormValues] = useState<IUpdateUserParams>({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirm_password: "",
        membership_id: '',
        forceChangePassword: 0,
        taxExempt: 0,
        id: "",
        roles: [],
        status: "",
        statusComment: ""
    });
    const [validate, setValidate] = useState<IUpdateUserValidation>({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirm_password: "",
        membership_id: '',
        forceChangePassword: "",
        taxExempt: "",
        id: "",
        roles: "",
        status: "",
        statusComment: ""
    });
    const { onUpdateUserDetail, infoUserDetail } = props
    const handleForceChangePassword = (e: any) => {
        setFormValues({ ...formValues, forceChangePassword: e.target.checked ? 1 : 0 })
    }
    const handleTaxExemptChange = (e: any) => {
        setFormValues({ ...formValues, taxExempt: e.target.checked ? 1 : 0 })
    }
    const submit = (e: any) => {
        e.preventDefault();
        const validateValues = validateUpdateUser(formValues);
        console.log(validateValues)
        setValidate(validateValues);

        if (!validUpdateUser(validateValues)) {
            return;
        }
        onUpdateUserDetail(formValues)
    }
    useEffect(() => {
        infoUserDetail && setFormValues((prevValues) => {
            return {
                ...prevValues,
                firstName: infoUserDetail.info.firstName,
                lastName: infoUserDetail.info.lastName,
                email: infoUserDetail.info.email,
                status: infoUserDetail.info.status,
                statusComment: infoUserDetail.info.statusComment,
                membership_id: infoUserDetail.info.membership_id || "",
                forceChangePassword: +infoUserDetail.info.forceChangePassword,
                taxExempt: infoUserDetail.info.taxExempt,
                id: infoUserDetail.info.profile_id
            }
        })
    }, [infoUserDetail])
    return <Box component="form" width={1} onSubmit={submit}>
        <Grid container width={1} position="relative">
            <Grid item xs={12}>
                <Grid container width={1} p={1} spacing={3}>
                    <Grid item xs={labelColumn}><Typography align="right">Orders placed as a buyer</Typography></Grid>
                    <Grid item xs><Typography><Link>{infoUserDetail.info.order_as_buyer}</Link>
                        &nbsp;(<CurrencyFormat displayType='text' thousandSeparator decimalScale={2} prefix="$" value={infoUserDetail.info.order_as_buyer_total} />)
                    </Typography></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}><Typography align="right">Vendor Income</Typography></Grid>
                    <Grid item xs><Typography>${infoUserDetail.info.income}</Typography></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}><Typography align="right">Vendor Expense</Typography></Grid>
                    <Grid item xs><Typography >${infoUserDetail.info.expense}</Typography></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}><Typography align="right"><Link>View transaction details</Link></Typography></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}><Typography align="right">Earning balance</Typography></Grid>
                    <Grid item xs><Typography>${infoUserDetail.info.earning}</Typography></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}><Typography align="right">Products listed as vendor</Typography></Grid>
                    <Grid item xs><Typography><Link>{infoUserDetail.info.products_total}</Link></Typography></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}><Typography align="right">Joined</Typography></Grid>
                    <Grid item xs><Typography>{infoUserDetail.info.joined}</Typography></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}><Typography align="right">Last login</Typography></Grid>
                    <Grid item xs><Typography>{infoUserDetail.info.last_login}</Typography></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}><Typography align="right">Language</Typography></Grid>
                    <Grid item xs><Typography>{infoUserDetail.info.language}</Typography></Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Typography sx={{ fontSize: "1.5rem" }}>Email & password</Typography>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}></Grid>
                    <Grid item xs>
                        <TextField
                            fullWidth
                            required
                            autoComplete="off"
                            size="small"
                            label={!!validate?.firstName ? validate.firstName : "First Name"}
                            type="text"
                            error={!!validate?.firstName}
                            value={formValues.firstName}
                            onChange={(e) => setFormValues({ ...formValues, firstName: e.target.value })}
                        /></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}></Grid>
                    <Grid item xs> <TextField
                        fullWidth
                        required
                        autoComplete="off"
                        size="small"

                        label={!!validate?.lastName ? validate.lastName : "Last Name"}
                        type="text"
                        error={!!validate?.lastName}
                        value={formValues.lastName}
                        onChange={(e) => setFormValues({ ...formValues, lastName: e.target.value })}
                    /></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}></Grid>
                    <Grid item xs><TextField
                        fullWidth
                        required
                        autoComplete="off"
                        size="small"
                        label={!!validate?.email ? validate.email : "Email"}
                        type="email"
                        error={!!validate?.email}
                        value={formValues.email}
                        onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                    /></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}></Grid>
                    <Grid item xs><TextField
                        fullWidth
                        autoComplete="off"
                        size="small"
                        label={!!validate?.password ? validate.password : "Password"}
                        type="password"
                        error={!!validate?.password}
                        value={formValues.password}
                        onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
                    /></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}></Grid>
                    <Grid item xs><TextField
                        fullWidth
                        autoComplete="off"
                        size="small"
                        label={!!validate?.confirm_password ? validate.confirm_password : "Confirm Password"}
                        type="password"
                        error={!!validate?.confirm_password}
                        value={formValues.confirm_password}
                        onChange={(e) => setFormValues({ ...formValues, confirm_password: e.target.value })}
                    /></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}></Grid>
                    <Grid item xs>{/* <FormControl size="small" error={!!updateUserValidate?.paymentRailsType}>
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={updateUserFormValues.paymentRailsType}
                            label={!!updateUserValidate?.paymentRailsType ? updateUserValidate.paymentRailsType : "Type"}
                            onChange={(e) => setUpdateUserFormValues({ ...updateUserFormValues, paymentRailsType: e.target.value })}
                        >
                            <MenuItem value="individual">Individual</MenuItem>
                            <MenuItem value="business">Business</MenuItem>
                        </Select>
                    </FormControl > */}</Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}><Typography align="right">Type</Typography></Grid>
                    <Grid item xs><Typography>{infoUserDetail.info.paymentRailsType}</Typography></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={labelColumn}><Typography align="right">PaymentRails ID</Typography></Grid>
                    <Grid item xs><Typography>{infoUserDetail.info.paymentRailsId}</Typography></Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container width={1} p={2} direction="column">
                    <Typography sx={{ fontSize: "1.5rem" }}>Access Information</Typography>
                    <Grid container width={1} p={2} spacing={3}>
                        <Grid item xs={labelColumn}><Typography align="right">Access level</Typography></Grid>
                        <Grid item xs><Typography>{infoUserDetail.info.access_level === "100" ? "Admin" : infoUserDetail.info.access_level === "10" ? "Vendor" : ""}</Typography></Grid>
                    </Grid>
                    <Grid container width={1} p={2} spacing={3}>
                        <Grid item xs={labelColumn}></Grid>
                        <Grid item xs><FormControl fullWidth required size="small">
                            <InputLabel>Account status</InputLabel>
                            <Select
                                value={formValues.status}
                                label="Membership"
                                onChange={(e) => setFormValues({ ...formValues, status: e.target.value })}
                            >
                                <MenuItem value="E">Enabled</MenuItem>
                                <MenuItem value="D">Disabled</MenuItem>
                                <MenuItem value="U">Unapproved vendor</MenuItem>
                            </Select>
                        </FormControl ></Grid>
                    </Grid>
                    <Grid container width={1} p={2} spacing={3}>
                        <Grid item xs={labelColumn}></Grid>
                        <Grid item xs><TextField
                            fullWidth
                            autoComplete="off"
                            size="small"
                            label={"Status comment (reason)"}
                            type="text"
                            multiline
                            rows={4}
                            value={formValues.statusComment}
                            onChange={(e) => setFormValues({ ...formValues, statusComment: e.target.value })}
                        /></Grid>
                    </Grid>
                    <Grid container width={1} p={2} spacing={3}>
                        <Grid item xs={labelColumn}></Grid>
                        <Grid item xs><FormControl fullWidth size="small">
                            <InputLabel>Membership</InputLabel>
                            <Select
                                value={formValues.membership_id}
                                renderValue={(value) => value === "4" ? "General" : "Ignore Membership"}
                                label="Membership"
                                onChange={(e) => setFormValues({ ...formValues, membership_id: e.target.value })}
                            >
                                <MenuItem value=''>Ignore Membership</MenuItem>
                                <MenuItem value="4">General</MenuItem>
                            </Select>
                        </FormControl ></Grid>
                    </Grid>
                    <Grid container width={1}>
                        <Grid item xs={labelColumn}></Grid>
                        <Grid item xs>{/* {updateUserFormValues.access_level === "100" && <FormControl size="small">
                        <InputLabel>Roles</InputLabel>
                        <Select
                            multiple
                            multiline
                            value={updateUserFormValues.roles}
                            onChange={handleRolesChange}
                            input={<OutlinedInput label="Roles" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {infoUserDetail?.account_roles.map((type) =>
                                <MenuItem key={type.name} value={type.name}>
                                    <Checkbox checked={updateUserFormValues.roles.indexOf(type.name) > -1} />
                                    <ListItemText primary={type.name} />
                                </MenuItem>)
                            }
                        </Select>
                    </FormControl>} */}</Grid>
                    </Grid>

                    <Grid container width={1} p={2} spacing={3}>
                        <Grid item xs={labelColumn}><Typography align="right">Pending membership</Typography></Grid>
                        <Grid item xs><Typography>{infoUserDetail.info.pending_membership_id ? infoUserDetail.info.pending_membership_id : "none"}</Typography></Grid>
                    </Grid>
                    <Grid container width={1} p={2} spacing={3}>
                        <Grid item xs={labelColumn}><Typography>Require to change password on next log in</Typography></Grid>
                        <Grid item xs>
                            <Checkbox name="Require to change password on next log in" checked={formValues.forceChangePassword === 1} onChange={handleForceChangePassword} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container width={1} p={2} direction="column">
                    <Typography>Tax Information</Typography>
                    <Grid container width={1} p={2} spacing={3}>
                        <Grid item xs={labelColumn}><Typography>Tax exempt</Typography> </Grid>
                        <Grid item xs>
                            <Checkbox name="Tax exempt" checked={formValues.taxExempt === 1} onChange={handleTaxExemptChange} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} p={2} sx={{ backgroundColor: "#323259", zIndex: 1200, position: "sticky", border: "1px solid #1b1b38", borderWidth: "0 0 1px 1px", boxShadow: "0 0 13px 0 #b18aff", bottom: "-1rem" }}>
                <Button disabled={!validUpdateUser(validate)} type="submit" variant="contained" color="warning">Saves Changes</Button>
            </Grid>
        </Grid>
    </Box>

}
export default UserDetailUpdateForm