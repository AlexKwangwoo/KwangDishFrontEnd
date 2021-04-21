/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteFavoriteRestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: deleteFavoriteRestaurant
// ====================================================

export interface deleteFavoriteRestaurant_deleteFavoriteRestaurant {
  __typename: "AddFavoriteRestaurantOutput";
  ok: boolean;
  error: string | null;
}

export interface deleteFavoriteRestaurant {
  deleteFavoriteRestaurant: deleteFavoriteRestaurant_deleteFavoriteRestaurant;
}

export interface deleteFavoriteRestaurantVariables {
  input: DeleteFavoriteRestaurantInput;
}
