import {
  ICreateProductParams,
  ICreateProductValidation,
  IVendor,
  ICategory,
  IBrand,
  ICondition,
  IShipping,
} from '../../models/product';
import { validDateyyyyMMddRegex } from '../../utils';

const validateVendorId = (value: string, vendors: Array<IVendor>) => {
  if (!value) {
    return 'vendorIdRequired';
  }
  if (vendors.length < 1) {
    return 'vendorIdInvalid';
  }
  const isValid = [...vendors].find((item) => item.id === value);
  if (!isValid) {
    return 'vendorIdNotMatch';
  }
  return '';
};
const validateName = (name: string) => {
  if (!name) {
    return 'nameRequire';
  }
  return '';
};
const validateBrandId = (value: string, brands: Array<IBrand>) => {
  if (!value) {
    return 'brandIdRequired';
  }
  if (brands.length < 1) {
    return 'brandIdInvalid';
  }
  const isValid = [...brands].some((item) => item.id === value);
  if (!isValid) {
    return 'brandIdNotMatch';
  }
  return '';
};
const validateConditionId = (value: string, conditions: Array<ICondition>) => {
  if (!value) {
    return 'conditionIdRequired';
  }
  if (conditions.length < 1) {
    return 'conditionIdInvalid';
  }
  const isValid = [...conditions].some((item) => item.id === value);
  if (!isValid) {
    return 'conditionIdNotMatch';
  }
  return '';
};
const validateCategories = (value: Array<number>, categories: Array<ICategory>) => {
  if (value.length < 1) {
    return 'categoriesRequired';
  }
  if (categories.length < 1) {
    return 'categoriesInvalid';
  }
  const cloneValue = [...value];
  const cloneCategories = [...categories];
  cloneValue.forEach((id) => {
    const isValid = cloneCategories.some((item) => +item.id === id);
    if (!isValid) {
      return 'categoriesIdNotMatch';
    }
  });
  return '';
};
const validateDescription = (value: string) => {
  if (!value) {
    return 'descriptionRequired';
  }
  return '';
};
const validateEnable = (value: number) => {
  if ([0, 1].indexOf(value) === -1) {
    return 'enableInvalid';
  }
  return '';
};
const validateMemberships = (value: Array<number>) => {
  return '';
};
const validateShippingToZones = (value: Array<{ id: number; price: string }>, shippings: Array<IShipping>) => {
  if (value.length < 1) {
    return 'shippingToZonesRequired';
  }
  if (shippings.length < 1) {
    return 'shippingToZonesInvalid';
  }
  const cloneValue = [...value];
  const cloneShippings = [...shippings];

  const isHaveUS = cloneValue.some((item) => item.id === 1);
  if (!isHaveUS) {
    return 'shippingToZonesInvalid';
  }
  cloneValue.forEach((v) => {
    const isValid = cloneShippings.some((item) => +item.id === v.id);
    if (!isValid) {
      return 'shippingToZonesInvalid';
    }
    if (!v.price) {
      return 'shippingPriceRequire';
    }
  });
  return '';
};
const validateTaxExempt = (value: number) => {
  if ([0, 1].indexOf(value) === -1) {
    return 'taxExemptInvalid';
  }
  return '';
};
const validatePrice = (value: string) => {
  if (!value) {
    return 'priceRequire';
  }
  if (+value <= 0) {
    return 'priceMustGreaterThanZero';
  }
  return '';
};
const validateSalePriceType = (value: string) => {
  if (!value) {
    return 'salePriceTypeRequired';
  }
  if (['$', '%'].indexOf(value) === -1) {
    return 'salePriceTypeInvalid';
  }
  return '';
};
const validateSalePrice = (value: string, sale_price_type: string) => {
  validateSalePriceType(sale_price_type);
  if (!value && sale_price_type && true) {
    return 'salePriceRequire';
  }
  return '';
};
const validateArrivalDate = (value: string) => {
  if (!value) {
    return 'arrivalDateRequired';
  }
  if (!validDateyyyyMMddRegex.test(value)) {
    return 'arrivalDateInvalid';
  }
  return '';
};
const validateQuantity = (value: string) => {
  if (!value) {
    return 'quantityRequired';
  }
  if(+value <= 0){
    return "quantityMustGreaterThanZero"
  }
  return '';
};
const validateOgTagsType = (value: string) => {
  if (!value) {
    return 'ogTagsTypeRequired';
  }
  if (['0', '1'].indexOf(value) === -1) {
    return 'ogTagsTypeInvalid';
  }
  return '';
};
const validateMetaDescriptionType = (value: string) => {
  if (!value) {
    return 'metaDescriptionTypeRequired';
  }
  if (['A', 'C'].indexOf(value) === -1) {
    return 'metaDescriptionTypeInvalid';
  }
  return '';
};
const validateFacebookMarketingEnabled = (value: number) => {
  if ([0, 1].indexOf(value) === -1) {
    return 'facebookMarketingEnabledInvalid';
  }
  return '';
};
const validateGoogleFeedEnabled = (value: number) => {
  if ([0, 1].indexOf(value) === -1) {
    return 'googleFeedEnabledInvalid';
  }
  return '';
};
const validateImageOrder = (value: Array<string>) => {
  if(value.length < 1){
    return "imageRequired"
  }
  return ""
}
export const validateCreateProduct = (
  values: ICreateProductParams,
  vendors: Array<IVendor>,
  categories: Array<ICategory>,
  conditions: Array<ICondition>,
  brands: Array<IBrand>,
  shippings: Array<IShipping>,
): ICreateProductValidation => {
  return {
    vendor_id: validateVendorId(values.vendor_id, vendors),
    name: validateName(values.name),
    brand_id: validateBrandId(values.brand_id, brands),
    condition_id: validateConditionId(values.condition_id, conditions),
    categories: validateCategories(values.categories, categories),
    description: validateDescription(values.description),
    enabled: validateEnable(values.enabled),
    memberships: validateMemberships(values.memberships),
    shipping_to_zones: validateShippingToZones(values.shipping_to_zones, shippings),
    tax_exempt: validateTaxExempt(values.tax_exempt),
    price: validatePrice(values.price),
    sale_price_type: validateSalePriceType(values.sale_price_type),
    arrival_date: validateArrivalDate(values.arrival_date),
    inventory_tracking: '',
    quantity: validateQuantity(values.quantity),
    sku: '',
    participate_sale: '',
    sale_price: validateSalePrice(values.sale_price, values.sale_price_type),
    og_tags_type: validateOgTagsType(values.og_tags_type),
    og_tags: '',
    meta_desc_type: validateMetaDescriptionType(values.meta_desc_type),
    meta_description: '',
    meta_keywords: '',
    product_page_title: '',
    facebook_marketing_enabled: validateFacebookMarketingEnabled(values.facebook_marketing_enabled),
    google_feed_enabled: validateGoogleFeedEnabled(values.google_feed_enabled),
    imagesOrder: validateImageOrder(values.imagesOrder),
    deleted_images: '',
  };
};
export const validCreateProduct = (values: ICreateProductValidation) => {
  for (const [, value] of Object.entries(values)) {
    if (value) {
      return false;
    }
  }
  return true;
};
export const validateUpdateProduct = (
  values: ICreateProductParams,
  vendors: Array<IVendor>,
  categories: Array<ICategory>,
  conditions: Array<ICondition>,
  brands: Array<IBrand>,
  shippings: Array<IShipping>,
): ICreateProductValidation => {
  return {
    vendor_id: validateVendorId(values.vendor_id, vendors),
    name: validateName(values.name),
    brand_id: validateBrandId(values.brand_id, brands),
    condition_id: validateConditionId(values.condition_id, conditions),
    categories: validateCategories(values.categories, categories),
    description: validateDescription(values.description),
    enabled: validateEnable(values.enabled),
    memberships: validateMemberships(values.memberships),
    shipping_to_zones: validateShippingToZones(values.shipping_to_zones, shippings),
    tax_exempt: validateTaxExempt(values.tax_exempt),
    price: validatePrice(values.price),
    sale_price_type: validateSalePriceType(values.sale_price_type),
    arrival_date: validateArrivalDate(values.arrival_date),
    inventory_tracking: '',
    quantity: validateQuantity(values.quantity),
    sku: '',
    participate_sale: '',
    sale_price: validateSalePrice(values.sale_price, values.sale_price_type),
    og_tags_type: validateOgTagsType(values.og_tags_type),
    og_tags: '',
    meta_desc_type: validateMetaDescriptionType(values.meta_desc_type),
    meta_description: '',
    meta_keywords: '',
    product_page_title: '',
    facebook_marketing_enabled: validateFacebookMarketingEnabled(values.facebook_marketing_enabled),
    google_feed_enabled: validateGoogleFeedEnabled(values.google_feed_enabled),
    imagesOrder: validateImageOrder(values.imagesOrder),
    deleted_images: '',
  };
};
export const validUpdateProduct = (values: ICreateProductValidation) => {
  for (const [, value] of Object.entries(values)) {
    if (value) {
      return false;
    }
  }
  return true;
};