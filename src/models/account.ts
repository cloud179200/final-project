export interface IAccountDetail {
    income: number;
    expense: number;
    earning: number;
    order_as_buyer: number;
    order_as_buyer_total: number;
    products_total: number;
    profile_id: string;
    default_card_id: string;
    taxExempt: number;
    paymentRailsType?: string;
    paymentRailsId?: string;
    firstName: string;
    lastName: string;
    email: string;
    access_level: string;
    joined: string;
    first_login: string;
    last_login: string;
    status: string;
    membership_id?: string;
    pending_membership_id?: string;
    language: string;
    forceChangePassword: string;
    referer: string;
    statusComment: string;
    roles: Array<string>;
    companyName?: string;
    vendor_id: string;
  }
  export interface IUpdateUserParams {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    confirm_password: string;
    membership_id: string;
    forceChangePassword: number;
    taxExempt: number;
    id: string;
    roles: Array<string>;
    status: string;
    statusComment: string;
  }
  export interface IUpdateUserValidation {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    confirm_password: string;
    membership_id: string;
    forceChangePassword: string;
    taxExempt: string;
    id: string;
    roles: string;
    status: string;
    statusComment: string;
  }
  export interface IInfoUserDetailAddressBook {
    id: string;
    address: string;
    city: string;
    country_code: string;
    first_name: string;
    is_billing: number;
    is_shipping: number;
    last_name: string;
    phone: string;
    state: string;
    state_code: string;
    state_id: string;
    tax: string;
    zip_code: string;
  }
  export interface IInfoUserDetailAddressBookValidation {
    id: string;
    address: string;
    city: string;
    country_code: string;
    first_name: string;
    is_billing: string;
    is_shipping: string;
    last_name: string;
    phone: string;
    state: string;
    state_code: string;
    state_id: string;
    tax: string;
    zip_code: string;
  }
  export interface IShopSetting {
    code: string;
    companyName: string;
    description: string;
    id: string;
    label_id: string;
    location: string;
    path: string;
    profile_id: string;
    vendor_id: string;
  }
  export interface IShopSettingValidation {
    code: string;
    companyName: string;
    description: string;
    id: string;
    label_id: string;
    location: string;
    path: string;
    profile_id: string;
    vendor_id: string;
  }
  