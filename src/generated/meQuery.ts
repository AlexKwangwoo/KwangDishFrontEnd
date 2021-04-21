/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserRole } from "./globalTypes";

// ====================================================
// GraphQL query operation: meQuery
// ====================================================

export interface meQuery_me_favorite_category {
  __typename: "Category";
  name: string;
}

export interface meQuery_me_favorite {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  category: meQuery_me_favorite_category | null;
  address: string;
}

export interface meQuery_me {
  __typename: "User";
  id: number;
  email: string;
  role: UserRole;
  verified: boolean;
  favorite: meQuery_me_favorite[] | null;
}

export interface meQuery {
  me: meQuery_me;
}
