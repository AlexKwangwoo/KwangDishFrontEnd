/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: getAll_Orders
// ====================================================

export interface getAll_Orders_getAllOrders_orders_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface getAll_Orders_getAllOrders_orders_items_dish {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
}

export interface getAll_Orders_getAllOrders_orders_items_options {
  __typename: "OrderItemOption";
  name: string;
  choice: string | null;
}

export interface getAll_Orders_getAllOrders_orders_items {
  __typename: "OrderItem";
  id: number;
  dish: getAll_Orders_getAllOrders_orders_items_dish;
  options: getAll_Orders_getAllOrders_orders_items_options[] | null;
}

export interface getAll_Orders_getAllOrders_orders {
  __typename: "Order";
  status: OrderStatus;
  id: number;
  total: number | null;
  createdAt: any;
  restaurant: getAll_Orders_getAllOrders_orders_restaurant | null;
  items: getAll_Orders_getAllOrders_orders_items[];
}

export interface getAll_Orders_getAllOrders {
  __typename: "GetOrdersOutput";
  ok: boolean;
  error: string | null;
  orders: getAll_Orders_getAllOrders_orders[] | null;
}

export interface getAll_Orders {
  getAllOrders: getAll_Orders_getAllOrders;
}
