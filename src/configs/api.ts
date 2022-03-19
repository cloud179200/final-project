import { APIHost } from '../utils/constants';

enum APIService {
  authentication,
  admin,
  vendor,
  normal,
  public,
  export
}

function getBaseUrl(service: APIService) {
  if (service === APIService.authentication) {
    return `${APIHost}/api/authentication`;
  } else if (service === APIService.admin) {
    return `${APIHost}/apiAdmin`;
  } else if (service === APIService.vendor) {
    return `${APIHost}/apiVendor`;
  } else if (service === APIService.normal) {
    return `${APIHost}/api`;
  } else if (service === APIService.export) {
    return `${APIHost}/apiExport`;
  } else if (service === APIService.public) {
    return `${APIHost}`;
  }

  return '';
}

export const API_PATHS = {
  signIn: `${getBaseUrl(APIService.authentication)}/login`,
  userProfile: `${getBaseUrl(APIService.public)}/user`,
  categoriesList: `${getBaseUrl(APIService.normal)}/categories/list`,
  brandsList: `${getBaseUrl(APIService.admin)}/brands/list`,
  vendorsList: `${getBaseUrl(APIService.admin)}/vendors/list`,
  conditionsList: `${getBaseUrl(APIService.admin)}/conditions/list`,
  shippingsList: `${getBaseUrl(APIService.admin)}/shipping/list`,
  commonsRole: `${getBaseUrl(APIService.admin)}/commons/role`,
  commonsCountry: `${getBaseUrl(APIService.admin)}/commons/country`,
  commonsState: `${getBaseUrl(APIService.admin)}/commons/state`,
  profileDetail: `${getBaseUrl(APIService.vendor)}/profile/detail`,
  detailShopSettings: `${getBaseUrl(APIService.vendor)}/profile/detail.shop.setting`,
  detailShopSettingsEdit: `${getBaseUrl(APIService.vendor)}/profile/detail.shop.setting.edit`,
  detailFinancial: `${getBaseUrl(APIService.vendor)}/profile/detail.financial.detail`,
  detailFinancialEdit: `${getBaseUrl(APIService.vendor)}/profile/detail.financial.edit`,
  wishlist: `${getBaseUrl(APIService.admin)}/users/wishlist`,
  listcard: `${getBaseUrl(APIService.admin)}/users/listcard`,
  payoutLink: `${getBaseUrl(APIService.vendor)}/profile/payout.link`,
  addressBook: `${getBaseUrl(APIService.admin)}/users/address.book`,
  addressBookDelete: `${getBaseUrl(APIService.admin)}/users/address.book.delete`,
  addressBookEdit: `${getBaseUrl(APIService.admin)}/users/address.book.edit`,
  usersList: `${getBaseUrl(APIService.admin)}/users/list`,
  usersCreate: `${getBaseUrl(APIService.admin)}/users/create`,
  usersEdit: `${getBaseUrl(APIService.admin)}/users/edit`,
  productsList: `${getBaseUrl(APIService.normal)}/products/list`,
  productDetail:`${getBaseUrl(APIService.admin)}/products/detail`,
  productsCreate: `${getBaseUrl(APIService.admin)}/products/create`,
  productsEdit: `${getBaseUrl(APIService.admin)}/products/edit`,
  productsExport:`${getBaseUrl(APIService.export)}/export/products`,
  exportDownload:`${getBaseUrl(APIService.export)}/export/download`,
  uploadImageFile:`${getBaseUrl(APIService.normal)}/products/upload-image`
};
