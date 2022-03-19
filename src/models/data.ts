import { IUserType } from "./user";

export interface ICountry {
  code: string;
  currency_id: string;
  id: string;
  code3: string;
  enabled: number;
  active_currency?: string;
  is_fraudlent: boolean;
  country: string;
}
export interface IState {
  state_id: string;
  country_code: string;
  region_code?: string;
  state: string;
  code: number;
}
export interface IUserCommonRole {
  administrator: Array<IUserType>;
  customer: Array<IUserType>;
}
