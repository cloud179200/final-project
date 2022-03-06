import { useCallback, useEffect, useState } from "react";
import { ILoginParams, ILoginValidation } from "../../../models/auth";
import { validateLogin, validLogin } from "../utils";
import { Box, TextField, Alert, Typography } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { LoginRounded } from "@mui/icons-material";
interface Props {
    onLogin(values: ILoginParams): void;
    loading: boolean;
    errorMessage: string;
}
const LoginForm = (props: Props) => {
    const { onLogin, loading, errorMessage } = props;
    const [formValues, setFormValues] = useState<ILoginParams>({ email: "", password: "", rememberMe: false })
    const [validate, setValidate] = useState<ILoginValidation>()
    const submit = useCallback((e: any) => {
        e.preventDefault();
        const validate = validateLogin(formValues);

        setValidate(validate);

        if (!validLogin(validate)) {
            return;
        }
        onLogin(formValues)
    }, [formValues, onLogin])
    useEffect(() => {
        const validate = validateLogin(formValues);
        setValidate(validate);
    }, [formValues])
    return (
        <Box component="form" width={1} maxWidth={"600px"} p={3} autoComplete="off" sx={{ display: "flex", flexDirection: "column", '& .MuiTextField-root': { width: '100%', pb: 2 }, '& .MuiFormControl-root': { pb: 2 }, "& .MuiAlert-root": { mb: 2 } }} noValidate onSubmit={submit}>
            <Typography variant="h4" textAlign="center" pb={2}>Login</Typography>
            <TextField
                required
                label={!!validate?.email ? validate.email : "Email"}
                type="email"
                error={!!validate?.email}
                value={formValues.email}
                onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
            />
            <TextField
                required
                label={!!validate?.password ? validate.password : "Password"}
                type="password"
                autoComplete="on"
                error={!!validate?.password}
                value={formValues.password}
                onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
            />

            {/* <FormControlLabel control={<Switch checked={formValues.rememberMe} onChange={(e) => setFormValues({ ...formValues, rememberMe: !formValues.rememberMe })}/>} label={"Remember me?"} /> */}
            {errorMessage !== "" && <Alert severity="error">{errorMessage}</Alert>}
            <Box width={1} display="flex" justifyContent="space-between" alignItems="center">
                <LoadingButton fullWidth variant="outlined" size="large" type="submit" loading={loading}><LoginRounded />Login</LoadingButton>
            </Box>
        </Box>)
}
export default LoginForm