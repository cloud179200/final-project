import { ActionType, createCustomAction, getType } from 'typesafe-actions';
import { ICountry, IState, IUserCommonRole } from '../../../models/data';

export interface DataState {
  loadingData: boolean;
  countries?: Array<ICountry>;
  states?: Array<IState>;
  commonsRole?: IUserCommonRole;
}

export const setLoadingData = createCustomAction('data/loading', (loading: boolean) => ({
  loading,
}));
export const setCountries = createCustomAction('data/setCountries', (data: Array<ICountry>) => ({
  data,
}));
export const setStates = createCustomAction('data/setStates', (data: Array<IState>) => ({
  data,
}));
export const setCommonsRole = createCustomAction('data/setCommonsRole', (data: IUserCommonRole) => ({
  data,
}));
const actions = {
  setLoadingData,
  setCountries,
  setStates,
  setCommonsRole,
};

type Action = ActionType<typeof actions>;

export default function reducer(state: DataState = { loadingData: false }, action: Action) {
  switch (action.type) {
    case getType(setLoadingData):
      return { ...state, loadingData: action.loading };
    case getType(setCountries):
      return { ...state, countries: action.data };
    case getType(setStates):
      return { ...state, states: action.data };
    case getType(setCommonsRole):
      return { ...state, commonsRole: action.data };
    default:
      return state;
  }
}
