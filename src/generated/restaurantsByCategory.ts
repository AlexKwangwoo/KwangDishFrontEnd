/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CategoryInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: restaurantsByCategory
// ====================================================

export interface restaurantsByCategory_category_restaurants_category {
  __typename: "Category";
  name: string;
}

export interface restaurantsByCategory_category_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  category: restaurantsByCategory_category_restaurants_category | null;
  address: string;
  isPromoted: boolean;
}

export interface restaurantsByCategory_category {
  __typename: "CategoryOutput";
  ok: boolean;
  error: string | null;
  restaurants: restaurantsByCategory_category_restaurants[] | null;
}

export interface restaurantsByCategory {
  category: restaurantsByCategory_category;
}

export interface restaurantsByCategoryVariables {
  input: CategoryInput;
}
