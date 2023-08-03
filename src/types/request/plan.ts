import { Query } from 'express-serve-static-core';
export interface PlanDetails extends Query {
  plan?: string;
  opt?: string;
  session_id?: string;
  searchKeyword?: string;
  isCopy?: string;
  id?: string;
}

export interface StripeSignature {
  signature: string;
}

export interface CreateProductDetails extends Query {
  name?: string;
  price?: string;
  currency?: string;
  interval?: string;
  planName?: string;
  priceName?: string;
}
