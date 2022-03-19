import { ArrowBackRounded } from "@mui/icons-material";
import { Box, Grid, IconButton } from "@mui/material"
import { replace } from "connected-react-router";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { ROUTES } from "../../../configs/routes";
import { AppState } from "../../../redux/reducer";
import { fetchThunk } from "../../common/redux/thunk";
import { API_PATHS } from "../../../configs/api";
import { addNotification } from "../../common/redux/notificationReducer";
import { getErrorMessageResponse } from "../../../utils";
import CreateProductForm from "../component/CreateProductForm";
import { ICreateProductParams } from "../../../models/product";
import { setBrands, setCategories, setConditions, setLoadingProductData, setShippings, setVendors } from "../redux/productReducer";
interface Props {
    url: string;
}
const CreateProductPage = (props: Props) => {
    const { url } = props
    const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>()


    const handleBackClick = (e: any) => dispatch(replace(`${url}${ROUTES.products}${ROUTES.manageProduct}`))
    const onUploadFile = useCallback(async (file: File, productId: string, order: string) => {
        dispatch(setLoadingProductData(true))
        const formData = new FormData()
        formData.append("productId", productId)
        formData.append("order", order)
        formData.append("images", file)
        const json = await dispatch(
            fetchThunk(API_PATHS.uploadImageFile, 'post', formData, true, "multipart/form-data"),
        );
        dispatch(setLoadingProductData(false))
        if (!json?.errors) {
            return
        }
        dispatch(addNotification({ message: getErrorMessageResponse(json), type: "error" }))
    }, [dispatch])
    const onCreateProduct = useCallback(async (values: ICreateProductParams, files: Array<File>) => {
        dispatch(setLoadingProductData(true))
        const formData = new FormData()
        formData.append("productDetail", JSON.stringify(values))
        const json = await dispatch(
            fetchThunk(API_PATHS.productsCreate, 'post', formData, true, "multipart/form-data"),
        );
        dispatch(setLoadingProductData(false))
        if (!json?.errors) {
            const productId = json.data
            await Promise.all(files.map(async (file, index) => {
                await onUploadFile(file, productId, index.toString())
            }));
            dispatch(addNotification({ message: "Add product successfully", type: "success" }))
            dispatch(replace(`${url}${ROUTES.products}${ROUTES.detailProduct}/${productId}`))
            return
        }
        dispatch(addNotification({ message: getErrorMessageResponse(json), type: "error" }))
    }, [dispatch, onUploadFile, url])
    const handleCreateProduct = (values: ICreateProductParams, files: Array<File>) => {
        onCreateProduct({ ...values }, files)
    }
    const getVendors = useCallback(async (search: string = "") => {
        dispatch(setLoadingProductData(true))
        const json = await dispatch(
            fetchThunk(API_PATHS.vendorsList, "post", { search })
        );
        dispatch(setLoadingProductData(false))

        if (!json?.errors && json.data && true) {
            if (!json.data) {
                dispatch(setVendors([]))
                return
            }
            dispatch(setVendors(json.data))
            return;
        }
    }, [dispatch])
    const getCategories = useCallback(async () => {
        dispatch(setLoadingProductData(true))
        const json = await dispatch(
            fetchThunk(API_PATHS.categoriesList, "post")
        );
        dispatch(setLoadingProductData(false))
        if (!json?.errors) {
            dispatch(setCategories(json.data))
            return;
        }
    }, [dispatch])

    const getBrands = useCallback(async () => {

        dispatch(setLoadingProductData(true))
        const json = await dispatch(
            fetchThunk(API_PATHS.brandsList, "post")
        );
        dispatch(setLoadingProductData(false))
        if (!json?.errors) {
            dispatch(setBrands(json.data))
            return;
        }
    }, [dispatch])

    const getConditions = useCallback(async () => {

        dispatch(setLoadingProductData(true))
        const json = await dispatch(
            fetchThunk(API_PATHS.conditionsList, "post")
        );
        dispatch(setLoadingProductData(false))
        if (!json?.errors) {
            dispatch(setConditions(json.data))
            return;
        }
    }, [dispatch])

    const getShippings = useCallback(async () => {
        dispatch(setLoadingProductData(true))
        const json = await dispatch(
            fetchThunk(API_PATHS.shippingsList, "post")
        );
        dispatch(setLoadingProductData(false))
        if (!json?.errors) {
            dispatch(setShippings(json.data))
            return;
        }
    }, [dispatch])
    useEffect(() => {
        getVendors()
    }, [getVendors])
    useEffect(() => {
        getCategories()
    }, [getCategories])
    useEffect(() => {
        getBrands()
    }, [getBrands])
    useEffect(() => {
        getConditions()
    }, [getConditions])
    useEffect(() => {
        getShippings()
    }, [getShippings])
    return <Box component="div" sx={{
        overflow: "auto",
        position: "relative",
        maxHeight: "95vh",
        maxWidth: 1,
        backgroundColor: "#1A1C37",
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
    }}>
        <Grid container width={1}>
            <Box pl={3.5} pt={4} width={1} sx={{ backgroundColor: '#1B1B38' }}>
                <IconButton sx={{
                    padding: "0.5rem",
                    backgroundColor: "#fff",
                    "&:hover": {
                        backgroundColor: "#fff"
                    }
                }} onClick={handleBackClick}>
                    <ArrowBackRounded sx={{ color: "black" }} />
                </IconButton>
            </Box>
            <CreateProductForm onCreateProduct={handleCreateProduct} />
        </Grid>
    </Box>
}
export default CreateProductPage