/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: getAllOrders
// ====================================================

export interface getAllOrders_getAllOrders_orders_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface getAllOrders_getAllOrders_orders_items_dish {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
}

export interface getAllOrders_getAllOrders_orders_items_options {
  __typename: "OrderItemOption";
  name: string;
  choice: string | null;
}

export interface getAllOrders_getAllOrders_orders_items {
  __typename: "OrderItem";
  id: number;
  dish: getAllOrders_getAllOrders_orders_items_dish;
  options: getAllOrders_getAllOrders_orders_items_options[] | null;
}

export interface getAllOrders_getAllOrders_orders {
  __typename: "Order";
  status: OrderStatus;
  id: number;
  total: number | null;
  createdAt: any;
  restaurant: getAllOrders_getAllOrders_orders_restaurant | null;
  items: getAllOrders_getAllOrders_orders_items[];
}

export interface getAllOrders_getAllOrders {
  __typename: "GetOrdersOutput";
  ok: boolean;
  error: string | null;
  orders: getAllOrders_getAllOrders_orders[] | null;
}

export interface getAllOrders {
  getAllOrders: getAllOrders_getAllOrders;
}
