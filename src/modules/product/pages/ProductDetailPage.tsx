import { ArrowBackRounded } from '@mui/icons-material';
import { Box, Grid, IconButton, Tab, Tabs, Typography } from '@mui/material';
import { replace } from 'connected-react-router';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { API_PATHS } from '../../../configs/api';
import { ROUTES } from '../../../configs/routes';
import { IUpdateProductParams } from '../../../models/product';
import { AppState } from '../../../redux/reducer';
import { getErrorMessageResponse } from '../../../utils';
import { addNotification } from '../../common/redux/notificationReducer';
import { fetchThunk } from '../../common/redux/thunk';
import ProductDetailUpdateForm from '../component/ProductDetailUpdateForm';
import {
  setBrands,
  setCategories,
  setConditions,
  setLoadingProductData,
  setProductDetail,
  setShippings,
  setVendors,
} from '../redux/productReducer';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
interface ProductDetailParams {
  id: string;
}
interface Props {
  url: string;
}
const ProductDetailPage = (props: Props) => {
  const { url } = props;
  const { id } = useParams<ProductDetailParams>();
  const { productDetail } = useSelector((state: AppState) => ({
    productDetail: state.product.productDetail,
  }));
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [tabIndex, setTabIndex] = useState(0);
  const handleBackClick = (e: any) => dispatch(replace(`${url}${ROUTES.products}${ROUTES.manageProduct}`));
  const handleChangeTabIndex = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };
  const getProductDetail = useCallback(async () => {
    dispatch(setLoadingProductData(true));
    const json = await dispatch(fetchThunk(API_PATHS.productDetail, 'post', { id }));
    dispatch(setLoadingProductData(false));
    if (!json?.errors) {
      dispatch(setProductDetail(json.data));
      return;
    }
    dispatch(addNotification({ message: getErrorMessageResponse(json), type: 'error' }));
  }, [dispatch, id]);
  const onUploadFile = useCallback(
    async (file: File, productId: string, order: string) => {
      dispatch(setLoadingProductData(true));
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('order', order);
      formData.append('images', file);
      const json = await dispatch(fetchThunk(API_PATHS.uploadImageFile, 'post', formData, true, 'multipart/form-data'));
      dispatch(setLoadingProductData(false));
      if (!json?.errors) {
        return;
      }
      dispatch(addNotification({ message: getErrorMessageResponse(json), type: 'error' }));
    },
    [dispatch],
  );
  const onUpdateProduct = useCallback(
    async (values: IUpdateProductParams, files: Array<File>) => {
      dispatch(setLoadingProductData(true));
      const formData = new FormData();
      formData.append('productDetail', JSON.stringify(values));
      const json = await dispatch(fetchThunk(API_PATHS.productsCreate, 'post', formData, true, 'multipart/form-data'));
      dispatch(setLoadingProductData(false));
      if (!json?.errors) {
        const productId = json.data;
        await Promise.all(
          files.map(async (file) => {
            const index = values.imagesOrder.findIndex((item) => item === file.name);
            if (index !== -1) {
              await onUploadFile(file, productId, index.toString());
            }
          }),
        );
        dispatch(addNotification({ message: 'Update product successfully', type: 'success' }));
        getProductDetail();
        return;
      }
      dispatch(addNotification({ message: getErrorMessageResponse(json), type: 'error' }));
    },
    [dispatch, onUploadFile, getProductDetail],
  );
  const handleUpdateProduct = (values: IUpdateProductParams, files: Array<File>) => {
    onUpdateProduct(values, files);
  };
  const getVendors = useCallback(
    async (search: string = '') => {
      dispatch(setLoadingProductData(true));
      const json = await dispatch(fetchThunk(API_PATHS.vendorsList, 'post', { search }));
      dispatch(setLoadingProductData(false));

      if (!json?.errors && json.data && true) {
        if (!json.data) {
          dispatch(setVendors([]));
          return;
        }
        dispatch(setVendors(json.data));
        return;
      }
    },
    [dispatch],
  );
  const getCategories = useCallback(async () => {
    dispatch(setLoadingProductData(true));
    const json = await dispatch(fetchThunk(API_PATHS.categoriesList, 'post'));
    dispatch(setLoadingProductData(false));
    if (!json?.errors) {
      dispatch(setCategories(json.data));
      return;
    }
  }, [dispatch]);
  const getBrands = useCallback(async () => {
    dispatch(setLoadingProductData(true));
    const json = await dispatch(fetchThunk(API_PATHS.brandsList, 'post'));
    dispatch(setLoadingProductData(false));
    if (!json?.errors) {
      dispatch(setBrands(json.data));
      return;
    }
  }, [dispatch]);
  const getConditions = useCallback(async () => {
    dispatch(setLoadingProductData(true));
    const json = await dispatch(fetchThunk(API_PATHS.conditionsList, 'post'));
    dispatch(setLoadingProductData(false));
    if (!json?.errors) {
      dispatch(setConditions(json.data));
      return;
    }
  }, [dispatch]);
  const getShippings = useCallback(async () => {
    dispatch(setLoadingProductData(true));
    const json = await dispatch(fetchThunk(API_PATHS.shippingsList, 'post'));
    dispatch(setLoadingProductData(false));
    if (!json?.errors) {
      dispatch(setShippings(json.data));
      return;
    }
  }, [dispatch]);
  useEffect(() => {
    getVendors();
  }, [getVendors]);
  useEffect(() => {
    getCategories();
  }, [getCategories]);
  useEffect(() => {
    getBrands();
  }, [getBrands]);
  useEffect(() => {
    getConditions();
  }, [getConditions]);
  useEffect(() => {
    getShippings();
  }, [getShippings]);
  useEffect(() => {
    switch (tabIndex) {
      case 0:
        getProductDetail();
        break;
      case 1:
        break;
    }
  }, [tabIndex, getProductDetail]);

  return (
    <>
      <Box
        component="div"
        sx={{
          overflow: 'auto',
          maxHeight: '95vh',
          maxWidth: 1,
          '&::-webkit-scrollbar': {
            height: '10px',
            width: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#b18aff',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#13132b',
            borderRadius: '3px',
          },
        }}
        p={2}
      >
        <Grid container width={1}>
          <Box pl={3.5} pt={4} width={1}>
            <IconButton
              sx={{
                padding: '0.5rem',
                backgroundColor: '#fff',
                '&:hover': {
                  backgroundColor: '#fff',
                },
              }}
              onClick={handleBackClick}
            >
              <ArrowBackRounded sx={{ color: 'black' }} />
            </IconButton>
          </Box>
          <Grid pr={4} pl={4} pt={2} container width={1}>
            {productDetail && (
              <Typography variant="h4" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {productDetail.name}
              </Typography>
            )}
            <Grid item xs={12} width={1} sx={{ borderBottom: 1, borderBottomColor: '#B18AFF', borderColor: 'divider' }}>
              <Tabs value={tabIndex} onChange={handleChangeTabIndex} variant="scrollable" scrollButtons="auto">
                <Tab label="Info" {...a11yProps(0)} />
                <Tab label="Attachments" {...a11yProps(1)} />
              </Tabs>
            </Grid>
            <Grid item xs={12}>
              <TabPanel value={tabIndex} index={0}>
                {productDetail && (
                  <ProductDetailUpdateForm onUpdateProduct={handleUpdateProduct} productDetail={productDetail} />
                )}
              </TabPanel>
              <TabPanel value={tabIndex} index={1}></TabPanel>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default ProductDetailPage;
