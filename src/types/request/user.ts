import { Query } from 'express-serve-static-core';
import { UploadFile, ParamsID } from './base';
export interface UserDetails extends ParamsID {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  photo?: string;
  title?: string;
  zipCode?: string;
  city?: string;
  state?: string;
  country?: string;
  renewAccount?: string;
  newCollection?: string;
}

export interface GetUsers extends Query {
  isArchived: string;
  page: string;
  limit: string;
  orderBy: string;
  order: string;
  search?: string;
}

export interface Pagination {
  offset: number;
  limit: number;
}

export interface changePassword {
  oldPassword: string;
  password: string;
}
export interface TokenUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
  role: string;
}
export interface VerifyHash extends Query {
  hash?: string;
  password?: string;
  email?: string;
  type?: string;
}

export interface SetupAcctProfile extends UploadFile {
  firstName?: string;
  lastName?: string;
  title?: string;
}

export interface DDList extends ParamsID {
  search?: string;
  limit?: string;
  page?: string;
}

export interface BillDetails extends Query {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  isDefault?: string;
}

export interface ChangeEmail {
  newEmail: string;
}

export interface GetUsersReports extends Query {
  id?: string;
  page: string;
  limit: string;
  orderBy: string;
  order: string;
  search?: string;
}

export interface GetUserReport extends Query {
  id?: string;
  page: string;
  limit: string;
  orderBy: string;
  order: string;
}

export interface contactUs {
  name: string;
  email: string;
  message: string;
}
