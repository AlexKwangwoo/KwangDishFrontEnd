/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetOrdersInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: getOrders
// ====================================================

export interface getOrders_getOrders_orders_items_dish {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
}

export interface getOrders_getOrders_orders_items_options {
  __typename: "OrderItemOption";
  name: string;
  choice: string | null;
}

export interface getOrders_getOrders_orders_items {
  __typename: "OrderItem";
  id: number;
  dish: getOrders_getOrders_orders_items_dish;
  options: getOrders_getOrders_orders_items_options[] | null;
}

export interface getOrders_getOrders_orders {
  __typename: "Order";
  id: number;
  total: number | null;
  items: getOrders_getOrders_orders_items[];
}

export interface getOrders_getOrders {
  __typename: "GetOrdersOutput";
  ok: boolean;
  error: string | null;
  orders: getOrders_getOrders_orders[] | null;
}

export interface getOrders {
  getOrders: getOrders_getOrders;
}

export interface getOrdersVariables {
  input: GetOrdersInput;
}
