import { IInfoUserDetailAddressBook, IInfoUserDetailAddressBookValidation, IUpdateUserParams, IUpdateUserValidation } from '../../models/account';
import { ICreateUserParams, ICreateUserValidation} from '../../models/user';
import { validEmailRegex, validPhoneRegex } from '../../utils';

const validateEmail = (email: string) => {
  if (!email) {
    return 'emailRequire';
  }

  if (!validEmailRegex.test(email)) {
    return 'emailInvalid';
  }

  return '';
};

const validatePassword = (password: string) => {
  if (!password) {
    return 'passwordRequire';
  }

  if (password.length < 6) {
    return 'minPasswordInvalid';
  }

  return '';
};
const validateConfirmPassword = (password: string, confirm_password: string) => {
  if (!confirm_password) {
    return 'confirmPasswordRequire';
  }
  if (confirm_password.length < 6) {
    return 'minPasswordInvalid';
  }
  if (confirm_password !== password) {
    return 'confirmPasswordNotMatch';
  }
  return '';
};
const validateFirstName = (firstName: string) => {
  if (!firstName) {
    return 'firstNameRequire';
  }
  return '';
};
const validateLastName = (lastName: string) => {
  if (!lastName) {
    return 'lastNameRequire';
  }
  return '';
};
const validateMembershipId = (membership_id: string) => {
  if (!membership_id) {
    return 'membershipIdRequire';
  }
  return '';
};
const validateForceChangePassword = (forceChangePassword: number) => {
  return '';
};
const validateTaxExempt = (taxExempt: number) => {
  return '';
};
const validatePaymentRailsType = (paymentRailsType: string) => {
  if (!paymentRailsType) {
    return 'paymentRailsTypeRequire';
  }
  return '';
};
const validateAccessLevel = (access_level: string) => {
  if (!access_level) {
    return 'accessLevelRequire';
  }
  return '';
};
const validateRoles = (roles: Array<string>) => {
  return '';
};
export const validateCreateUser = (values: ICreateUserParams): ICreateUserValidation => {
  return {
    email: validateEmail(values.email),
    firstName: validateFirstName(values.firstName),
    lastName: validateLastName(values.lastName),
    password: validatePassword(values.password),
    confirm_password: validateConfirmPassword(values.password, values.confirm_password),
    membership_id: validateMembershipId(values.membership_id),
    taxExempt: validateTaxExempt(values.taxExempt),
    forceChangePassword: validateForceChangePassword(values.forceChangePassword),
    paymentRailsType: validatePaymentRailsType(values.paymentRailsType),
    access_level: validateAccessLevel(values.access_level),
    roles: validateRoles(values.roles),
  };
};

export const validCreateUser = (values: ICreateUserValidation) => {
  for (const [, value] of Object.entries(values)) {
    if (value) {
      return false;
    }
  }
  return true;
};
const validatePasswordForUpdate = (password: string) => {
  if (!password) {
    return '';
  }

  if (password.length < 6) {
    return 'minPasswordInvalid';
  }

  return '';
};
const validateConfirmPasswordForUpdate = (password: string, confirm_password: string) => {
  if (!confirm_password) {
    if(!password){
      return '';
    }
  }
  if (confirm_password.length < 6) {
    return 'minPasswordInvalid';
  }
  if (confirm_password !== password) {
    return 'confirmPasswordNotMatch';
  }
  return '';
};
const validateId = (id: string) => {
  if(!id){
    return 'idRequire';
  }
  return '';
}
const validateStatus = (status:string) => {
  if(["", "E", "D", "U"].indexOf(status) === -1){
    return "statusInvalid"
  }
  return '';
}
const validateStatusComment = (statusComment: string) => {
  return ''
}
export const validateUpdateUser = (values: IUpdateUserParams): IUpdateUserValidation => {
  return {
    email: validateEmail(values.email),
    firstName: validateFirstName(values.firstName),
    lastName: validateLastName(values.lastName),
    password: validatePasswordForUpdate(values.password),
    confirm_password: validateConfirmPasswordForUpdate(values.password, values.confirm_password),
    membership_id: validateMembershipId(values.membership_id),
    forceChangePassword: validateForceChangePassword(values.forceChangePassword),
    taxExempt: validateTaxExempt(values.taxExempt),
    id: validateId(values.id),
    roles: validateRoles(values.roles),
    status: validateStatus(values.status),
    statusComment: validateStatusComment(values.statusComment)
  };
};
export const validUpdateUser = (values: IUpdateUserValidation) => {
  for (const [, value] of Object.entries(values)) {
    if (value) {
      return false;
    }
  }
  return true;
}
const validateAddress = (address: string) => {
  if(!address){
    return "addressRequire"
  }
  return ""
}
const validateCity = (city: string) => {
  if(!city){
    return "cityRequire"
  }
  return ""
}
const validateCountry = (country_code: string) => {
  if(!country_code){
    return "countryRequire"
  }
  return ""
}
const validateState = (state: string, state_id:string) => {
  if(!state || !state_id){
    return "stateRequire"
  }
  return ""
}
const validatePhone = (phone:string) => {
  if(!phone){
    return "phoneRequire"
  }
  if(!validPhoneRegex.test(phone)){
    return "phoneInvalid"
  }
  return ""
}
const validateZipCode = (zipCode:string) => {
  if(!zipCode){
    return "zipCodeRequire"
  }
  return ""
}
export const validateCreateAddress = (values: IInfoUserDetailAddressBook): IInfoUserDetailAddressBookValidation => {
  return {
    id: "",
    address: validateAddress(values.address),
    city: validateCity(values.city),
    country_code: validateCountry(values.country_code),
    first_name: validateFirstName(values.first_name),
    is_billing: "",
    is_shipping: "",
    last_name: validateLastName(values.last_name),
    phone: validatePhone(values.phone),
    state: validateState(values.state, values.state_id),
    state_code: validateState(values.state, values.state_id),
    state_id: validateState(values.state, values.state_id),
    tax: "",
    zip_code: validateZipCode(values.zip_code)
  }
}
export const validCreateAddress = (values: IInfoUserDetailAddressBookValidation) => {
  for (const [, value] of Object.entries(values)) {
    if (value) {
      return false;
    }
  }
  return true;
}
export const validateUpdateAddress = (values: IInfoUserDetailAddressBook): IInfoUserDetailAddressBookValidation => {
  return {
    id: validateId(values.id),
    address: validateAddress(values.address),
    city: validateCity(values.city),
    country_code: validateCountry(values.country_code),
    first_name: validateFirstName(values.first_name),
    is_billing: "",
    is_shipping: "",
    last_name: validateLastName(values.last_name),
    phone: validatePhone(values.phone),
    state: validateState(values.state, values.state_id),
    state_code: validateState(values.state, values.state_id),
    state_id: validateState(values.state, values.state_id),
    tax: "",
    zip_code: validateZipCode(values.zip_code)
  }
}
export const validUpdateAddress = (values: IInfoUserDetailAddressBookValidation) => {
  for (const [, value] of Object.entries(values)) {
    if (value) {
      return false;
    }
  }
  return true;
}