export interface IProducts {
  recordsTotal: number;
  recordsFiltered: number;
  detail: Array<IProduct>;
}
export interface IProduct {
  amount: string;
  arrivalDate: string;
  category: string;
  condition: string;
  created: string;
  description: string;
  enabled: string;
  id: string;
  name: string;
  participateSale: string;
  price: string;
  sku: string;
  vendor: string;
  vendorID: string;
  weight: string;
}
export interface ICreateProductParams {
  vendor_id: string;
  name: string;
  brand_id: string;
  condition_id: string;
  categories: Array<number>;
  description: string;
  enabled: number;
  memberships: Array<number>;
  shipping_to_zones: Array<{ id: number; price: string }>;
  tax_exempt: number;
  price: string;
  sale_price_type: string;
  arrival_date: string;
  inventory_tracking: number;
  quantity: string;
  sku: string;
  participate_sale: string;
  sale_price: string;
  og_tags_type: string;
  og_tags: string;
  meta_desc_type: string;
  meta_description: string;
  meta_keywords: string;
  product_page_title: string;
  facebook_marketing_enabled: number;
  google_feed_enabled: number;
  imagesOrder: Array<string>;
  deleted_images: Array<string>;
}
export interface ICreateProductValidation {
  vendor_id: string;
  name: string;
  brand_id: string;
  condition_id: string;
  categories: string;
  description: string;
  enabled: string;
  memberships: string;
  shipping_to_zones: string;
  tax_exempt: string;
  price: string;
  sale_price_type: string;
  arrival_date: string;
  inventory_tracking: string;
  quantity: string;
  sku: string;
  participate_sale: string;
  sale_price: string;
  og_tags_type: string;
  og_tags: string;
  meta_desc_type: string;
  meta_description: string;
  meta_keywords: string;
  product_page_title: string;
  facebook_marketing_enabled: string;
  google_feed_enabled: string;
  imagesOrder: string;
  deleted_images: string;
}
export interface IProductFilter {
  search: string;
  category: string;
  stock_status: string;
  availability: string;
  vendor: any;
  sort: string;
  order_by: 'ASC' | 'DESC';
  search_type: string;
}
export interface ICategory {
  id: string;
  name: string;
  parentId: string;
  path: string;
  pos: string;
}
export interface IBrand {
  id: string;
  name: string;
}
export interface IVendor {
  companyName: string;
  id: string;
  login: string;
  name: string;
}
export interface ICondition {
  id: string;
  name: string;
}
export interface IShipping {
  id: string;
  name: string;
}
export interface IProductDetail {
  arrival_date: string;
  brand_id: string;
  categories: Array<{ category_id: string; name: string }>;
  cleanURL: string;
  code: string;
  condition_id: string;
  description: string;
  enabled: string;
  facebook_marketing_enabled: string;
  google_feed_enabled: string;
  id: string;
  images: Array<{ file: string; id: string; thumbs: Array<string> }>;
  inventory_tracking: string;
  memberships: Array<string>;
  meta_desc_type: string;
  meta_description: string;
  meta_keywords: string;
  name: string;
  og_tags: string;
  og_tags_type: string;
  participate_sale: string;
  price: string;
  product_page_title: string;
  quantity: string;
  sale_price: string;
  sale_price_type: string;
  shipping:Array<{ id: string, zone_name: string, price: string }>;
  sku: string;
  sort_description: string;
  tax_exempt: string;
  vendor_id: string;
  weight: string;
}
export interface IUpdateProductParams {
  vendor_id: string;
  name: string;
  brand_id: string;
  condition_id: string;
  categories: Array<number>;
  description: string;
  enabled: number;
  memberships: Array<number>;
  shipping_to_zones: Array<{ id: number; price: string }>;
  tax_exempt: number;
  price: string;
  sale_price_type: string;
  arrival_date: string;
  inventory_tracking: number;
  quantity: string;
  sku: string;
  participate_sale: string;
  sale_price: string;
  og_tags_type: string;
  og_tags: string;
  meta_desc_type: string;
  meta_description: string;
  meta_keywords: string;
  product_page_title: string;
  facebook_marketing_enabled: number;
  google_feed_enabled: number;
  imagesOrder: Array<string>;
  deleted_images: Array<string>;
  id:string;
}
export interface IUpdateProductValidation {
  vendor_id: string;
  name: string;
  brand_id: string;
  condition_id: string;
  categories: string;
  description: string;
  enabled: string;
  memberships: string;
  shipping_to_zones: string;
  tax_exempt: string;
  price: string;
  sale_price_type: string;
  arrival_date: string;
  inventory_tracking: string;
  quantity: string;
  sku: string;
  participate_sale: string;
  sale_price: string;
  og_tags_type: string;
  og_tags: string;
  meta_desc_type: string;
  meta_description: string;
  meta_keywords: string;
  product_page_title: string;
  facebook_marketing_enabled: string;
  google_feed_enabled: string;
  imagesOrder: string;
  deleted_images: string;
}