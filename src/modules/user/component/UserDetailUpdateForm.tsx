import { Grid, Typography, Link, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, Button, Box } from "@mui/material";
import moment from "moment";
import { useEffect } from "react";
import CurrencyFormat from "react-currency-format";
import { IUpdateUserParams } from "../../../models/account";
import { IInfoUserDetail } from "../../../models/user";
import { LABEL_COLUMN } from "../../../utils/constants";
import { validationUpdateUserSchema } from "../utils";
import { useFormik } from "formik"
import SeperatedSpace from "../../common/components/SpreratedSpace";

interface Props {
    onUpdateUserDetail: (values: IUpdateUserParams) => void;
    infoUserDetail: IInfoUserDetail;
}
const UserDetailUpdateForm = (props: Props) => {
    const { onUpdateUserDetail, infoUserDetail } = props
    const formik = useFormik({
        initialValues: {
            id: "",
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            confirm_password: "",
            membership_id: '',
            forceChangePassword: false,
            taxExempt: false,
            roles: [],
            status: "E",
            statusComment: ""
        },
        validationSchema: validationUpdateUserSchema,
        onSubmit: (values) => {
            const { email, firstName, lastName, password, confirm_password, membership_id, forceChangePassword, taxExempt, id, roles, status, statusComment } = values
            const formValues: IUpdateUserParams = {
                email,
                firstName,
                lastName, password, confirm_password,
                membership_id,
                forceChangePassword: forceChangePassword ? 1 : 0,
                taxExempt: taxExempt ? 1 : 0,
                id,
                roles,
                status,
                statusComment
            }
            onUpdateUserDetail({ ...formValues })
        },
    });

    useEffect(() => {
        infoUserDetail && formik.setValues({
            firstName: infoUserDetail.info.firstName || "",
            lastName: infoUserDetail.info.lastName || "",
            email: infoUserDetail.info.email || "",
            status: infoUserDetail.info.status || "",
            statusComment: infoUserDetail.info.statusComment || "",
            membership_id: infoUserDetail.info.membership_id || "-1",
            forceChangePassword: +infoUserDetail.info.forceChangePassword === 1 ? true : false,
            taxExempt: infoUserDetail.info.taxExempt === 1 ? true : false,
            id: infoUserDetail.info.profile_id || "",
            password: "",
            confirm_password: "",
            roles: infoUserDetail.info.roles as never[]
        })
        // eslint-disable-next-line
    }, [infoUserDetail])
    return <Box component="form" width={1} onSubmit={formik.handleSubmit}>
        <Grid container width={1} position="relative">
            <Grid item xs={12}>
                <Grid container width={1} p={1} spacing={3}>
                    <Grid item xs={LABEL_COLUMN}><Typography align="right">Orders placed as a buyer</Typography></Grid>
                    <Grid item xs><Typography><Link>{infoUserDetail.info.order_as_buyer}</Link>
                        &nbsp;(<CurrencyFormat displayType='text' thousandSeparator fixedDecimalScale decimalScale={2} prefix="$" value={infoUserDetail.info.order_as_buyer_total} />)
                    </Typography></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={LABEL_COLUMN}><Typography align="right">Vendor Income</Typography></Grid>
                    <Grid item xs><Typography>${infoUserDetail.info.income}</Typography></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={LABEL_COLUMN}><Typography align="right">Vendor Expense</Typography></Grid>
                    <Grid item xs><Typography >${infoUserDetail.info.expense}</Typography></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={LABEL_COLUMN}><Typography align="right"><Link>View transaction details</Link></Typography></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={LABEL_COLUMN}><Typography align="right">Earning balance</Typography></Grid>
                    <Grid item xs><Typography>${infoUserDetail.info.earning}</Typography></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={LABEL_COLUMN}><Typography align="right">Products listed as vendor</Typography></Grid>
                    <Grid item xs><Typography><Link>{infoUserDetail.info.products_total}</Link></Typography></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={LABEL_COLUMN}><Typography align="right">Joined</Typography></Grid>
                    <Grid item xs><Typography>{moment.unix(+infoUserDetail.info.joined).format("MMM DD, YYYY, hh:mm A")}</Typography></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={LABEL_COLUMN}><Typography align="right">Last login</Typography></Grid>
                    <Grid item xs><Typography> {!infoUserDetail.info.last_login ? "Never" : moment.unix(+infoUserDetail.info.last_login).format("MMM DD, YYYY, hh:mm A")}</Typography></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={LABEL_COLUMN}><Typography align="right">Language</Typography></Grid>
                    <Grid item xs><Typography>{infoUserDetail.info.language}</Typography></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={LABEL_COLUMN}><Typography align="right">Referer</Typography></Grid>
                    <Grid item xs><Typography>{infoUserDetail.info.referer}</Typography></Grid>
                </Grid>
            </Grid>
            <SeperatedSpace />
            <Grid item xs={12}>
                <Typography sx={{ fontSize: "1.5rem" }}>Email & password</Typography>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={LABEL_COLUMN}><Typography align="right">First Name</Typography></Grid>
                    <Grid item xs>
                        <TextField
                            fullWidth
                            required
                            autoComplete="off"
                            size="small"
                            type="text"
                            name="firstName"
                            label={formik.errors.firstName || "First Name"}
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
                        autoComplete="off"
                        size="small"
                        type="text"
                        name="lastName"
                        label={formik.errors.lastName || "Last Name"}
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
                        type="email"
                        name="email"
                        label={formik.errors.email || "Email"}
                        error={Boolean(formik.errors.email)}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                    /></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={LABEL_COLUMN}><Typography align="right">Password</Typography></Grid>
                    <Grid item xs><TextField
                        fullWidth
                        autoComplete="off"
                        size="small"
                        type="password"
                        name="password"
                        label={formik.errors.password || "Password"}
                        error={Boolean(formik.errors.password)}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                    /></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={LABEL_COLUMN}><Typography align="right">Confirm Password</Typography></Grid>
                    <Grid item xs><TextField
                        fullWidth
                        autoComplete="off"
                        size="small"
                        type="password"
                        name="confirm_password"
                        label={formik.errors.confirm_password || "Confirm Password"}
                        error={Boolean(formik.errors.confirm_password)}
                        value={formik.values.confirm_password}
                        onChange={formik.handleChange}
                    /></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={LABEL_COLUMN}><Typography align="right">Type</Typography></Grid>
                    <Grid item xs><Typography>{infoUserDetail.info.paymentRailsType}</Typography></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={LABEL_COLUMN}><Typography align="right">PaymentRails ID</Typography></Grid>
                    <Grid item xs><Typography>{infoUserDetail.info.paymentRailsId}</Typography></Grid>
                </Grid>
            </Grid>
            <SeperatedSpace />
            <Grid item xs={12}>
                <Typography sx={{ fontSize: "1.5rem" }}>Access Information</Typography>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={LABEL_COLUMN}><Typography align="right">Account status</Typography></Grid>
                    <Grid item xs><Typography>{infoUserDetail.info.access_level === "100" ? "Admin" : infoUserDetail.info.access_level === "10" ? "Vendor" : ""}</Typography></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={LABEL_COLUMN}><Typography align="right">Membership</Typography></Grid>
                    <Grid item xs><FormControl fullWidth required size="small" error={Boolean(formik.errors.status)}>
                        <InputLabel>{formik.errors.status || "Status"}</InputLabel>
                        <Select
                            name="status"
                            label={formik.errors.status || "Status"}
                            value={formik.values.status}
                            onChange={formik.handleChange}
                        >
                            <MenuItem value="E">Enabled</MenuItem>
                            <MenuItem value="D">Disabled</MenuItem>
                            <MenuItem value="U">Unapproved vendor</MenuItem>
                        </Select>
                    </FormControl ></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={LABEL_COLUMN}><Typography align="right">Status comment (reason)</Typography></Grid>
                    <Grid item xs><TextField
                        fullWidth
                        autoComplete="off"
                        size="small"
                        multiline
                        rows={4}
                        type="text"
                        name="statusComment"
                        label={formik.errors.statusComment || "Status comment (reason)"}
                        error={Boolean(formik.errors.statusComment)}
                        value={formik.values.statusComment}
                        onChange={formik.handleChange}
                    /></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={LABEL_COLUMN}>Membership</Grid>
                    <Grid item xs><FormControl fullWidth size="small" error={Boolean(formik.errors.membership_id)}>
                        <InputLabel>{formik.errors.membership_id || "Membership"}</InputLabel>
                        <Select
                            name="membership_id"
                            label={formik.errors.membership_id || "Membership"}
                            value={formik.values.membership_id}
                            onChange={formik.handleChange}
                        >
                            <MenuItem value='-1'>Ignore Membership</MenuItem>
                            <MenuItem value="4">General</MenuItem>
                        </Select>
                    </FormControl ></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={LABEL_COLUMN}><Typography align="right">Pending membership</Typography></Grid>
                    <Grid item xs><Typography>{infoUserDetail.info.pending_membership_id ? infoUserDetail.info.pending_membership_id : "none"}</Typography></Grid>
                </Grid>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={LABEL_COLUMN}><Typography align="right">Require to change password on next log in</Typography></Grid>
                    <Grid item xs>
                        <Checkbox name="forceChangePassword" checked={formik.values.forceChangePassword} onChange={formik.handleChange} />
                    </Grid>
                </Grid>
            </Grid>
            <SeperatedSpace />
            <Grid item xs={12}>
                <Typography sx={{ fontSize: "1.5rem" }}>Tax Information</Typography>
                <Grid container width={1} p={2} spacing={3}>
                    <Grid item xs={LABEL_COLUMN}><Typography align="right">Tax exempt</Typography> </Grid>
                    <Grid item xs>
                        <Checkbox name="taxExempt" checked={formik.values.taxExempt} onChange={formik.handleChange} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} p={2} sx={{ backgroundColor: "#323259", zIndex: 1200, position: "sticky", border: "1px solid #1b1b38", borderWidth: "0 0 1px 1px", boxShadow: "0 0 13px 0 #b18aff", bottom: "-1rem" }}>
                <Button disabled={!formik.isValid} type="submit" variant="contained" color="warning">Saves Changes</Button>
            </Grid>
        </Grid>
    </Box>

}
export default UserDetailUpdateForm

