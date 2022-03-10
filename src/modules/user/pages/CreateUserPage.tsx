import { ArrowBackRounded } from "@mui/icons-material";
import { Box, Grid, IconButton } from "@mui/material"
import { replace } from "connected-react-router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { ROUTES } from "../../../configs/routes";
import { ICreateUserParams, ICreateUserValidation } from "../../../models/user";
import { AppState } from "../../../redux/reducer";
import { validateCreateUser, validCreateUser } from "../utils";
import { fetchThunk } from "../../common/redux/thunk";
import { setLoadingData } from "../../common/redux/dataReducer";
import { API_PATHS } from "../../../configs/api";
import { addNotification } from "../../common/redux/notificationReducer";
import { getErrorMessageResponse } from "../../../utils";
import CreateUserForm from "../component/CreateUserForm";
interface Props {
    url: string;
}
const CreateUserPage = (props: Props) => {
    const { url } = props
    const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>()
    const [createUserFormValues, setCreateUserFormValues] = useState<ICreateUserParams>({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirm_password: "",
        membership_id: "",
        forceChangePassword: 0,
        taxExempt: 0,
        paymentRailsType: "individual",
        access_level: "10",
        roles: []
    })
    const [createUserValidate, setCreateUserValidate] = useState<ICreateUserValidation>({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirm_password: "",
        membership_id: "",
        forceChangePassword: "",
        taxExempt: "",
        paymentRailsType: "",
        access_level: "",
        roles: ""
    })
    const handleBackClick = (e: any) => dispatch(replace(`${url}${ROUTES.user}${ROUTES.manageUser}`))
    const submit = (e: any) => {
        e.preventDefault();
        const validate = validateCreateUser(createUserFormValues);

        setCreateUserValidate(validate);

        if (!validCreateUser(validate)) {
            return;
        }
        createUser(createUserFormValues)
    }
    const createUser = useCallback(async (values: ICreateUserParams) => {
        dispatch(setLoadingData(true))
        const json = await dispatch(
            fetchThunk(API_PATHS.usersCreate, 'post', { ...values }),
        );
        dispatch(setLoadingData(false))
        if (!json?.errors) {
            dispatch(addNotification({ message: "Add user success", type: "success" }))
            dispatch(replace(`${url}${ROUTES.user}${ROUTES.manageUser}`))
            return
        }
        dispatch(addNotification({ message: getErrorMessageResponse(json), type: "error" }))
    }, [dispatch, url])
    const handleSetCreateUserFormValues = useCallback((values: ICreateUserParams) => {
        setCreateUserFormValues({...values})
    }, [])
    useEffect(() => {
        const validate = validateCreateUser(createUserFormValues);
        setCreateUserValidate(validate);
    }, [createUserFormValues])
    return <Box component="form" noValidate autoComplete="off" sx={{
        overflow: "auto",
        position: "relative",
        maxHeight: "95vh",
        maxWidth: 1,
        backgroundColor: "#323259",
        boxShadow: "inset 0 5px 5px -5px rgb(0 0 0 / 75%)",
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
    }} onSubmit={submit}>
        <Grid container width={1}>
            <Box pl={4} pt={4} width={1} sx={{ backgroundColor: '#1B1B38' }}>
                <IconButton sx={{
                    padding: "0.5rem"
                }} onClick={handleBackClick}>
                    <ArrowBackRounded />
                </IconButton>
            </Box>
            <CreateUserForm createUserFormValues={createUserFormValues} createUserValidate={createUserValidate} setCreateUserFormValues={handleSetCreateUserFormValues} />
        </Grid>
    </Box>
}
export default CreateUserPage