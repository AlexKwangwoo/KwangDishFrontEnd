/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AddFavoriteRestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: addFavoriteRestaurant
// ====================================================

export interface addFavoriteRestaurant_addFavoriteRestaurant {
  __typename: "AddFavoriteRestaurantOutput";
  ok: boolean;
  error: string | null;
}

export interface addFavoriteRestaurant {
  addFavoriteRestaurant: addFavoriteRestaurant_addFavoriteRestaurant;
}

export interface addFavoriteRestaurantVariables {
  input: AddFavoriteRestaurantInput;
}
