import { ActionType, createCustomAction, getType } from 'typesafe-actions';
import { IInfoUserDetailAddressBook, IShopSettings } from '../../../models/account';
import { IInfoUserDetail, IUserDetails, IUserFilter } from '../../../models/user';

export interface UserState {
  loadingUserData: boolean;
  users?: IUserDetails;
  infoUserDetail?: IInfoUserDetail;
  pageInfoUser: { index: number; count: number };
  filter?: IUserFilter;
}

export const setLoadingUserData = createCustomAction('user/setLoadingUserData', (loading: boolean) => ({
  loading,
}));

export const setUsers = createCustomAction('user/setUsers', (data: IUserDetails) => ({
  data,
}));
export const setInfoUserDetail = createCustomAction('user/setInfoUserDetail', (data: IInfoUserDetail) => ({
  data,
}));
export const setInfoUserDetailAddressBook = createCustomAction(
  'user/setInfoUserDetailAddressBook',
  (data: Array<IInfoUserDetailAddressBook>) => ({
    data,
  }),
);
export const setInfoUserDetailShopSettings = createCustomAction(
  'user/setInfoUserDetailShopSettings',
  (data: IShopSettings) => ({
    data,
  }),
);
export const setInfoUserDetailFinancialDetail = createCustomAction(
  'user/setInfoUserDetailFinancialDetail',
  (data: IShopSettings) => ({
    data,
  }),
);
export const setPageInfoUser = createCustomAction('user/setPageInfoUser', (data: { index: number; count: number }) => ({
  data,
}));
export const setFilter = createCustomAction('user/setFilter', (data: IUserFilter) => ({
  data,
}));
const actions = {
  setLoadingUserData,
  setUsers,
  setInfoUserDetail,
  setPageInfoUser,
  setInfoUserDetailAddressBook,
  setInfoUserDetailShopSettings,
  setInfoUserDetailFinancialDetail,
  setFilter
};

type Action = ActionType<typeof actions>;

export default function reducer(
  state: UserState = { loadingUserData: false, pageInfoUser: { index: 0, count: 25 } },
  action: Action,
) {
  switch (action.type) {
    case getType(setLoadingUserData):
      return { ...state, loadingUserData: action.loading };

    case getType(setUsers):
      return { ...state, users: action.data };
    case getType(setPageInfoUser):
      return { ...state, pageInfoUser: { ...action.data } };
    case getType(setInfoUserDetail):
      return { ...state, infoUserDetail: { ...action.data } };
    case getType(setInfoUserDetailAddressBook):
      return { ...state, infoUserDetail: { ...state.infoUserDetail, addressBook: [...action.data] } };
    case getType(setInfoUserDetailShopSettings):
      return { ...state, infoUserDetail: { ...state.infoUserDetail, shopSettings: { ...action.data } } };
    case getType(setInfoUserDetailFinancialDetail): 
      return { ...state, infoUserDetail: { ...state.infoUserDetail, financialDetail: { ...action.data } } };
    case getType(setFilter):
      return {...state, filter: {...action.data}}
    default:
      return state;
  }
}
