import { ActionType, createCustomAction, getType } from 'typesafe-actions';
import { IProducts, ICategory, IBrand, IVendor, ICondition, IShipping, IProductDetail } from '../../../models/product';

export interface ProductState {
  loadingProductData: boolean;
  products?: IProducts;
  categories?: Array<ICategory>;
  brands?: Array<IBrand>;
  vendors?: Array<IVendor>;
  conditions?: Array<ICondition>;
  shippings?: Array<IShipping>;
  pageInfoProduct: { index: number; count: number };
  productDetail?: IProductDetail;
}

export const setLoadingProductData = createCustomAction('product/setLoadingProductData', (loading: boolean) => ({
  loading,
}));
export const setPageInfoProduct = createCustomAction(
  'product/setPageInfoProduct',
  (data: { index: number; count: number }) => ({
    data,
  }),
);
export const setProducts = createCustomAction('product/setProducts', (data: IProducts) => ({
  data,
}));
export const setCategories = createCustomAction('product/setCategories', (data: Array<ICategory>) => ({
  data,
}));
export const setBrands = createCustomAction('product/setBrands', (data: Array<IBrand>) => ({
  data,
}));
export const setVendors = createCustomAction('product/setVendors', (data: Array<IVendor>) => ({
  data,
}));
export const setConditions = createCustomAction('product/setConditions', (data: Array<ICondition>) => ({
  data,
}));
export const setShippings = createCustomAction('product/setShippings', (data: Array<IShipping>) => ({
  data,
}));
export const setProductDetail = createCustomAction('product/setProductDetail', (data: IProductDetail) => ({
  data,
}));
const actions = {
  setLoadingProductData,
  setPageInfoProduct,
  setProducts,
  setCategories,
  setBrands,
  setVendors,
  setConditions,
  setShippings,
  setProductDetail,
};

type Action = ActionType<typeof actions>;

export default function reducer(
  state: ProductState = { loadingProductData: false, pageInfoProduct: { index: 1, count: 25 } },
  action: Action,
) {
  switch (action.type) {
    case getType(setLoadingProductData):
      return { ...state, loadingProductData: action.loading };
    case getType(setPageInfoProduct):
      return { ...state, pageInfoProduct: { ...action.data } };
    case getType(setProducts):
      return { ...state, products: { ...action.data } };
    case getType(setCategories):
      return { ...state, categories: [...action.data] };
    case getType(setVendors):
      const newVendors = [...action.data];
      if (newVendors.length > 0) {
        if (newVendors[0].name === 'Administrator') {
          newVendors[0].id = '-1';
        }
      }
      return { ...state, vendors: newVendors };
    case getType(setBrands):
      const newBrands = [...action.data];
      if (newBrands.length > 0) {
        if (newBrands[0].name === 'None') {
          newBrands[0].id = '-1';
        }
      }
      return { ...state, brands: [...action.data] };
    case getType(setConditions):
      const newConditions = [...action.data];
      if (newConditions.length > 0) {
        if (newConditions[0].name === 'None') {
          newConditions[0].id = '-1';
        }
      }
      return { ...state, conditions: newConditions };
    case getType(setShippings):
      return { ...state, shippings: [...action.data] };
    case getType(setProductDetail):
      return { ...state, productDetail: { ...action.data } };
    default:
      return state;
  }
}
