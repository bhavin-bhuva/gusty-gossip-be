import {
  suggestionSearch,
  productDownload,
  productEdit,
  popularProducts,
  downloadSvg,
  downloadPng,
  exmplDownload,
  SearchRelativePro,
} from './product';
import {
  getUpdateUser,
  changePassword,
  loginUser,
  register,
  socialAuth,
  getVerifyEmail,
  downloadHistory,
  getSetPassword,
  listUsers,
  getSetupAcctProfile,
  getEmailByHash,
  getForgotPassword,
  getCountriesList,
  getStatesList,
  getCitiesList,
  getLoggedUser,
  getBillingAddrsUser,
  getLoggedUserAddrs,
  getUpdateEmailLink,
  getUpdateEmail,
  getInviteEmail,
  getArchiveUser,
  getListInvoices,
  reportList,
  userReport,
  getUnArchiveUser,
  contactUs,
} from './users';
import { getCreateProductStripe, getIconPurchase, getPlanSubscribe, getPlanUnsubscribe, plansList } from './plan';
import { categoryList } from './category';
import { tagList } from './tag';
import { getCreateProduct, searchProducts, ulistProducts } from './uproducts';

const paths = {
  '/services/register': {
    post: register,
  },
  '/services/login': {
    post: loginUser,
  },
  '/services/social-login': {
    post: socialAuth,
  },
  '/user/change-password': {
    put: changePassword,
  },
  '/user/update': {
    put: getUpdateUser,
  },
  '/services/suggestion-search': {
    get: suggestionSearch,
  },
  '/services/verify-email': {
    post: getVerifyEmail,
  },
  '/services/forgot-password': {
    post: getForgotPassword,
  },
  '/services/set-password': {
    post: getSetPassword,
  },
  '/user/setup-account': {
    put: getSetupAcctProfile,
  },
  '/product/download/{id}': {
    get: productDownload,
  },
  '/services/product-edit': {
    put: productEdit,
  },
  '/user/download-history': {
    get: downloadHistory,
  },
  '/user/contact-us': {
    post: contactUs,
  },
  '/user/list': {
    get: listUsers,
  },
  '/services/product-popular': {
    get: popularProducts,
  },
  '/services/get-email/{hash}': {
    get: getEmailByHash,
  },
  '/services/plan-list': {
    get: plansList,
  },
  '/services/categoryDD-List': {
    get: categoryList,
  },
  '/services/tagDD-List': {
    get: tagList,
  },
  '/services/DDlist-countries': {
    get: getCountriesList,
  },
  '/services/DDlist-states': {
    get: getStatesList,
  },
  '/services/DDlist-cities': {
    get: getCitiesList,
  },
  '/user': {
    get: getLoggedUser,
  },
  '/services/download-svg/{id}': {
    get: downloadSvg,
  },
  '/services/download-png/{id}': {
    get: downloadPng,
  },
  '/user/billing-addrs': {
    post: getBillingAddrsUser,
  },
  '/user/get-addrs': {
    get: getLoggedUserAddrs,
  },
  '/plan/subscribe': {
    get: getPlanSubscribe,
  },
  '/user/update-email': {
    post: getUpdateEmailLink,
  },
  '/services/new-email': {
    post: getUpdateEmail,
  },
  '/services/download-example': {
    get: exmplDownload,
  },
  '/services/search': {
    get: searchProducts,
  },
  '/services/relative-product': {
    get: SearchRelativePro,
  },
  '/plan/unsubscribe': {
    get: getPlanUnsubscribe,
  },
  '/plan/purchase/{id}': {
    get: getIconPurchase,
  },
  '/user/invite': {
    post: getInviteEmail,
  },
  '/product/list': {
    get: ulistProducts,
  },
  '/user/archive/{id}': {
    delete: getArchiveUser,
  },
  '/user/invoice': {
    get: getListInvoices,
  },
  '/plan/product/create': {
    post: getCreateProductStripe,
  },
  '/user/reportList': {
    get: reportList,
  },
  '/product/create': {
    post: getCreateProduct,
  },
  '/user/report/{id}': {
    get: userReport,
  },
  '/user/unarchive/{id}': {
    put: getUnArchiveUser,
  },
};

export default paths;
