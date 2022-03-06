import { DateRange } from "@mui/lab";

export interface AuthToken {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface IUser {
  profile_id: string;
  login: string;
  firstName?: string;
  lastName?: string;
  dateOfLoginAttempt?: string;
  countOfLoginAttempts?: string;
  forceChangePassword?: string;
  token: string;
}
export interface IUserFilter {
  search: string;
  memberships:Array<string>;
  types: Array<string>;
  status: string;
  country: string;
  state: string;
  address: string;
  phone: string;
  date_type: string;
  date_range: DateRange<Date>;
  sort: string;
  order_by: 'ASC' | 'DESC';
  tz: number;
}
export interface IUserCommonRole {
  administrator: Array<IUserType>;
  customer: Array<IUserType>;
}
export interface IUserType {
  id: string;
  enabled?: string;
  name: string;
}
export interface IUserDetails{
  recordsTotal: number;
    recordsFiltered: number;
    detail: Array<IUserDetail>
}
export interface IUserDetail {
  profile_id: string;
  vendor: string;
  fistName: string;
  lastName: string;
  created: string;
  last_login: string;
  access_level: string;
  vendor_id: string;
  storeName: string | null;
  product: number;
  order: {
    order_as_buyer: number;
    order_as_buyer_total: number;
  };
  wishlist: number;
}
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
