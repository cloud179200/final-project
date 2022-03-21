import {
  Autocomplete,
  Box,
  Grid,
  TextField,
  Typography,
  CardMedia,
  Badge,
  IconButton,
  Switch,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControlLabel,
  FormControl,
  InputLabel,
  Button,
  InputAdornment,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { useSelector } from 'react-redux';
import { ICreateProductParams } from '../../../models/product';
import { AppState } from '../../../redux/reducer';
import { commasRegex, fileToBase64String } from '../../../utils';
import { validationCreateProductSchema } from '../utils';
import defaultImage from '../../../utils/defaultImage.png';
import { RemoveCircleRounded } from '@mui/icons-material';
import { Editor } from '@tinymce/tinymce-react';
import CurrencyFormat from 'react-currency-format';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import moment from 'moment';
import { LABEL_COLUMN } from '../../../utils/constants';
import SeperatedSpace from '../../common/components/SpreratedSpace';
import { useFormik } from 'formik';
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
const fileTypes = ['JPG', 'PNG', 'GIF', 'JPEG'];
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
  const { onCreateProduct } = props;
  const { vendors, categories, conditions, brands, shippings } = useSelector((state: AppState) => ({
    vendors: state.product.vendors,
    categories: state.product.categories,
    conditions: state.product.conditions,
    brands: state.product.brands,
    shippings: state.product.shippings,
  }));
  const membershipTypes = {
    memberships: [{ label: 'general', value: 'general' }],
    pendingMemberships: [{ label: 'general', value: 'general' }],
  };
  const [files, setFiles] = useState<Array<IFileImage>>([]);
  const [openAddShippingZonesField, setOpenAddShippingZonesField] = useState(false);
  const addFile = useCallback(
    async (file: File) => {
      const base64String = await fileToBase64String(file);
      const fileAlreadyIn = [...files].find((item) => item.base64Src === base64String);
      if (fileAlreadyIn) {
        return;
      }
      setFiles((prevFiles) => {
        const newFiles = [...prevFiles].filter((item) => item.base64Src !== base64String);
        newFiles.push({ file, base64Src: base64String });
        return newFiles;
      });
    },
    [files],
  );
  const removeFile = useCallback((base64Src: string) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles].filter((item) => item.base64Src !== base64Src);
      return newFiles;
    });
  }, []);
  const handleAddFiles = (multipleFile: FileList) => {
    Array.from(multipleFile).map((file) => addFile(file));
  };
  const formik = useFormik({
    initialValues: {
      vendor_id: '',
      name: '',
      brand_id: '',
      condition_id: '',
      categories: [],
      description: '',
      enabled: false,
      memberships: [],
      shipping_to_zones: [{ id: 1, price: '0.00' }],
      tax_exempt: false,
      price: '0.00',
      sale_price_type: '$',
      arrival_date: moment(new Date()).format('yyyy-MM-DD'),
      inventory_tracking: 0,
      quantity: '0.00',
      sku: '',
      participate_sale: '0',
      sale_price: '0',
      og_tags_type: '0',
      og_tags: '',
      meta_desc_type: 'A',
      meta_description: '',
      meta_keywords: '',
      product_page_title: '',
      facebook_marketing_enabled: false,
      google_feed_enabled: false,
      imagesOrder: [],
      deleted_images: [],
    },
    validationSchema: validationCreateProductSchema(
      vendors || [],
      categories || [],
      conditions || [],
      brands || [],
      shippings || [],
    ),
    onSubmit: (values) => {
      const {
        vendor_id,
        name,
        brand_id,
        condition_id,
        categories,
        description,
        enabled,
        memberships,
        shipping_to_zones,
        tax_exempt,
        price,
        sale_price_type,
        arrival_date,
        inventory_tracking,
        quantity,
        sku,
        participate_sale,
        sale_price,
        og_tags_type,
        og_tags,
        meta_desc_type,
        meta_description,
        meta_keywords,
        product_page_title,
        facebook_marketing_enabled,
        google_feed_enabled,
        imagesOrder,
        deleted_images,
      } = values;
      const formValues: ICreateProductParams = {
        vendor_id,
        name,
        brand_id,
        condition_id,
        categories,
        description,
        enabled: enabled ? 1 : 0,
        memberships,
        shipping_to_zones,
        tax_exempt: tax_exempt ? 1 : 0,
        price,
        sale_price_type,
        arrival_date,
        inventory_tracking,
        quantity,
        sku,
        participate_sale,
        sale_price,
        og_tags_type,
        og_tags,
        meta_desc_type,
        meta_description,
        meta_keywords,
        product_page_title,
        facebook_marketing_enabled: facebook_marketing_enabled ? 1 : 0,
        google_feed_enabled: google_feed_enabled ? 1 : 0,
        imagesOrder,
        deleted_images,
      };
      onCreateProduct(
        formValues,
        files.map((item) => item.file),
      );
    },
  });
  const [openField, setOpenField] = useState({
    vendor: false,
    brand: false,
    condition: false,
    category: false,
    sale: false,
  });

  const handleAddShippingZone = (id?: number) => {
    if (!id) {
      return;
    }
    const isShippingZoneIn = [...formik.values.shipping_to_zones].some((item) => item.id === id);
    if (isShippingZoneIn) {
      return;
    }
    formik.setFieldValue('shipping_to_zones', [...formik.values.shipping_to_zones, { id, price: '0.00' }]);
  };

  const handleRemoveShippingZone = (id: number) => {
    if (id === 1) {
      return;
    }
    const newShippingZones = [...formik.values.shipping_to_zones].filter((item) => item.id !== id);
    formik.setFieldValue('shipping_to_zones', newShippingZones);
  };
  useEffect(() => {
    formik.setFieldValue(
      'imagesOrder',
      [...files].map((file) => file.file.name),
    );
    // eslint-disable-next-line
  }, [files]);
  return (
    <>
      <Box component="form" width={1} onSubmit={formik.handleSubmit}>
        <Grid container width={1} position="relative">
          <Grid pl={4} pt={2} pb={2} item xs={12}>
            <Typography sx={{ fontSize: '1.75rem', paddingBottom: '1rem', fontWeight: 'bold' }}>Add Product</Typography>

            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}>
                <Typography align="right">Vendor</Typography>
              </Grid>
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
                  getOptionLabel={(option) => (option.login ? option.login : option.name)}
                  options={vendors ? vendors : []}
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option.id}>
                        {option.name}
                      </li>
                    );
                  }}
                  value={vendors ? vendors.find((item) => item.id === formik.values.vendor_id) : null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      name="vendor_id"
                      label={formik.errors.vendor_id || 'Vendor'}
                      error={Boolean(formik.errors.vendor_id)}
                      onBlur={(e) => {
                        const { value } = e.target;
                        if (!value) {
                          formik.setValues({ ...formik.values, vendor_id: '' });
                          return;
                        }
                        if (!vendors) {
                          formik.setValues({ ...formik.values, vendor_id: '' });
                          return;
                        }
                        const vendor = vendors.find((item) => item.login === value || item.name === value);
                        if (!vendor) {
                          formik.setValues({ ...formik.values, vendor_id: '' });
                          return;
                        }
                        formik.setValues({ ...formik.values, vendor_id: vendor.id });
                      }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: <>{params.InputProps.endAdornment}</>,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}>
                <Typography align="right">Product name</Typography>
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  required
                  autoComplete="off"
                  size="small"
                  name="name"
                  type="text"
                  label={formik.errors.name || 'Product name'}
                  error={Boolean(formik.errors.name)}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}>
                <Typography align="right">Brand</Typography>
              </Grid>
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
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option.id + option.name}>
                        {option.name}
                      </li>
                    );
                  }}
                  value={brands?.find((item) => item.id === formik.values.brand_id)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      name="brand_id"
                      label={formik.errors.brand_id || 'Brand'}
                      error={Boolean(formik.errors.brand_id)}
                      placeholder="Type Brand name to select"
                      onBlur={(e) => {
                        const { value } = e.target;
                        if (!value) {
                          formik.setValues({ ...formik.values, brand_id: '' });
                          return;
                        }
                        if (!brands) {
                          formik.setValues({ ...formik.values, brand_id: '' });
                          return;
                        }
                        const brand = brands.find((item) => item.name === value);
                        if (!brand) {
                          formik.setValues({ ...formik.values, brand_id: '' });
                          return;
                        }
                        formik.setValues({ ...formik.values, brand_id: brand.id });
                      }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: <>{params.InputProps.endAdornment}</>,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}>
                <Typography align="right">Condition</Typography>
              </Grid>
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
                      name="condition_id"
                      label={formik.errors.condition_id || 'Condition'}
                      error={Boolean(formik.errors.condition_id)}
                      onBlur={(e) => {
                        const { value } = e.target;
                        if (!value) {
                          formik.setValues({ ...formik.values, condition_id: '' });
                          return;
                        }
                        if (!conditions) {
                          formik.setValues({ ...formik.values, condition_id: '' });
                          return;
                        }
                        const condition = conditions.find((item) => item.name === value);
                        if (!condition) {
                          formik.setValues({ ...formik.values, condition_id: '' });
                          return;
                        }
                        formik.setValues({ ...formik.values, condition_id: condition.id });
                      }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: <>{params.InputProps.endAdornment}</>,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}>
                <Typography align="right">SKU</Typography>
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  autoComplete="off"
                  size="small"
                  name="sku"
                  type="text"
                  label={formik.errors.sku || 'SKU'}
                  error={Boolean(formik.errors.sku)}
                  value={formik.values.sku}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}>
                <Typography align="right">Images</Typography>
              </Grid>
              <Grid item xs>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: 1,
                    flexWrap: 'wrap',
                  }}
                >
                  {files.map((item) => {
                    return (
                      <Badge
                        key={item.base64Src}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        sx={{ mr: 2 }}
                        badgeContent={
                          <IconButton color="error" onClick={(e) => removeFile(item.base64Src)}>
                            <RemoveCircleRounded />
                          </IconButton>
                        }
                      >
                        <CardMedia
                          component="img"
                          sx={{ width: 100, height: 100, marginBottom: '1rem', cursor: 'pointer' }}
                          src={item.base64Src}
                        />
                      </Badge>
                    );
                  })}
                  <FileUploader multiple handleChange={handleAddFiles} name="file" types={fileTypes}>
                    <CardMedia
                      component="img"
                      sx={{ width: 100, height: 100, marginBottom: '1rem', cursor: 'pointer' }}
                      src={defaultImage}
                    />
                  </FileUploader>
                </Box>
                {Boolean(formik.errors.imagesOrder) && (
                  <Box pt={2} pb={2}>
                    <Typography color="error">{formik.errors.imagesOrder}</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}>
                <Typography align="right">Category</Typography>
              </Grid>
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
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option.id + option.name}>
                        {option.name}
                      </li>
                    );
                  }}
                  placeholder="Type Categories name to select"
                  onChange={(e, value) => {
                    formik.setFieldValue(
                      'categories',
                      value.map((item) => +item.id),
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      name="categories"
                      label={formik.errors.categories || 'Category'}
                      error={Boolean(formik.errors.categories)}
                      placeholder="Categories"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: <>{params.InputProps.endAdornment}</>,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}>
                <Typography align="right">Description</Typography>
              </Grid>
              <Grid item xs>
                <Editor
                  apiKey="r6fv8xh1mo9azwpl9yjhlzxlj2widuepmv44fl2ysyruywkl"
                  initialValue={formik.values.description}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount',
                    ],
                    toolbar:
                      'undo redo | formatselect | ' +
                      'bold italic backcolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                  }}
                  onBlur={(evt, editor) => {
                    formik.setFieldValue('description', editor.getContent());
                  }}
                />
                {Boolean(formik.errors.description) && (
                  <Box pt={2} pb={2}>
                    <Typography color="error">{formik.errors.description}</Typography>{' '}
                  </Box>
                )}
              </Grid>
            </Grid>
            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}>
                <Typography align="right">Available for sale</Typography>
              </Grid>
              <Grid item xs>
                <Switch
                  color="secondary"
                  name="enabled"
                  checked={formik.values.enabled}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
          </Grid>
          <SeperatedSpace />
          <Grid pl={4} pt={2} pb={2} item xs={12}>
            <Typography sx={{ fontSize: '1.5rem', paddingBottom: '1rem', fontWeight: 'bold' }}>
              Prices & Inventory
            </Typography>
            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}>
                <Typography align="right">Memberships</Typography>
              </Grid>
              <Grid item xs>
                <FormControl fullWidth size="small">
                  <InputLabel>Memberships</InputLabel>
                  <Select
                    multiple
                    name="memberships"
                    value={formik.values.memberships}
                    input={<OutlinedInput label="Memberships" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                  >
                    {membershipTypes.memberships.map((type) => (
                      <MenuItem key={type.label + type.value} value={type.value}>
                        <Checkbox checked={formik.values.memberships.includes(type.value as never)} />
                        <ListItemText primary={type.value} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}>
                <Typography align="right">Tax class</Typography>
              </Grid>
              <Grid item xs>
                <Grid container width={1}>
                  <Grid item xs={3}>
                    <Typography>Default</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControlLabel
                      control={
                        <Checkbox name="tax_exempt" checked={formik.values.tax_exempt} onChange={formik.handleChange} />
                      }
                      label="Tax exempt"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}>
                <Typography align="right">Price</Typography>
              </Grid>
              <Grid item xs>
                <Grid container width={1}>
                  <Grid item xs={3} justifyContent="flex-start">
                    <CurrencyFormat
                      customInput={renderCustomInput}
                      required={true}
                      startAdornment={<InputAdornment position="start">$</InputAdornment>}
                      thousandSeparator
                      fixedDecimalScale
                      decimalScale={2}
                      name="price"
                      label={formik.errors.price || 'Price'}
                      error={Boolean(formik.errors.price)}
                      value={formik.values.price}
                      onBlur={(e) => {
                        formik.setFieldValue('price', e.target.value.replace(commasRegex, ''));
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={openField.sale}
                          onChange={(e) => setOpenField({ ...openField, sale: e.target.checked })}
                        />
                      }
                      label="Sale"
                    />
                  </Grid>
                  {openField.sale && (
                    <Grid item xs>
                      <Grid container width={1}>
                        <FormControl sx={{ width: '5rem' }} size="small" error={Boolean(formik.errors.sale_price_type)}>
                          <InputLabel>{formik.errors.sale_price_type || 'Sale type'}</InputLabel>
                          <Select
                            name="sale_price_type"
                            type="text"
                            value={formik.values.sale_price_type}
                            input={<OutlinedInput label={formik.errors.sale_price_type || 'Sale type'} />}
                            onChange={formik.handleChange}
                            MenuProps={MenuProps}
                          >
                            <MenuItem value="$">$</MenuItem>
                            <MenuItem value="%">%</MenuItem>
                          </Select>
                        </FormControl>
                        <CurrencyFormat
                          customInput={renderCustomInput}
                          startAdornment={<InputAdornment position="start">$</InputAdornment>}
                          thousandSeparator
                          fixedDecimalScale
                          decimalScale={2}
                          name="sale_price"
                          type="text"
                          label={formik.errors.sale_price || 'Price'}
                          error={Boolean(formik.errors.sale_price)}
                          value={formik.values.sale_price}
                          onValueChange={(values) => {
                            const { value } = values;
                            formik.setFieldValue('sale_price', value);
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}>
                <Typography align="right">Arrival date</Typography>
              </Grid>
              <Grid item xs>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    inputFormat="yyyy-MM-dd"
                    mask="____-__-__"
                    label="Arrival date"
                    value={formik.values.arrival_date}
                    onChange={(value: Date | null) => {
                      value && formik.setFieldValue('arrival_date', moment(value).format('yyyy-MM-DD'));
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth size="small" helperText={null} />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}>
                <Typography align="right">Quantity in stock</Typography>
              </Grid>
              <Grid item xs={3}>
                <CurrencyFormat
                  fullWidth
                  customInput={renderCustomInput}
                  thousandSeparator
                  fixedDecimalScale
                  decimalScale={2}
                  name="quantity"
                  label={formik.errors.quantity || 'Quantity in stock'}
                  error={Boolean(formik.errors.quantity)}
                  value={formik.values.quantity}
                  onBlur={(e) => {
                    formik.setFieldValue('quantity', e.target.value.replace(commasRegex, ''));
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <SeperatedSpace />
          <Grid pl={4} pt={2} pb={2} item xs={12}>
            <Typography sx={{ fontSize: '1.5rem', paddingBottom: '1rem', fontWeight: 'bold' }}>Shipping</Typography>
            {formik.values.shipping_to_zones.map((item, index) => (
              <Grid key={`${item.id}-${Date.now()}`} container width={1} p={2} spacing={3}>
                <Grid item xs={LABEL_COLUMN}>
                  <Typography align="right">
                    {item.id === 1
                      ? 'Continental U.S.'
                      : shippings && ([...shippings].find((i) => +i.id === item.id)?.name || '')}{' '}
                  </Typography>
                </Grid>
                <Grid item xs>
                  {item.id === 1 ? (
                    <CurrencyFormat
                      fullWidth
                      customInput={renderCustomInput}
                      startAdornment={<InputAdornment position="start">$</InputAdornment>}
                      value={item.price}
                      thousandSeparator
                      fixedDecimalScale
                      decimalScale={2}
                      label="Fee"
                      name={`shipping_to_zones[${index}].price`}
                      onBlur={(e) => {
                        formik.setFieldValue(
                          `shipping_to_zones[${index}].price`,
                          e.target.value.replace(commasRegex, ''),
                        );
                      }}
                    />
                  ) : (
                    <Grid container width={1}>
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
                          name={`shipping_to_zones[${index}].price`}
                          onBlur={(e) => {
                            formik.setFieldValue(
                              `shipping_to_zones[${index}].price`,
                              e.target.value.replace(commasRegex, ''),
                            );
                          }}
                        />
                      </Grid>
                      <Grid item xs pl={2}>
                        <Button fullWidth color="secondary" onClick={(e) => handleRemoveShippingZone(item.id)}>
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            ))}
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
                  onChange={(e, value) => {
                    value.map((item) => handleAddShippingZone(+item.id));
                  }}
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option.id + option.name}>
                        {option.name}
                      </li>
                    );
                  }}
                  value={
                    shippings
                      ? [...shippings].filter((item) => formik.values.shipping_to_zones.some((i) => i.id === +item.id))
                      : []
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Countries"
                      placeholder="Countries"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: <>{params.InputProps.endAdornment}</>,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <SeperatedSpace />
          <Grid pl={4} pt={2} pb={2} item xs={12}>
            <Typography sx={{ fontSize: '1.5rem', paddingBottom: '1rem', fontWeight: 'bold' }}>Marketing</Typography>
            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}>
                <Typography align="right">Open Graph meta tags</Typography>
              </Grid>
              <Grid item xs>
                <FormControl size="small" fullWidth error={Boolean(formik.errors.og_tags_type)}>
                  <InputLabel>{formik.errors.og_tags_type || 'Type'}</InputLabel>
                  <Select
                    name="og_tags_type"
                    label={formik.errors.og_tags_type || 'Type'}
                    value={formik.values.og_tags_type}
                  >
                    <MenuItem value="0">Autogenerated</MenuItem>
                    <MenuItem value="1">Custom</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {formik.values.og_tags_type === '1' && (
              <Grid container width={1} p={2} spacing={3}>
                <Grid item xs={LABEL_COLUMN}>
                  <Typography align="right"></Typography>
                </Grid>
                <Grid item xs>
                  <TextField
                    fullWidth
                    autoComplete="off"
                    multiline
                    rows={4}
                    size="small"
                    name="og_tags"
                    type="text"
                    label={formik.errors.og_tags || 'Tag'}
                    error={Boolean(formik.errors.og_tags)}
                    value={formik.values.og_tags}
                    onChange={formik.handleChange}
                  />
                </Grid>
              </Grid>
            )}
            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}>
                <Typography align="right">Meta description</Typography>
              </Grid>
              <Grid item xs>
                <FormControl size="small" fullWidth error={Boolean(formik.errors.meta_desc_type)}>
                  <InputLabel>{formik.errors.meta_desc_type || 'Type'}</InputLabel>
                  <Select
                    name="meta_desc_type"
                    label={formik.errors.meta_desc_type || 'Type'}
                    value={formik.values.meta_desc_type}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="A">Autogenerated</MenuItem>
                    <MenuItem value="C">Custom</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {formik.values.meta_desc_type === 'C' && (
              <Grid container width={1} p={2} spacing={3}>
                <Grid item xs={LABEL_COLUMN}>
                  <Typography align="right"></Typography>
                </Grid>
                <Grid item xs>
                  <TextField
                    fullWidth
                    autoComplete="off"
                    multiline
                    rows={4}
                    size="small"
                    name="meta_description"
                    type="text"
                    label={formik.errors.meta_description || 'Description'}
                    error={Boolean(formik.errors.meta_description)}
                    value={formik.values.meta_description}
                    onChange={formik.handleChange}
                  />
                </Grid>
              </Grid>
            )}
            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}>
                <Typography align="right">Meta keywords</Typography>
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  autoComplete="off"
                  size="small"
                  name="meta_keywords"
                  type="text"
                  label={formik.errors.meta_keywords || 'Keywords'}
                  error={Boolean(formik.errors.meta_keywords)}
                  value={formik.values.meta_keywords}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}>
                <Typography align="right">Product page title</Typography>
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  autoComplete="off"
                  size="small"
                  name="product_page_title"
                  type="text"
                  label={formik.errors.product_page_title || 'Title'}
                  error={Boolean(formik.errors.product_page_title)}
                  value={formik.values.product_page_title}
                  onChange={formik.handleChange}
                  helperText="Leave blank to use product name as Page Title."
                />
              </Grid>
            </Grid>
            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}>
                <Typography align="right">Add to Facebook product feed</Typography>
              </Grid>
              <Grid item xs>
                <Switch
                  color="secondary"
                  name="facebook_marketing_enabled"
                  checked={formik.values.facebook_marketing_enabled}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}>
                <Typography align="right">Add to Google product feed</Typography>
              </Grid>
              <Grid item xs>
                <Switch
                  color="secondary"
                  name="google_feed_enabled"
                  checked={formik.values.google_feed_enabled}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            m={2}
            mb={4}
            sx={{
              backgroundColor: '#323259',
              position: 'sticky',
              border: '1px solid #1b1b38',
              borderWidth: '0 0 1px 1px',
              boxShadow: '0 0 13px 0 #b18aff',
              bottom: '0',
            }}
          >
            <Grid p={2} item xs={12}>
              <Button disabled={!formik.isValid} type="submit" variant="contained" color="warning">
                Add product
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default CreateProductForm;
