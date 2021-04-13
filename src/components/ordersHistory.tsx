import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { trimText } from "../utils";
import { OrderDetailModal } from "./orderDetailModal";
import Modal from "react-awesome-modal";
import { useMe } from "../hooks/useMe";
import {
  faBell,
  faList,
  faPen,
  faPlus,
  faReceipt,
  faSearch,
  faShoppingBasket,
  faWalking,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router";
import { UserRole } from "../generated/globalTypes";

const GETORDERS_QUERY = gql`
  query getOrders($input: GetOrdersInput!) {
    getOrders(input: $input) {
      ok
      error
      orders {
        status
        id
        total
        createdAt
        restaurant {
          name
        }
        items {
          id
          dish {
            id
            name
            price
          }
          options {
            name
            choice
          }
        }
      }
    }
  }
`;

const GETALLORDERS_QUERY = gql`
  query getAllOrders {
    getAllOrders {
      ok
      error
      orders {
        status
        id
        total
        createdAt
        restaurant {
          name
        }
        items {
          id
          dish {
            id
            name
            price
          }
          options {
            name
            choice
          }
        }
      }
    }
  }
`;

// interface IDishOptionProps {
//   isSelected: boolean;
//   name: string;
//   optionName: string;
//   extra?: number | null;
//   dishId: number;
//   addOptionToItem: (dishId: number, name: string, optionName: string) => void;
//   removeOptionFromItem: (
//     dishId: number,
//     name: string,
//     optionName: string
//   ) => void;
// }

export const OrdersHistory = () => {
  const { data: userData } = useMe();

  const { loading: allOrdersLoading, data: allOrdersData } = useQuery(
    GETALLORDERS_QUERY
  );

  const { loading, data } = useQuery(GETORDERS_QUERY, {
    variables: {
      input: {
        status: "Pending",
        //숫자로 바꿔준다! 숫자로 디비에서 받아주기에..
      },
    },
  });

  const { loading: pickedUpLoading, data: pickedUpData } = useQuery(
    GETORDERS_QUERY,
    {
      variables: {
        input: {
          status: "PickedUp",
          //숫자로 바꿔준다! 숫자로 디비에서 받아주기에..
        },
      },
    }
  );

  const { loading: deliveredLoading, data: deliveredData } = useQuery(
    GETORDERS_QUERY,
    {
      variables: {
        input: {
          status: "Delivered",
          //숫자로 바꿔준다! 숫자로 디비에서 받아주기에..
        },
      },
    }
  );

  const [orderItems, setOrderItems] = useState();
  const [orderTotal, setOrderTotal] = useState();
  const [orderStatus, setOrderStatus] = useState();
  const history = useHistory();
  const [visible, setVisible] = useState(false);

  const openModal = (order) => {
    setOrderItems(order.items);
    setOrderTotal(order.total);
    setOrderStatus(order.status);
    console.log(orderItems);
    if (order == null) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  };

  const gotoReceiptPage = (orderId) => {
    history.push(`/orders/${orderId}`);
  };

  const closeModal = () => {
    setVisible(false);
  };

  console.log("AllOrdersData", allOrdersData);
  return (
    <div>
      {allOrdersData?.getAllOrders &&
        data?.getOrders &&
        deliveredData?.getOrders &&
        pickedUpData?.getOrders && (
          <div className="w-full max-w-screen-2xl mx-auto">
            <div className="text-xl mt-32 mb-2 font-semibold lg:w-3/5 w-full mx-auto">
              <FontAwesomeIcon
                icon={faWalking}
                className="text-lg mt-1 text-lime-600 mr-2"
              />
              {userData?.me.role === UserRole.Client && (
                <span>Your Order On Progress</span>
              )}
              {userData?.me.role === UserRole.Owner && (
                <span>Your Client Order On Progress</span>
              )}
              {userData?.me.role === UserRole.Delivery && (
                <span>Your Deliver Order On Progress</span>
              )}
            </div>
            <table className="lg:w-3/5 w-full mb-12 text-sm md:text-base table-fixed border rounded-md border-collapse: collapse border-black mx-auto">
              <thead className=" text-center border border-black">
                <tr className="bg-gray-700 text-white">
                  <th className="w-1/5 border border-black">Order ID</th>
                  <th className="w-1/5 border border-black">Status</th>
                  <th className="w-1/5 border border-black">Price</th>
                  <th className="w-1/5 border border-black">Date</th>
                  <th className="w-1/5 border border-black">Detail</th>
                  <th className="w-1/5 border border-black">Order Page</th>
                </tr>
              </thead>
              <tbody>
                {allOrdersData.getAllOrders.orders.map((order, index) => (
                  <tr
                    key={index}
                    className={`border border-black text-center ${
                      index % 2 == 1 ? "bg-yellow-300" : ""
                    }`}
                  >
                    <td className="border border-black">{order.id}</td>
                    <td className="border border-black">{order.status}</td>
                    <td className="border border-black">$ {order.total}</td>
                    <td className="border border-black">
                      {trimText(order.createdAt, 10)}
                    </td>
                    <td className="border border-black">
                      <FontAwesomeIcon
                        icon={faSearch}
                        className="text-lg ml-1 mt-1 text-gray-500 cursor-pointer"
                        onClick={() => openModal(order)}
                      />
                    </td>
                    <td className="border border-black">
                      <FontAwesomeIcon
                        icon={faReceipt}
                        className="text-lg mt-1 text-gray-500 cursor-pointer"
                        onClick={() => gotoReceiptPage(order.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-xl mt-20 mb-2 font-semibold lg:w-3/5 w-full mx-auto">
              <FontAwesomeIcon
                icon={faBell}
                className="text-lg mt-1 text-yellow-500 mr-2"
              />
              Your Completed Orders
            </div>
            <table className="lg:w-3/5 w-full mb-12 text-sm md:text-base table-fixed border rounded-md border-collapse: collapse border-black mx-auto">
              <thead className=" text-center border border-black">
                <tr className="bg-gray-700 text-white">
                  <th className="w-1/5 border border-black">Order ID</th>
                  <th className="w-1/5 border border-black">Status</th>
                  <th className="w-1/5 border border-black">Price</th>
                  <th className="w-1/5 border border-black">Date</th>
                  <th className="w-1/5 border border-black">Detail</th>
                  <th className="w-1/5 border border-black">Order Page</th>
                </tr>
              </thead>
              <tbody>
                {deliveredData?.getOrders?.orders.map((order, index) => (
                  <tr
                    key={index}
                    className={`border border-black text-center ${
                      index % 2 == 1 ? "bg-blue-200" : ""
                    }`}
                  >
                    <td className="border border-black">{order.id}</td>
                    <td className="border border-black">{order.status}</td>
                    <td className="border border-black">$ {order.total}</td>
                    <td className="border border-black">
                      {trimText(order.createdAt, 10)}
                    </td>
                    <td className="border border-black">
                      <FontAwesomeIcon
                        icon={faSearch}
                        className="text-lg ml-1 mt-1 text-gray-500 cursor-pointer"
                        onClick={() => openModal(order)}
                      />
                    </td>
                    <td className="border border-black">
                      <FontAwesomeIcon
                        icon={faReceipt}
                        className="text-lg mt-1 text-gray-500 cursor-pointer"
                        onClick={() => gotoReceiptPage(order.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      <Modal
        visible={visible}
        width="350"
        height="420"
        effect="fadeInUp"
        onClickAway={() => closeModal()}
      >
        {orderItems && (
          <div>
            {orderItems && (
              <div className="p-4">
                <div className="flex flex-col justify-center items-center mb-4">
                  <div>
                    <div className="text-2xl font-semibold mr-2">
                      Your Order List
                      <FontAwesomeIcon
                        icon={faShoppingBasket}
                        className="text-xl ml-2 mt-1 text-yellow-500"
                      />
                    </div>
                  </div>
                  <div className="text-base font-semibold mr-2">
                    Order status :
                    <span className="text-yellow-700 ml-1">{orderStatus}</span>
                  </div>
                </div>
                {orderItems !== undefined &&
                  // @ts-ignore: Object is possibly 'null'.
                  orderItems.map((item, index) => (
                    <div key={index} className="mb-2 font-normal">
                      <div className="text-lg ">
                        {index + 1} - {item.dish.name} : ${item.dish.price}
                      </div>
                      {item.options !== null &&
                        item.options !== undefined &&
                        item.options.map((option, index) => (
                          <div key={index} className="text-sm ml-7">
                            <FontAwesomeIcon
                              icon={faPlus}
                              className="text-sm text-lime-500 mr-2"
                            />
                            {option.name}(...$)
                          </div>
                        ))}
                    </div>
                  ))}
                <div className="text-center font-semibold mx-auto mt-6 rounded-lg bg-gray-800 text-white">
                  Total Price - ${orderTotal}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
