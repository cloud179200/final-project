import { Autocomplete, Box, Grid, TextField, Typography, CardMedia, Badge, IconButton, Switch, Select, OutlinedInput, MenuItem, Checkbox, ListItemText, FormControlLabel, FormControl, InputLabel, Button, InputAdornment } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useSelector } from "react-redux";
import { ICategory, ICreateProductParams, ICreateProductValidation } from "../../../models/product";
import { AppState } from "../../../redux/reducer";
import { fileToBase64String } from "../../../utils";
import { validateCreateProduct, validCreateProduct } from "../utils";
import defaultImage from "../../../utils/defaultImage.png";
import { RemoveCircleRounded } from "@mui/icons-material";
import { Editor } from "@tinymce/tinymce-react";
import CurrencyFormat, { Values } from "react-currency-format";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import moment from "moment";
import { LABEL_COLUMN } from "../../../utils/constants";
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
const fileTypes = ["JPG", "PNG", "GIF", "JPEG"];
interface IFileImage {
    file: File;
    base64Src: string;
}
const renderCustomInput = (props: any) => {
    const { label, required, fullWidth } = props;
    return (
        <FormControl size="small" required={required} fullWidth={fullWidth}>
            <InputLabel>{label}</InputLabel>
            <OutlinedInput {...props} />
        </FormControl>
    );
};
interface Props {
    onCreateProduct: (values: ICreateProductParams, arrayFile: Array<File>) => void;
}
const CreateProductForm = (props: Props) => {
    const { onCreateProduct } = props
    const { vendors, categories, conditions, brands, shippings } = useSelector((state: AppState) => ({
        vendors: state.product.vendors,
        categories: state.product.categories,
        conditions: state.product.conditions,
        brands: state.product.brands,
        shippings: state.product.shippings,
    }));
    const membershipTypes = { memberships: [{ label: "general", value: "general" }], pendingMemberships: [{ label: "general", value: "general" }] }
    const [files, setFiles] = useState<Array<IFileImage>>([]);
    const [openAddShippingZonesField, setOpenAddShippingZonesField] = useState(false)
    const addFile = useCallback(async (file: File) => {
        const base64String = await fileToBase64String(file)
        const fileAlreadyIn = [...files].find((item) => item.base64Src === base64String)
        if (fileAlreadyIn) {
            return
        }
        setFiles((prevFiles) => {
            const newFiles = [...prevFiles].filter((item) => item.base64Src !== base64String)
            newFiles.push({ file, base64Src: base64String })
            return newFiles
        })
    }, [files])
    const removeFile = useCallback((base64Src: string) => {
        setFiles((prevFiles) => {
            const newFiles = [...prevFiles].filter((item) => item.base64Src !== base64Src)
            return newFiles
        })
    }, [])
    const handleAddFiles = (multipleFile: FileList) => {
        Array.from(multipleFile).map((file) => addFile(file))
    }
    const [createProductFormValues, setCreateProductFormValues] = useState<ICreateProductParams>(
        {
            vendor_id: "",
            name: "",
            brand_id: "",
            condition_id: "",
            categories: [],
            description: "",
            enabled: 1,
            memberships: [],
            shipping_to_zones: [{ id: 1, price: "0.00" }],
            tax_exempt: 0,
            price: "0.00",
            sale_price_type: "$",
            arrival_date: moment(new Date()).format("yyyy-MM-DD"),
            inventory_tracking: 0,
            quantity: "0.00",
            sku: "",
            participate_sale: "0",
            sale_price: "0",
            og_tags_type: "0",
            og_tags: "",
            meta_desc_type: "A",
            meta_description: "",
            meta_keywords: "",
            product_page_title: "",
            facebook_marketing_enabled: 0,
            google_feed_enabled: 0,
            imagesOrder: [],
            deleted_images: []
        }
    )
    const [createProductValidate, setCreateProductValidate] = useState<ICreateProductValidation>(
        {
            vendor_id: "",
            name: "",
            brand_id: "",
            condition_id: "",
            categories: "",
            description: "",
            enabled: "",
            memberships: "",
            shipping_to_zones: "",
            tax_exempt: "",
            price: "",
            sale_price_type: "",
            arrival_date: "",
            inventory_tracking: "",
            quantity: "",
            sku: "",
            participate_sale: "",
            sale_price: "",
            og_tags_type: "",
            og_tags: "",
            meta_desc_type: "",
            meta_description: "",
            meta_keywords: "",
            product_page_title: "",
            facebook_marketing_enabled: "",
            google_feed_enabled: "",
            imagesOrder: "",
            deleted_images: ""
        }
    )
    const [openField, setOpenField] = useState({ vendor: false, brand: false, condition: false, category: false, sale: false })

    const handleVendorChange = (e: any, value: any) => {
        setCreateProductFormValues({ ...createProductFormValues, vendor_id: value ? value.id : "" })
    }

    const handleNameChange = (e: any) => setCreateProductFormValues({ ...createProductFormValues, name: e.target.value })

    const handleBrandChange = (e: any, value: any) => {
        setCreateProductFormValues({ ...createProductFormValues, brand_id: value ? value.id : "" })
    }

    const handleConditionChange = (e: any, value: any) => {
        setCreateProductFormValues({ ...createProductFormValues, condition_id: value ? value.id : "" })
    }

    const handleSKUChange = (e: any) => setCreateProductFormValues({ ...createProductFormValues, sku: e.target.value })

    const handleCategoriesChange = (e: any, value: Array<ICategory>) => {
        setCreateProductFormValues({ ...createProductFormValues, categories: [...value].map((item) => +item.id) })
    }

    const handleEnabledChange = (e: any) => {
        setCreateProductFormValues({ ...createProductFormValues, enabled: e.target.checked ? 1 : 0 })
    }

    const handleMembershipsChange = (e: any) => {
        setCreateProductFormValues({ ...createProductFormValues, memberships: [...e.target.value].filter(item => item !== "").map(item => +item) });
    }

    const handleTaxExemptChange = (e: any) => {
        setCreateProductFormValues({ ...createProductFormValues, tax_exempt: e.target.checked ? 1 : 0 })
    }

    const handlePriceChange = (values: Values) => {
        const { value } = values;
        setCreateProductFormValues({ ...createProductFormValues, price: value });
    }

    const handleSaleChange = (e: any) => {
        if (e.target.checked) {
            setOpenField({ ...openField, sale: true })
            return
        }
        setCreateProductFormValues({ ...createProductFormValues, sale_price: "0", sale_price_type: "$" })
        setOpenField({ ...openField, sale: false })
    }

    const handleSalePriceTypeChange = (e: any) => {
        setCreateProductFormValues({ ...createProductFormValues, sale_price_type: e.target.value })
    }

    const handleSalePriceChange = (e: any) => {
        setCreateProductFormValues({ ...createProductFormValues, sale_price: e.target.value })
    }

    const handleChangeArrivalDate = (value: Date | null) => {
        value && setCreateProductFormValues({ ...createProductFormValues, arrival_date: moment(value).format("yyyy-MM-DD"), })
    }

    const handleQuantityChange = (values: Values) => {
        const { value } = values;
        setCreateProductFormValues({ ...createProductFormValues, quantity: value });
    }

    const handleChangeShippingZone = (id: number, price: string) => {
        const indexShippingZone = [...createProductFormValues.shipping_to_zones].findIndex((item) => item.id === id)
        if (indexShippingZone === -1) {
            return
        }
        const newShippingZones = [...createProductFormValues.shipping_to_zones]
        newShippingZones[indexShippingZone] = { id, price: price ? price : "0.00" }
        setCreateProductFormValues({ ...createProductFormValues, shipping_to_zones: newShippingZones })
    }

    const handleAddShippingZone = (id?: number) => {
        if (!id) {
            return
        }
        const isShippingZoneIn = [...createProductFormValues.shipping_to_zones].find(item => item.id === id)
        if (isShippingZoneIn) {
            return
        }
        setCreateProductFormValues({ ...createProductFormValues, shipping_to_zones: [...createProductFormValues.shipping_to_zones, { id, price: "0.00" }] })
    }

    const handleRemoveShippingZone = (id: number) => {
        if (id === 1) {
            return
        }
        const newShippingZones = [...createProductFormValues.shipping_to_zones].filter((item) => item.id !== id)
        setCreateProductFormValues({ ...createProductFormValues, shipping_to_zones: newShippingZones })
    }

    const getShippingZonesValue = () => {
        if (!shippings) {
            return []
        }
        const value = [...shippings].filter((item) => [...createProductFormValues.shipping_to_zones].some(i => i.id === +item.id) && item.id !== null && true)
        return value
    }

    const handleOgTagsTypeChange = (e: any) => setCreateProductFormValues({ ...createProductFormValues, og_tags_type: e.target.value, og_tags: e.target.value === "0" ? "" : createProductFormValues.og_tags })
    
    const handleMetaDescTypeChange = (e: any) => setCreateProductFormValues({ ...createProductFormValues, meta_desc_type: e.target.value, meta_description: e.target.value === "0" ? "" : createProductFormValues.og_tags })
    
    const handleOgTagsChange = (e: any) => {
        setCreateProductFormValues({ ...createProductFormValues, og_tags: e.target.value })
    }
    
    const handleMetaDescriptionChange = (e: any) => {
        setCreateProductFormValues({ ...createProductFormValues, og_tags: e.target.value })
    }
    
    const handleMetaKeywordsChange = (e: any) => {
        setCreateProductFormValues({ ...createProductFormValues, og_tags: e.target.value })
    }
    
    const handleProductPageTitleChange = (e: any) => {
        setCreateProductFormValues({ ...createProductFormValues, product_page_title: e.target.value })
    }
    
    const handleFacebookMarketingEnabledChange = (e: any) => {
        setCreateProductFormValues({ ...createProductFormValues, facebook_marketing_enabled: e.target.checked ? 1 : 0 })
    }
    
    const handleGoogleMarketingEnabledChange = (e: any) => {
        setCreateProductFormValues({ ...createProductFormValues, google_feed_enabled: e.target.checked ? 1 : 0 })
    }
    
    const submit = (e: any) => {
        e.preventDefault();
        const validate = validateCreateProduct(createProductFormValues, vendors || [], categories || [], conditions || [], brands || [], shippings || []);

        setCreateProductValidate(validate);

        if (!validCreateProduct(validate)) {
            return;
        }
        onCreateProduct(createProductFormValues, files.map((item) => item.file))
    }
    
    useEffect(() => {
        setCreateProductFormValues({ ...createProductFormValues, imagesOrder: [...files].map((file) => file.file.name) })
        // eslint-disable-next-line
    }, [files])
    useEffect(() => {
        const validate = validateCreateProduct(createProductFormValues, vendors || [], categories || [], conditions || [], brands || [], shippings || []);
        console.log(validate)
        setCreateProductValidate(validate);
        // eslint-disable-next-line
    }, [createProductFormValues])
    console.log(createProductFormValues)
    return (
        <>
            <Box component="form" width={1} onSubmit={submit}>
                <Grid container width={1} position="relative">
                    <Grid pl={4} pt={2} pb={2} item xs={12}>
                        <Typography sx={{ fontSize: "1.75rem", paddingBottom: "1rem", fontWeight: "bold" }}>Add Product</Typography>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Vendor</Typography></Grid>
                            <Grid item xs>
                                <Autocomplete
                                    size="small"
                                    open={openField.vendor}
                                    onOpen={() => {
                                        setOpenField({ ...openField, vendor: true });
                                    }}
                                    onClose={() => {
                                        setOpenField({ ...openField, vendor: false });
                                    }}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    getOptionLabel={(option) => option.login ? option.login : option.name}
                                    options={vendors ? vendors : []}
                                    onChange={handleVendorChange}
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
                                            required
                                            label={!!createProductValidate?.vendor_id ? createProductValidate.vendor_id : "Vendor"}
                                            error={!!createProductValidate?.vendor_id}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Product Title</Typography></Grid>
                            <Grid item xs>
                                <TextField
                                    fullWidth
                                    required
                                    autoComplete="off"
                                    size="small"
                                    label={!!createProductValidate?.name ? createProductValidate.name : "Product Title"}
                                    type="text"
                                    error={!!createProductValidate?.name}
                                    onBlur={handleNameChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Brand</Typography></Grid>
                            <Grid item xs>
                                <Autocomplete
                                    size="small"
                                    open={openField.brand}
                                    onOpen={() => {
                                        setOpenField({ ...openField, brand: true });
                                    }}
                                    onClose={() => {
                                        setOpenField({ ...openField, brand: false });
                                    }}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    getOptionLabel={(option) => option.name}
                                    options={brands ? brands : []}
                                    onChange={handleBrandChange}
                                    renderOption={(props, option) => {
                                        return (
                                            <li {...props} key={option.id + option.name}>
                                                {option.name}
                                            </li>
                                        );
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            required
                                            label={!!createProductValidate?.brand_id ? createProductValidate.brand_id : "Brand"}
                                            error={!!createProductValidate?.brand_id}
                                            placeholder="Type Brand name to select"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Condition</Typography></Grid>
                            <Grid item xs>
                                <Autocomplete
                                    size="small"
                                    open={openField.condition}
                                    onOpen={() => {
                                        setOpenField({ ...openField, condition: true });
                                    }}
                                    onClose={() => {
                                        setOpenField({ ...openField, condition: false });
                                    }}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    getOptionLabel={(option) => option.name}
                                    options={conditions ? conditions : []}
                                    onChange={handleConditionChange}
                                    renderOption={(props, option) => {
                                        return (
                                            <li {...props} key={option.id + option.name}>
                                                {option.name}
                                            </li>
                                        );
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            required
                                            label={!!createProductValidate?.condition_id ? createProductValidate.condition_id : "Condition"}
                                            error={!!createProductValidate?.condition_id}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">SKU</Typography></Grid>
                            <Grid item xs>
                                <TextField
                                    fullWidth
                                    autoComplete="off"
                                    size="small"
                                    label="SKU"
                                    type="text"
                                    onBlur={handleSKUChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Images</Typography></Grid>
                            <Grid item xs>
                                <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", width: 1, flexWrap: "wrap" }}>
                                    {files.map((item) => {
                                        return <Badge
                                            key={item.base64Src}
                                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                            sx={{mr:2}}
                                            badgeContent={
                                                <IconButton color="error" onClick={(e) => removeFile(item.base64Src)}><RemoveCircleRounded /></IconButton>
                                            }
                                        >
                                            <CardMedia
                                                component="img"
                                                sx={{  width: 100, height: 100, marginBottom: "1rem", cursor: "pointer" }}
                                                src={item.base64Src}
                                            />
                                        </Badge>
                                    })}
                                    <FileUploader multiple handleChange={handleAddFiles} name="file" types={fileTypes} >
                                        <CardMedia
                                            component="img"
                                            sx={{  width: 100, height: 100, marginBottom: "1rem", cursor: "pointer" }}
                                            src={defaultImage}
                                        />
                                    </FileUploader>
                                </Box>
                                {!!createProductValidate?.imagesOrder && <Box pt={2} pb={2}><Typography color="error">{createProductValidate.imagesOrder}</Typography></Box>}
                            </Grid>
                        </Grid>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Category</Typography></Grid>
                            <Grid item xs>
                                <Autocomplete
                                    size="small"
                                    open={openField.category}
                                    onOpen={() => {
                                        setOpenField({ ...openField, category: true });
                                    }}
                                    onClose={() => {
                                        setOpenField({ ...openField, category: false });
                                    }}
                                    multiple
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    getOptionLabel={(option) => option.name}
                                    options={categories ? categories : []}
                                    onChange={handleCategoriesChange}
                                    renderOption={(props, option) => {
                                        return (
                                            <li {...props} key={option.id + option.name}>
                                                {option.name}
                                            </li>
                                        );
                                    }}
                                    placeholder="Type Categories name to select"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={!!createProductValidate?.categories ? createProductValidate.categories : "Category"}
                                            error={!!createProductValidate?.categories}
                                            placeholder="Categories"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Description</Typography></Grid>
                            <Grid item xs>
                                <Editor
                                    apiKey="r6fv8xh1mo9azwpl9yjhlzxlj2widuepmv44fl2ysyruywkl"
                                    initialValue={createProductFormValues.description}
                                    init={{
                                        height: 300,
                                        menubar: false,
                                        plugins: [
                                            'advlist autolink lists link image charmap print preview anchor',
                                            'searchreplace visualblocks code fullscreen',
                                            'insertdatetime media table paste code help wordcount'
                                        ],
                                        toolbar: 'undo redo | formatselect | ' +
                                            'bold italic backcolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                    }}
                                    onBlur={(evt, editor) => {
                                        setCreateProductFormValues({ ...createProductFormValues, description: editor.getContent() });
                                    }}
                                />
                                {!!createProductValidate?.description && <Box pt={2} pb={2}><Typography color="error">{createProductValidate.description}</Typography> </Box>}
                            </Grid>
                        </Grid>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Available for sale</Typography></Grid>
                            <Grid item xs>
                                <Switch
                                    color="secondary"
                                    checked={createProductFormValues.enabled === 1}
                                    onChange={handleEnabledChange}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <SeperatedSpace />
                    <Grid pl={4} pt={2} pb={2} item xs={12}>
                        <Typography sx={{ fontSize: "1.5rem", paddingBottom: "1rem", fontWeight: "bold" }}>Prices & Inventory</Typography>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Memberships</Typography></Grid>
                            <Grid item xs>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Memberships</InputLabel>
                                    <Select
                                        multiple
                                        value={createProductFormValues.memberships}
                                        onChange={handleMembershipsChange}
                                        input={<OutlinedInput label="Memberships" />}
                                        renderValue={(selected) => selected.join(', ')}
                                        MenuProps={MenuProps}
                                    >
                                        {membershipTypes.memberships.map((type) =>
                                            <MenuItem key={type.label} value={type.value}>
                                                <Checkbox checked={createProductFormValues.memberships.indexOf(+type.value) > -1} />
                                                <ListItemText primary={type.value} />
                                            </MenuItem>)
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Tax class</Typography></Grid>
                            <Grid item xs>
                                <Grid container width={1}>
                                    <Grid item xs={3}>
                                        <Typography>Default</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox name="Tax exempt" checked={createProductFormValues.tax_exempt === 1} onChange={handleTaxExemptChange} />
                                            }
                                            label="Tax exempt"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Price</Typography></Grid>
                            <Grid item xs>
                                <Grid container width={1}>
                                    <Grid item xs={3} justifyContent="flex-start">
                                        <CurrencyFormat
                                            customInput={renderCustomInput}
                                            required={true}
                                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                            value={createProductFormValues.price}
                                            thousandSeparator
                                            fixedDecimalScale
                                            decimalScale={2}
                                            label={!!createProductValidate?.price ? createProductValidate.price : "Price"}
                                            error={!!createProductValidate?.price}
                                            onValueChange={handlePriceChange}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox name="Sale" checked={openField.sale} onChange={handleSaleChange} />
                                            }
                                            label="Sale"
                                        />
                                    </Grid>
                                    {openField.sale && (<Grid item xs>
                                        <Grid container width={1}>
                                            <FormControl sx={{ width: "5rem" }} size="small">
                                                <InputLabel>Sale type</InputLabel>
                                                <Select
                                                    value={createProductFormValues.sale_price_type}
                                                    onChange={handleSalePriceTypeChange}
                                                    input={<OutlinedInput label="Sale type" />}
                                                    MenuProps={MenuProps}
                                                >
                                                    <MenuItem value="$">$</MenuItem>
                                                    <MenuItem value="%">%</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <CurrencyFormat
                                                customInput={renderCustomInput}
                                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                value={createProductFormValues.sale_price}
                                                thousandSeparator
                                                fixedDecimalScale
                                                decimalScale={2}
                                                label="Sale price"
                                                onValueChange={handleSalePriceChange}
                                            />
                                        </Grid>
                                    </Grid>)}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Arrival date</Typography></Grid>
                            <Grid item xs>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        inputFormat="yyyy-MM-dd"
                                        mask="____-__-__"
                                        label="Arrival date"
                                        value={createProductFormValues.arrival_date}
                                        onChange={handleChangeArrivalDate}
                                        renderInput={(params) => <TextField {...params} fullWidth size="small" helperText={null} />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Quantity in stock</Typography></Grid>
                            <Grid item xs={3}>
                                <CurrencyFormat
                                    fullWidth
                                    customInput={renderCustomInput}
                                    value={createProductFormValues.quantity}
                                    thousandSeparator
                                    fixedDecimalScale
                                    decimalScale={2}
                                    label={!!createProductValidate?.quantity ? createProductValidate.quantity : "Quantity in stock"}
                                    error={!!createProductValidate?.quantity}
                                    onValueChange={handleQuantityChange}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <SeperatedSpace />
                    <Grid pl={4} pt={2} pb={2} item xs={12}>
                        <Typography sx={{ fontSize: "1.5rem", paddingBottom: "1rem", fontWeight: "bold" }}>Shipping</Typography>
                        {createProductFormValues.shipping_to_zones.map((item) =>
                            <Grid key={`${item.id}-${Date.now()}`} container width={1} p={2} spacing={3}>
                                <Grid item xs={LABEL_COLUMN}><Typography align="right">{item.id === 1 ? "Continental U.S." : shippings && ([...shippings].find(i => +i.id === item.id)?.name || "")} </Typography></Grid>
                                <Grid item xs>
                                    {item.id === 1 ? <CurrencyFormat
                                        fullWidth
                                        customInput={renderCustomInput}
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                        value={item.price}
                                        thousandSeparator
                                        fixedDecimalScale
                                        decimalScale={2}
                                        label="Fee"
                                        onValueChange={(values) => {
                                            const { value } = values
                                            handleChangeShippingZone(item.id, value)
                                        }}
                                    /> : <Grid container width={1}>
                                        <Grid item xs={9}>
                                            <CurrencyFormat
                                                fullWidth
                                                customInput={renderCustomInput}
                                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                value={item.price}
                                                thousandSeparator
                                                fixedDecimalScale
                                                decimalScale={2}
                                                label="Fee"
                                                onValueChange={(values) => {
                                                    const { value } = values
                                                    handleChangeShippingZone(item.id, value)
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs pl={2}>
                                            <Button fullWidth color="secondary" onClick={(e) => handleRemoveShippingZone(item.id)}>Remove</Button>
                                        </Grid>
                                    </Grid>}

                                </Grid>
                            </Grid>
                        )}
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}></Grid>
                            <Grid item xs>
                                <Autocomplete
                                    size="small"
                                    multiple
                                    open={openAddShippingZonesField}
                                    onOpen={() => {
                                        setOpenAddShippingZonesField(true);
                                    }}
                                    onClose={() => {
                                        setOpenAddShippingZonesField(false);
                                    }}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    getOptionLabel={(option) => option.name}
                                    options={shippings ? shippings : []}
                                    value={getShippingZonesValue()}
                                    onChange={(e, value) => {
                                        value.map((item) => handleAddShippingZone(+item.id))
                                    }}
                                    renderOption={(props, option) => {
                                        return (
                                            <li {...props} key={option.id + option.name}>
                                                {option.name}
                                            </li>
                                        );
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Countries"
                                            placeholder="Countries"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>

                    </Grid>
                    <SeperatedSpace />
                    <Grid pl={4} pt={2} pb={2} item xs={12}>
                        <Typography sx={{ fontSize: "1.5rem", paddingBottom: "1rem", fontWeight: "bold" }}>Marketing</Typography>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Open Graph meta tags</Typography></Grid>
                            <Grid item xs>
                                <FormControl size="small" fullWidth>
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        value={createProductFormValues.og_tags_type}
                                        label="Type"
                                        onChange={handleOgTagsTypeChange}
                                    >
                                        <MenuItem value="0">Autogenerated</MenuItem>
                                        <MenuItem value="1">Custom</MenuItem>
                                    </Select>
                                </FormControl >
                            </Grid>
                        </Grid>
                        {createProductFormValues.og_tags_type === "1" && <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right"></Typography></Grid>
                            <Grid item xs>
                                <TextField
                                    fullWidth
                                    autoComplete="off"
                                    multiline
                                    rows={4}
                                    size="small"
                                    label={!!createProductValidate.og_tags ? createProductValidate.og_tags : "Tags"}
                                    type="text"
                                    error={!!createProductValidate?.og_tags}
                                    value={createProductFormValues.og_tags}
                                    onChange={handleOgTagsChange}
                                />
                            </Grid>
                        </Grid>
                        }
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Meta description</Typography></Grid>
                            <Grid item xs>
                                <FormControl size="small" fullWidth>
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        value={createProductFormValues.meta_desc_type}
                                        label="Type"
                                        onChange={handleMetaDescTypeChange}
                                    >
                                        <MenuItem value="A">Autogenerated</MenuItem>
                                        <MenuItem value="C">Custom</MenuItem>
                                    </Select>
                                </FormControl >
                            </Grid>
                        </Grid>
                        {createProductFormValues.meta_desc_type === "C" && <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right"></Typography></Grid>
                            <Grid item xs>
                                <TextField
                                    fullWidth
                                    autoComplete="off"
                                    multiline
                                    rows={4}
                                    size="small"
                                    label={!!createProductValidate.meta_description ? createProductValidate.meta_description : "Decription"}
                                    type="text"
                                    error={!!createProductValidate?.meta_description}
                                    value={createProductFormValues.meta_description}
                                    onChange={handleMetaDescriptionChange}
                                />
                            </Grid>
                        </Grid>
                        }
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Meta keywords</Typography></Grid>
                            <Grid item xs>
                                <TextField
                                    fullWidth
                                    autoComplete="off"
                                    size="small"
                                    label="Keywords"
                                    type="text"
                                    value={createProductFormValues.meta_keywords}
                                    onChange={handleMetaKeywordsChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Product page title</Typography></Grid>
                            <Grid item xs>
                                <TextField
                                    fullWidth
                                    autoComplete="off"
                                    size="small"
                                    type="text"
                                    label="Title"
                                    value={createProductFormValues.product_page_title}
                                    onChange={handleProductPageTitleChange}
                                    helperText="Leave blank to use product name as Page Title."
                                />
                            </Grid>
                        </Grid>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Add to Facebook product feed</Typography></Grid>
                            <Grid item xs>
                                <Switch
                                    color="secondary"
                                    checked={createProductFormValues.facebook_marketing_enabled === 1}
                                    onChange={handleFacebookMarketingEnabledChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid container width={1} p={2} spacing={3}>
                            <Grid item xs={LABEL_COLUMN}><Typography align="right">Add to Google product feed</Typography></Grid>
                            <Grid item xs>
                                <Switch
                                    color="secondary"
                                    checked={createProductFormValues.google_feed_enabled === 1}
                                    onChange={handleGoogleMarketingEnabledChange}
                                />
                            </Grid>
                        </Grid>

                    </Grid>
                    <Grid item xs={12} m={2} mb={4} sx={{ backgroundColor: "#323259", position: "sticky", border: "1px solid #1b1b38", borderWidth: "0 0 1px 1px", boxShadow: "0 0 13px 0 #b18aff", bottom: "0" }}>
                        <Grid p={2} item xs={12} >
                            <Button disabled={!validCreateProduct(createProductValidate)} type="submit" variant="contained" color="warning">Add product</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>)
}
export default CreateProductForm

