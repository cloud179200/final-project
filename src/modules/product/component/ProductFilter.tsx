import { Box, Button, Grid, TextField, Collapse, FormControl, Select, MenuItem, InputLabel, Typography, FormControlLabel, Checkbox, Autocomplete, CircularProgress } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { KeyboardDoubleArrowDownRounded, KeyboardDoubleArrowUpRounded } from "@mui/icons-material"
import { IProductFilter } from "../../../models/product"
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../redux/reducer";
import { setVendors } from "../redux/productReducer";
import { API_PATHS } from "../../../configs/api";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { fetchThunk } from "../../common/redux/thunk";

interface Props {
    setFilterByPage: (filter: IProductFilter) => void;
}

const ProductFilter = (props: Props) => {
    const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>()
    const { setFilterByPage } = props
    const { categories, vendors } = useSelector((state: AppState) => ({
        categories: state.product.categories,
        vendors: state.product.vendors,
    }));
    const [filter, setFilter] = useState<IProductFilter>({
        search: "",
        category: "0",
        stock_status: "all",
        availability: "all",
        vendor: {},
        sort: "name",
        order_by: 'ASC',
        search_type: ""
    })
    const [openMoreFilter, setOpenMoreFilter] = useState(false)
    const [loadingVendors, setLoadingVendors] = useState(false)
    const [openVendorFilterField, setOpenVendorFilterField] = useState(false)

    const handleSearchChange = (e: any) => {
        setFilter({ ...filter, search: e.target.value })
    }
    const handleSearchTypeChange = (isTypeIn: boolean, type: "name" | "sku" | "description") => {
        setFilter((prevFilter) => {
            const prevSearchType = prevFilter.search_type.split(",")
            const newSearchType = isTypeIn ? [...prevSearchType, type].filter(item => item !== "") :
                [...prevSearchType].filter(item => (item !== "") && (item !== type) && true)
            return { ...prevFilter, search_type: newSearchType.join(",") }
        })
    }
    const isSearchTypePicked = (type: "name" | "sku" | "description") => {
        return filter.search_type.split(",").indexOf(type) > -1
    }
    const handleSearchClick = () => {
        setFilterByPage({ ...filter })
    }

    const getVendors = useCallback(async (search: string = "") => {
        setLoadingVendors(true)
        const json = await dispatch(
            fetchThunk(API_PATHS.vendorsList, "post", { search })
        );
        setLoadingVendors(false)
        if (!json?.errors && json.data && true) {
            if (!json.data) {
                dispatch(setVendors([]))
                return
            }
            dispatch(setVendors(json.data))
            return;
        }
    }, [dispatch])
    useEffect(() => {
        return () => {
            dispatch(setVendors([]))
        }
        // eslint-disable-next-line
    }, [])
    return <Box sx={{ display: "flex", justifyContent: "center", alighItems: "center", backgroundColor: "#323259" }}>
        <Grid container width={1}>
            <Box component="div" width={1} sx={{ display: "flex", justifyContent: "space-around", alignItems: "center", borderRadius: 20, flexWrap: "wrap" }}>
                <Box component="div" width={1} p={1} sx={{ borderBottom: openMoreFilter ? "1px solid #1B1B38" : "", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                    <TextField size="small" autoComplete="off" sx={{ width: "45%" }} value={filter.search} onChange={handleSearchChange} label="Search keywords" type="search" />
                    <FormControl size="small" sx={{
                        m: 1, width: "20%"
                    }} >
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={filter.category}
                            label="Category"
                            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                        >
                            <MenuItem value="0">Any Category</MenuItem>
                            {categories?.map((item) => <MenuItem key={item.name} value={item.id}>{item.name}</MenuItem>)}
                        </Select>
                    </FormControl >
                    <FormControl size="small" sx={{
                        m: 1, width: "20%"
                    }} >
                        <InputLabel>Stock status</InputLabel>
                        <Select
                            value={filter.stock_status}
                            label="Stock status"
                            onChange={(e) => setFilter({ ...filter, stock_status: e.target.value })}
                        >
                            <MenuItem value="all">Any status</MenuItem>
                            <MenuItem value="in">In Stock</MenuItem>
                            <MenuItem value="low">Low stock</MenuItem>
                            <MenuItem value="out">SOLD</MenuItem>
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
                            <Grid item xs={12} ml={1} mr={1} pr={4} pt={1.5} sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Typography>Search in: </Typography>
                                <Box sx={{ display: "flex", flexDirection: "column" }}>
                                    <FormControlLabel
                                        label="Name"
                                        sx={{
                                            m: 0,
                                            p: 1
                                        }}
                                        control={
                                            <Checkbox
                                                checked={isSearchTypePicked("name")}
                                                onChange={(e) => handleSearchTypeChange(e.target.checked, "name")}
                                            />
                                        }
                                    />
                                    <FormControlLabel
                                        label="Sku"
                                        sx={{
                                            m: 0,
                                            p: 1
                                        }}
                                        control={
                                            <Checkbox
                                                checked={isSearchTypePicked("sku")}
                                                onChange={(e) => handleSearchTypeChange(e.target.checked, "sku")}
                                            />
                                        }
                                    />
                                    <FormControlLabel
                                        label="Description"
                                        sx={{
                                            m: 0,
                                            p: 1
                                        }}
                                        control={
                                            <Checkbox
                                                checked={isSearchTypePicked("description")}
                                                onChange={(e) => handleSearchTypeChange(e.target.checked, "description")}
                                            />
                                        }
                                    />
                                </Box>
                                <FormControl size="small" sx={{
                                    m: 1,
                                    width: "30%"
                                }} >
                                    <InputLabel>Availability</InputLabel>
                                    <Select
                                        value={filter.availability}
                                        label="Availability"
                                        onChange={(e) => setFilter({ ...filter, stock_status: e.target.value })}
                                    >
                                        <MenuItem value="all">Any availability status</MenuItem>
                                        <MenuItem value="1">Only enabled</MenuItem>
                                        <MenuItem value="2">Only disabled</MenuItem>
                                    </Select>
                                </FormControl >
                                <Autocomplete
                                    sx={{
                                        width: "30%"
                                    }}
                                    size="small"
                                    open={openVendorFilterField}
                                    onOpen={() => {
                                        setOpenVendorFilterField(true);
                                    }}
                                    onClose={() => {
                                        setOpenVendorFilterField(false);
                                    }}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    getOptionLabel={(option) => option.name}
                                    options={vendors ? vendors : []}
                                    loading={loadingVendors}
                                    onChange={(e, value) => {
                                        setFilter({ ...filter, vendor: value ? value.id : "" })
                                    }}
                                    renderOption={(props, option) => {
                                        return (
                                            <li {...props} key={option.id}>
                                                {option.name}
                                            </li>
                                        );
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Vendor"
                                            onChange={(e) => getVendors(e.target.value)}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loadingVendors ? <CircularProgress color="inherit" size={20} /> : params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                        </Box>
                    </Collapse>
                </Box>
            </Box>
        </Grid>
    </Box>
}
export default ProductFilter
