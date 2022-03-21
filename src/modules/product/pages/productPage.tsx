import { Box, Button, Container, Grid, Modal, Typography } from '@mui/material';
import { replace } from 'connected-react-router';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { API_PATHS } from '../../../configs/api';
import { ROUTES } from '../../../configs/routes';
import { IProduct, IProductFilter } from '../../../models/product';
import { AppState } from '../../../redux/reducer';
import { getErrorMessageResponse } from '../../../utils';
import { addNotification } from '../../common/redux/notificationReducer';
import { fetchThunk } from '../../common/redux/thunk';
import ProductDataTable from '../component/ProductDataTable';
import ProductFilter from '../component/ProductFilter';
import {
  resetUpdatedPriceAndAmountProduct,
  setBrands,
  setCategories,
  setConditions,
  setLoadingProductData,
  setProductFilter,
  setProducts,
  setShippings,
} from '../redux/productReducer';
interface Props {
  url: string;
}
const ProductPage = (props: Props) => {
  const { url } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { user, products, pageInfoProduct, updatedPriceAndAmountProducts, productFilter } = useSelector(
    (state: AppState) => ({
      user: state.profile.user,
      products: state.product.products,
      pageInfoProduct: state.product.pageInfoProduct,
      updatedPriceAndAmountProducts: state.product.updatedPriceAndAmountProducts,
      productFilter: state.product.filter,
    }),
  );
  const [filter, setFilter] = useState<IProductFilter>();
  const [selectedProducts, setSelectedProducts] = useState<Array<IProduct>>([]);
  const [modal, setModal] = useState({ openConfirmDelete: false, openConfirmUpdate: false, openExportCSV: false });
  const handleAddProductClick = (e: any) => dispatch(replace(`${url}${ROUTES.products}${ROUTES.newProduct}`));
  const handleSetFilterForProductFilter = useCallback((f: IProductFilter) => {
    setFilter((prevFilter) => {
      return {
        ...f,
        sort: prevFilter ? prevFilter.sort : f.sort,
        order_by: prevFilter && prevFilter.order_by === ('ASC' || 'DESC') && true ? prevFilter.order_by : f.order_by,
      };
    });
  }, []);
  const handleSetFilterForProductDataTable = useCallback((sort: string, order_by: 'ASC' | 'DESC') => {
    setFilter((prevFilter) => {
      return prevFilter ? { ...prevFilter, sort, order_by } : prevFilter;
    });
  }, []);

  const updatePriceAndAmountProducts = useCallback(async () => {
    dispatch(setLoadingProductData(true));
    const productsForDelete = [...updatedPriceAndAmountProducts];
    const paramsForUpdate = productsForDelete.map((item) => {
      const { id, price, amount } = item;
      return { id, price, amount };
    });
    const json = await dispatch(fetchThunk(API_PATHS.productsEdit, 'post', { params: paramsForUpdate }));
    dispatch(setLoadingProductData(false));
    if (!json?.errors) {
      dispatch(addNotification({ message: 'Update successfully', type: 'success' }));
      dispatch(resetUpdatedPriceAndAmountProduct());
      return;
    }
    dispatch(addNotification({ message: getErrorMessageResponse(json), type: 'error' }));
  }, [dispatch, updatedPriceAndAmountProducts]);
  const handleSaveUpdatedPriceAndAmountProducts = (e: any) => {
    setModal({ ...modal, openConfirmUpdate: false });
    if (updatedPriceAndAmountProducts.length < 1) {
      return;
    }
    updatePriceAndAmountProducts();
  };

  const getProducts = useCallback(async () => {
    if (!filter) {
      return;
    }
    dispatch(setLoadingProductData(true));
    const json = await dispatch(
      fetchThunk(API_PATHS.productsList, 'post', {
        ...filter,
        page: pageInfoProduct.index + 1,
        count: pageInfoProduct.count,
      }),
    );
    dispatch(setLoadingProductData(false));
    if (!json?.errors) {
      if (!json.data) {
        dispatch(setProducts({ detail: [], recordsTotal: json.recordsTotal, recordsFiltered: json.recordsFiltered }));
        return;
      }
      dispatch(
        setProducts({ detail: [...json.data], recordsTotal: json.recordsTotal, recordsFiltered: json.recordsFiltered }),
      );
      return;
    }
  }, [dispatch, filter, pageInfoProduct]);

  const deleteProducts = useCallback(async () => {
    if (!user) {
      return;
    }
    dispatch(setLoadingProductData(true));
    const productsForDelete = [...selectedProducts];
    const paramsForDelete = productsForDelete.map((item) => {
      return { id: item.id, delete: 1 };
    });
    const json = await dispatch(fetchThunk(API_PATHS.productsEdit, 'post', { params: paramsForDelete }));
    dispatch(setLoadingProductData(false));
    if (!json?.errors) {
      getProducts();
      setSelectedProducts([]);
      return;
    }
  }, [dispatch, selectedProducts, user, getProducts]);
  const handleRemoveSelectedClick = (e: any) => {
    setModal({ ...modal, openConfirmDelete: false });
    if (selectedProducts.length < 1) {
      return;
    }
    deleteProducts();
  };

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

  const getExportFile = useCallback(
    async (fileLink: string) => {
      dispatch(setLoadingProductData(true));
      const json = await dispatch(fetchThunk(API_PATHS.exportDownload, 'post', { file: fileLink }));
      dispatch(setLoadingProductData(false));
      if (!json?.errors) {
        const url = json.data;
        window.open(url);
        return;
      }
      dispatch(addNotification({ message: getErrorMessageResponse(json), type: 'error' }));
    },
    [dispatch],
  );
  const exportCSV = useCallback(async () => {
    const id = [...selectedProducts].map((item) => item.id);
    dispatch(setLoadingProductData(true));
    const json = await dispatch(fetchThunk(API_PATHS.productsExport, 'post', id.length > 0 ? { id } : {}));
    dispatch(setLoadingProductData(false));
    if (!json?.errors) {
      const fileLink = json.data.file;
      if (fileLink) {
        getExportFile(fileLink);
      }
      return;
    }
    dispatch(addNotification({ message: getErrorMessageResponse(json), type: 'error' }));
  }, [dispatch, getExportFile, selectedProducts]);

  const handleConfirmExportCSVCLick = (e: any) => {
    setModal({ ...modal, openExportCSV: false });
    exportCSV();
  };

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
    if (!filter) {
      return;
    }
    dispatch(setProductFilter({ ...filter }));
    getProducts();
    setSelectedProducts([]);
  }, [filter, getProducts, pageInfoProduct, dispatch]);
  useEffect(() => {
    setFilter(
      productFilter
        ? { ...productFilter }
        : {
            search: '',
            category: '0',
            stock_status: 'all',
            availability: 'all',
            vendor: {},
            sort: 'name',
            order_by: 'ASC',
            search_type: '',
          },
    );
    return () => {
      products && dispatch(setProducts({ ...products, detail: [] }));
    };
    // eslint-disable-next-line
  }, []);
  return (
    <Box
      component="div"
      sx={{
        overflow: 'auto',
        position: 'relative',
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
      p={4}
    >
      {products && (
        <>
          <Typography variant="h4" pb={2} sx={{ color: '#fff' }}>
            Products
          </Typography>
          <Box component="div" pb={2}>
            <ProductFilter initialFilter={filter} setFilterByPage={handleSetFilterForProductFilter} />
          </Box>
          <Box component="div" pb={4} pt={4}>
            <Button color="secondary" variant="contained" onClick={handleAddProductClick}>
              Add Product
            </Button>
          </Box>
          <Box component="div" sx={{ overflow: 'auto', minWidth: '100%' }}>
            <ProductDataTable
              initialFilter={filter}
              url={url}
              products={products}
              setFilterByPage={handleSetFilterForProductDataTable}
              selectedProducts={selectedProducts}
              setSelectedProducts={(selected: Array<IProduct>) => {
                setSelectedProducts([...selected]);
              }}
            />
          </Box>
          <Box
            component="div"
            mt={2}
            p={2}
            width={1}
            sx={{
              backgroundColor: '#323259',
              position: 'sticky',
              border: '1px solid #1b1b38',
              borderWidth: '0 0 1px 1px',
              boxShadow: '0 0 13px 0 #b18aff',
              bottom: '0',
            }}
          >
            <Button
              disabled={updatedPriceAndAmountProducts.length === 0}
              color="warning"
              variant="contained"
              onClick={(e) => setModal({ ...modal, openConfirmUpdate: true })}
            >
              Save changes
            </Button>
            <Button
              disabled={selectedProducts.length === 0}
              color="warning"
              sx={{ marginLeft: 2 }}
              variant="contained"
              onClick={(e) => setModal({ ...modal, openConfirmDelete: true })}
            >
              Remove selected
            </Button>
            <Button
              color="warning"
              sx={{ marginLeft: 2 }}
              variant="contained"
              onClick={(e) => setModal({ ...modal, openExportCSV: true })}
            >
              {selectedProducts.length < 1 ? 'Export all: CSV' : 'Export selected: CSV'}
            </Button>
          </Box>
          <Modal open={modal.openConfirmDelete} onClose={() => setModal({ ...modal, openConfirmDelete: false })}>
            <Container
              maxWidth="xs"
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
            >
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{
                  borderRadius: 4,
                  backgroundColor: '#323259',
                  border: `1px solid #13132b`,
                }}
              >
                <Grid
                  item
                  xs={12}
                  pb={1}
                  p={2}
                  sx={{ justifyContent: 'flex-start', alignItems: 'center', borderBottom: '1px solid #1b1b38' }}
                >
                  <Typography color="#fff" variant="body1" fontSize=".9375rem" fontWeight="bold">
                    Confirm Delete
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  p={2}
                  sx={{ justifyContent: 'flex-start', alignItems: 'center', borderBottom: '1px solid #1b1b38' }}
                >
                  <Typography color="#fff" variant="body1" fontSize=".9375rem">
                    Do you want to delete these product?
                  </Typography>
                </Grid>
                <Box
                  component="span"
                  width={1}
                  p={2}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    '& .MuiTextField-root': { width: '100%', pb: 2 },
                    '& .MuiFormControl-root': { pb: 2 },
                    '& .MuiAlert-root': { mb: 2 },
                  }}
                >
                  <Box width={1} display="flex" justifyContent="space-between" alignItems="center">
                    <Button variant="contained" color="secondary" onClick={handleRemoveSelectedClick}>
                      Yes
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={(e) => setModal({ ...modal, openConfirmDelete: false })}
                    >
                      No
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Container>
          </Modal>
          <Modal open={modal.openConfirmUpdate} onClose={() => setModal({ ...modal, openConfirmUpdate: false })}>
            <Container
              maxWidth="xs"
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
            >
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{
                  borderRadius: 4,
                  backgroundColor: '#323259',
                  border: `1px solid #13132b`,
                }}
              >
                <Grid
                  item
                  xs={12}
                  pb={1}
                  p={2}
                  sx={{ justifyContent: 'flex-start', alignItems: 'center', borderBottom: '1px solid #1b1b38' }}
                >
                  <Typography color="#fff" variant="body1" fontSize=".9375rem" fontWeight="bold">
                    Confirm Delete
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  p={2}
                  sx={{ justifyContent: 'flex-start', alignItems: 'center', borderBottom: '1px solid #1b1b38' }}
                >
                  <Typography color="#fff" variant="body1" fontSize=".9375rem">
                    Do you want to update there products?
                  </Typography>
                </Grid>
                <Box
                  component="span"
                  width={1}
                  p={2}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    '& .MuiTextField-root': { width: '100%', pb: 2 },
                    '& .MuiFormControl-root': { pb: 2 },
                    '& .MuiAlert-root': { mb: 2 },
                  }}
                >
                  <Box width={1} display="flex" justifyContent="space-between" alignItems="center">
                    <Button variant="contained" color="secondary" onClick={handleSaveUpdatedPriceAndAmountProducts}>
                      Yes
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={(e) => setModal({ ...modal, openConfirmUpdate: false })}
                    >
                      No
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Container>
          </Modal>
          <Modal open={modal.openExportCSV} onClose={() => setModal({ ...modal, openConfirmDelete: false })}>
            <Container
              maxWidth="xs"
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
            >
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{
                  borderRadius: 4,
                  backgroundColor: '#323259',
                  border: `1px solid #13132b`,
                }}
              >
                <Grid
                  item
                  xs={12}
                  pb={1}
                  p={2}
                  sx={{ justifyContent: 'flex-start', alignItems: 'center', borderBottom: '1px solid #1b1b38' }}
                >
                  <Typography color="#fff" variant="body1" fontSize=".9375rem" fontWeight="bold">
                    Confirm Export
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  p={2}
                  sx={{ justifyContent: 'flex-start', alignItems: 'center', borderBottom: '1px solid #1b1b38' }}
                >
                  <Typography color="#fff" variant="body1" fontSize=".9375rem">
                    Do you want to export all products ?
                  </Typography>
                </Grid>
                <Box
                  component="span"
                  width={1}
                  p={2}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    '& .MuiTextField-root': { width: '100%', pb: 2 },
                    '& .MuiFormControl-root': { pb: 2 },
                    '& .MuiAlert-root': { mb: 2 },
                  }}
                >
                  <Box width={1} display="flex" justifyContent="space-between" alignItems="center">
                    <Button variant="contained" color="secondary" onClick={handleConfirmExportCSVCLick}>
                      Yes
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={(e) => setModal({ ...modal, openExportCSV: false })}
                    >
                      No
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Container>
          </Modal>
        </>
      )}
    </Box>
  );
};
export default ProductPage;
