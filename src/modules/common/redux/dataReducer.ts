import { ActionType, createCustomAction, getType } from 'typesafe-actions';
import { ICountry, IState, IUserCommonRole, IUserDetails } from '../../../models/user';

export interface DataState {
  loadingData: boolean;
  commonsRole?: IUserCommonRole;
  users?: IUserDetails;
  countries?: Array<ICountry>;
  states?: Array<IState>;
  pageInfo: {index:number, count: number}
}

export const setLoadingData = createCustomAction('data/loading', (loading: boolean) => ({
  loading,
}));
export const setCommonsRole = createCustomAction('data/setCommonsRole', (data: IUserCommonRole) => ({
  data,
}));
export const setUsers = createCustomAction('data/setUsers', (data: IUserDetails) => ({
  data,
}));
export const setCountries = createCustomAction('data/setCountries', (data: Array<ICountry>) => ({
  data,
}));
export const setStates = createCustomAction('data/setStates', (data: Array<IState>) => ({
  data,
}));
export const setPageInfo =createCustomAction('data/setPageInfo', (data: {index:number, count: number}) => ({
  data,
}));
const actions = { setLoadingData, setCommonsRole, setUsers, setCountries, setStates, setPageInfo };

type Action = ActionType<typeof actions>;

export default function reducer(state: DataState = { loadingData: false, pageInfo:{index:1, count:25} }, action: Action) {
  switch (action.type) {
    case getType(setLoadingData):
      return { ...state, loadingData: action.loading };
    case getType(setCommonsRole):
      return { ...state, commonsRole: action.data };
    case getType(setUsers):
      return { ...state, users: action.data };
    case getType(setCountries):
      return { ...state, countries: action.data };
    case getType(setStates):
      return { ...state, states: action.data };
    case getType(setPageInfo):
      return {...state, pageInfo: {...action.data}}
    default:
      return state;
  }
}
