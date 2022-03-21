import { validPhoneRegex } from '../../utils';
import * as yup from 'yup';

export const validationCreateUserSchema = yup.object({
  email: yup.string().email('emailInvalid').required('emailRequired'),
  password: yup.string().min(6, 'minPasswordInvalid').required('passwordRequired'),
  confirm_password: yup
    .string()
    .min(6, 'minPasswordInvalid')
    .required('confirmPasswordRequired')
    .oneOf([yup.ref('password')], 'confirmPasswordNotMatch'),
  firstName: yup.string().required('firstNameRequired'),
  lastName: yup.string().required('lastNameRequired'),
  membership_id: yup.string(),
  forceChangePassword: yup.boolean(),
  paymentRailsType: yup
    .string()
    .oneOf(['individual', 'business'], 'paymentRailsTypeInvalid')
    .required('paymentRailsTypeRequired'),
  access_level: yup.string().oneOf(['10', '100'], 'accessLevelInvalid').required('accessLevelRequired'),
  roles: yup.array().required('rolesRequired'),
});
export const validationUpdateUserSchema = yup.object({
  email: yup.string().email('emailInvalid').required('emailRequired'),
  password: yup.string().min(6, 'minPasswordInvalid'),
  confirm_password: yup.string().when('password', (password) => {
    if (!password) {
      return yup.string();
    }
    return yup
      .string()
      .min(6, 'minPasswordInvalid')
      .oneOf([yup.ref('password')], 'confirmPasswordNotMatch')
      .required('confirmPasswordRequired');
  }),
  firstName: yup.string().required('firstNameRequired'),
  lastName: yup.string().required('lastNameRequired'),
  membership_id: yup.string(),
  forceChangePassword: yup.boolean(),
  roles: yup.array().required('rolesRequired'),
  id: yup.string().required('idRequired'),
  status: yup.string().oneOf(['', 'E', 'D', 'U'], 'statusInvalid'),
  statusComment: yup.string(),
});
export const validationCreateAddressUserSchema = yup.object({
  first_name: yup.string().required('firstNameRequired'),
  last_name: yup.string().required('lastNameRequired'),
  id: yup.string(),
  address: yup.string().required('addressRequired'),
  city: yup.string().required('cityRequired'),
  country_code: yup.string().required('countryRequired'),
  is_billing: yup.boolean(),
  is_shipping: yup.boolean(),
  phone: yup.string().matches(validPhoneRegex, 'phoneInvalid').required('phoneRequired'),
  state: yup.string().required('stateRequired'),
  state_code: yup.string().when("state_id", (state) => {
    if(!state){
      return yup.string()
    }
    return yup.string().required('stateCodeRequired')
  }),
  state_id: yup.string(),
  tax: yup.string(),
  zip_code: yup.string().required('zipCodeRequire'),
});
export const validationUpdateAddressUserSchema = yup.object({
  first_name: yup.string().required('firstNameRequired'),
  last_name: yup.string().required('lastNameRequired'),
  id: yup.string().required('idRequired'),
  address: yup.string().required('addressRequired'),
  city: yup.string().required('cityRequired'),
  country_code: yup.string().required('countryRequired'),
  is_billing: yup.boolean(),
  is_shipping: yup.boolean(),
  phone: yup.string().matches(validPhoneRegex, 'phoneInvalid').required('phoneRequired'),
  state: yup.string().required('stateRequired'),
  state_code: yup.string().when("state_id", (state) => {
    if(!state){
      return yup.string()
    }
    return yup.string().required('stateCodeRequired')
  }),
  state_id: yup.string(),
  tax: yup.string(),
  zip_code: yup.string().required('zipCodeRequire'),
});
export const validationUpdateShopSettingsUserSchema = yup.object({
  code: yup.string(),
  companyName: yup.string().required('companyNameRequired'),
  description: yup.string(),
  id: yup.string().required('idRequired'),
  label_id: yup.string().required('labelIdRequired'),
  location: yup.string(),
  path: yup.string().nullable(),
  profile_id: yup.string().required('profileIdRequired'),
  vendor_id: yup.string().required('vendorIdRequired'),
});
export const validationUpdateFinancialUserSchema = yup.object({
  hasSpecialRevshareFeeDst: yup.string(),
  hasSpecialRevshareFeeShipping: yup.string(),
  specialRevshareFeeDst: yup.number().when("hasSpecialRevshareFeeDst", {
    is:"1",
    then:yup.number().moreThan(0, "specialRevshareFeeDstMustBeMoreThanZero")
  }),
  specialRevshareFeeShipping:yup.number().when("hasSpecialRevshareFeeShipping", {
    is:"1",
    then:yup.number().moreThan(0, "specialRevshareFeeShippingMustBeMoreThanZero")
  }),
  us_tax_calculate_for: yup.string(),
  us_tax_states: yup.array(),
});
