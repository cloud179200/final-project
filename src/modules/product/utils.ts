import {
  ICreateProductParams,
  ICreateProductValidation,
  IVendor,
  ICategory,
  IBrand,
  ICondition,
  IShipping,
} from '../../models/product';
import { validDateyyyyMMddRegex, validNameRegex, validNumberWithDecimalRegex } from '../../utils';
import * as yup from 'yup';
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
  if (+value <= 0) {
    return 'quantityMustGreaterThanZero';
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
  if (value.length < 1) {
    return 'imageRequired';
  }
  return '';
};
export const validationCreateProductSchema = (
  vendors: Array<IVendor>,
  categories: Array<ICategory>,
  conditions: Array<ICondition>,
  brands: Array<IBrand>,
  shippings: Array<IShipping>,
) => {
  return yup.object({
    vendor_id: yup
      .string()
      .oneOf(
        [...vendors].map((item) => item.id),
        'vendorIdInvalid',
      )
      .required('vendorIdRequired'),
    name: yup.string().matches(validNameRegex, 'nameInvalid').required('nameRequired'),
    brand_id: yup
      .string()
      .oneOf(
        [...brands].map((item) => item.id),
        'brandIdInvalid',
      )
      .required('brandIdRequired'),
    condition_id: yup
      .string()
      .oneOf(
        [...conditions].map((item) => item.id),
        'conditionIdInvalid',
      )
      .required('conditionIdRequired'),
    categories: yup
      .array()
      .of(
        yup.number().oneOf(
          [...categories].map((item) => +item.id),
          'categoriesInvalid',
        ),
      )
      .min(1, 'categoriesRequired'),
    description: yup.string().required('descriptionRequired'),
    enabled: yup.boolean(),
    memberships: yup.array().of(yup.string()),
    shipping_to_zones: yup
      .array()
      .of(
        yup.object().shape({
          id: yup.number().oneOf([1, ...[...shippings].map((item) => +item.id)], 'shippingToZoneIdInvalid'),
          price: yup.string().matches(validNumberWithDecimalRegex, 'shippingToZonePriceInvalid'),
        }),
      )
      .min(1, 'shippingToZonesInvalid'),
    tax_exempt: yup.boolean(),
    price: yup.number().moreThan(0, 'priceMustGreaterThanZero').required('priceRequired'),
    sale_price_type: yup.string().oneOf(['$', '%'], 'salePriceTypeInvalid').required('salePriceTypeRequired'),
    arrival_date: yup.string().matches(validDateyyyyMMddRegex, 'arrivalDateInvalid').required('arrivalDateRequired'),
    inventory_tracking: yup.number(),
    quantity: yup.number().moreThan(0, 'quantityMustGreaterThanZero').required('quantityRequired'),
    sku: yup.string(),
    participate_sale: yup.string(),
    sale_price: yup.string().matches(validNumberWithDecimalRegex, 'salePriceInvalid'),
    og_tags_type: yup.string().oneOf(['0', '1'], 'ogTagsTypeInvalid').required('ogTagsTypeRequired'),
    og_tags: yup.string(),
    meta_desc_type: yup
      .string()
      .oneOf(['A', 'C'], 'ometaDescriptionTypeInvalid')
      .required('metaDescriptionTypeRequired'),
    meta_description: yup.string(),
    meta_keywords: yup.string(),
    product_page_title: yup.string(),
    facebook_marketing_enabled: yup.boolean(),
    google_feed_enabled: yup.boolean(),
    imagesOrder: yup.array().of(yup.string()).min(1, 'imageRequired'),
    deleted_images: yup.array().of(yup.string()),
  });
};
export const validationUpdateProductSchema = (
  vendors: Array<IVendor>,
  categories: Array<ICategory>,
  conditions: Array<ICondition>,
  brands: Array<IBrand>,
  shippings: Array<IShipping>,
) => {
  return yup.object({
    vendor_id: yup
      .string()
      .oneOf(
        [...vendors].map((item) => item.id),
        'vendorIdInvalid',
      )
      .required('vendorIdRequired'),
    name: yup.string().matches(validNameRegex, 'nameInvalid').required('nameRequired'),
    brand_id: yup
      .string()
      .oneOf(
        [...brands].map((item) => item.id),
        'brandIdInvalid',
      )
      .required('brandIdRequired'),
    condition_id: yup
      .string()
      .oneOf(
        [...conditions].map((item) => item.id),
        'conditionIdInvalid',
      )
      .required('conditionIdRequired'),
    categories: yup
      .array()
      .of(
        yup.number().oneOf(
          [...categories].map((item) => +item.id),
          'categoriesInvalid',
        ),
      )
      .min(1, 'categoriesRequired'),
    description: yup.string().required('brandIdRequired'),
    enabled: yup.boolean(),
    memberships: yup.array().of(yup.string()),
    shipping_to_zones: yup
      .array()
      .of(
        yup.object().shape({
          id: yup.number().oneOf([1, ...[...shippings].map((item) => +item.id)], 'shippingToZoneIdInvalid'),
          price: yup.string().matches(validNumberWithDecimalRegex, 'shippingToZonePriceInvalid'),
        }),
      )
      .min(1, 'shippingToZonesInvalid'),
    tax_exempt: yup.boolean(),
    price: yup.number().moreThan(0, 'priceMustGreaterThanZero').required('priceRequired'),
    sale_price_type: yup.string().oneOf(['$', '%'], 'salePriceTypeInvalid').required('salePriceTypeRequired'),
    arrival_date: yup.string().matches(validDateyyyyMMddRegex, 'arrivalDateInvalid').required('arrivalDateRequired'),
    inventory_tracking: yup.number(),
    quantity: yup.number().moreThan(0, 'quantityMustGreaterThanZero').required('quantityRequired'),
    sku: yup.string(),
    participate_sale: yup.string(),
    sale_price: yup.string().matches(validNumberWithDecimalRegex, 'salePriceInvalid'),
    og_tags_type: yup.string().oneOf(['0', '1'], 'ogTagsTypeInvalid').required('ogTagsTypeRequired'),
    og_tags: yup.string(),
    meta_desc_type: yup
      .string()
      .oneOf(['A', 'C'], 'ometaDescriptionTypeInvalid')
      .required('metaDescriptionTypeRequired'),
    meta_description: yup.string(),
    meta_keywords: yup.string(),
    product_page_title: yup.string(),
    facebook_marketing_enabled: yup.boolean(),
    google_feed_enabled: yup.boolean(),
    imagesOrder: yup.array().of(yup.string()).min(1, 'imageRequired'),
    deleted_images: yup.array().of(yup.string()),
    id: yup.string().required('idRequired'),
  });
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
