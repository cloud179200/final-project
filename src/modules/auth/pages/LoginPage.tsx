import { useCallback, useState } from "react"
import { Grid } from "@mui/material";
import { ILoginParams } from "../../../models/auth";
import { grey } from "@mui/material/colors";
import { fetchThunk } from "../../common/redux/thunk";
import { API_PATHS } from "../../../configs/api";
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../redux/reducer';
import { Action } from 'redux';
import { useDispatch } from "react-redux";
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_KEY } from '../../../utils/constants';
import { setUserInfo } from "../redux/authReducer";
import { replace } from "connected-react-router";
import { ROUTES } from "../../../configs/routes";
import { getErrorMessageResponse } from "../../../utils";
import LoginForm from "../components/LoginForm"

const LoginPage = () => {
    const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");
    const onLogin = useCallback(async (values: ILoginParams) => {
        setErrorMessage("");
        setLoading(true)

        const json = await dispatch(
            fetchThunk(API_PATHS.signIn, 'post', { email: values.email, password: values.password }),
        );

        setLoading(false);
        if (!json?.errors) {
            console.log(json)
            dispatch(setUserInfo(json.user));
            Cookies.set(ACCESS_TOKEN_KEY, json.user_cookie, { expires: values.rememberMe ? 7 : undefined });
            dispatch(replace(ROUTES.pages));
            return;
        }
        setErrorMessage(getErrorMessageResponse(json));
    }, [dispatch])
    return ( <Grid container
        direction="row"
        justifyContent="center"
        alignItems="center"
        height={"100vh"}
        width={1}>
        <Grid container
            direction="row"
            columns={6} width={1} justifyContent="space-evenly"
            alignItems="center" maxWidth={"600px"} sx={{ backgroundColor: grey[200], border: `2px solid ${grey["A100"]}`, boxShadow:"0 1px 3px rgb(0 0 0 / 12%), 0 1px 2px rgb(0 0 0 / 24%)" }}>
            <LoginForm loading={loading} onLogin={onLogin} errorMessage={errorMessage} />
        </Grid>
    </Grid>
    )
}
export default LoginPage