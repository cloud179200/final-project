import { APIHost } from '../utils/constants';

enum APIService {
  authentication,
  admin,
  vendor,
  public,
}

function getBaseUrl(service: APIService) {
  if (service === APIService.authentication) {
    return `${APIHost}/api/authentication`;
  } else if (service === APIService.admin) {
    return `${APIHost}/apiAdmin`;
  } else if (service === APIService.vendor) {
    return `${APIHost}/apiVendor`;
  } else if (service === APIService.public) {
    return `${APIHost}`;
  }

  return '';
}

export const API_PATHS = {
  signIn: `${getBaseUrl(APIService.authentication)}/login`,
  userProfile: `${getBaseUrl(APIService.public)}/user`,
  brandsList: `${getBaseUrl(APIService.admin)}/brands/list`,
  vendorsList: `${getBaseUrl(APIService.admin)}/vendors/list`,
  commonsRole: `${getBaseUrl(APIService.admin)}/commons/role`,
  commonsCountry: `${getBaseUrl(APIService.admin)}/commons/country`,
  commonsState: `${getBaseUrl(APIService.admin)}/commons/state`,
  profileDetail: `${getBaseUrl(APIService.vendor)}/profile/detail`,
  usersList: `${getBaseUrl(APIService.admin)}/users/list`,
  usersCreate: `${getBaseUrl(APIService.admin)}/users/create`,
  usersEdit: `${getBaseUrl(APIService.admin)}/users/edit`,
  productsCreate: `${getBaseUrl(APIService.admin)}/products/create`,
  productsEdit: `${getBaseUrl(APIService.admin)}/products/edit`,
};
