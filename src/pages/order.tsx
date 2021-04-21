import { gql, useMutation, useQuery } from "@apollo/client";
import { useMe } from "../hooks/useMe";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { FULL_ORDER_FRAGMENT } from "../fragments";
import { getOrder, getOrderVariables } from "../generated/getOrder";
import { orderUpdates } from "../generated/orderUpdates";
import { editOrder, editOrderVariables } from "../generated/editOrder";
import { OrderStatus, UserRole } from "../generated/globalTypes";

const GET_ORDER = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const EDIT_ORDER = gql`
  mutation editOrder($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`;

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

interface IParams {
  id: string;
}

export const Order = () => {
  const params = useParams<IParams>();
  const { data: userData } = useMe();
  const [editOrderMutation] = useMutation<editOrder, editOrderVariables>(
    EDIT_ORDER
  );

  //GET_ORDER 쿼리와 subscription을 같이 하기위해subscribeToMore 을 씀
  const { data, subscribeToMore } = useQuery<getOrder, getOrderVariables>(
    //subscribeToMore 는 실시간 해줘야하는걸 늘려준다!! useQuery에서 쓰면됨!
    //
    GET_ORDER,
    {
      variables: {
        input: {
          id: +params.id,
        },
      },
    }
  );

  useEffect(() => {
    if (data?.getOrder.ok) {
      //Order페이지에 들어가면
      //getOrder 가 실행되어 업데이트전 초기화를 먼저 보여준다!
      //그다음 리얼타임이 실시간으로 돌아가면서 오더 넘버의 내용의 업데이트를 주시한다!

      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: {
          input: {
            id: +params.id,
          },
        },
        //updateQuery는 이전의 쿼리 결과와 새로운 subscription data기 필요한
        //함수임!!
        updateQuery: (
          prev,
          //이전쿼리 결과가 있고
          {
            subscriptionData: { data },
          }: //여기가 새로운 업데이트 결과가 들어갈것임!
          //밑에껀 위에꺼의 대한 타입스크립트를 제공한거임!
          //타입을 안써주면 getOrder가 데이터라고 착각한다.. 왜냐하면
          //sub~~ToMore 함수가 getOrder UseQuery에 있기때문이다!
          { subscriptionData: { data: orderUpdates } }
        ) => {
          if (!data) return prev;
          //데이터가 없으면 이전쿼리결과주고(바뀐게없으니 저번내용을 줌!)
          //데이터가 없을 일은없음.. 그냥 만일을 대비해 넣은거임!
          return {
            //있으면 이전쿼리결과 저장하고 새로 업데이트된걸 입혀준다!
            //구조가 똑같아야함!!
            //여기페이지는  {data?.getOrder.order?.restaurant?.name} 이구조임!
            // const { data, subscribeToMore } = useQuery<getOrder, getOrderVariables>(
            //여기서 data(getOrder)에 이 내용들을 넣어줄것임!!
            //그러므로 밑에서 컴포넌트 status가 자동으로 바뀌게 된다!
            getOrder: {
              ...prev.getOrder,
              order: {
                ...data.orderUpdates,
              },
            },
          };
        },
      });
    }
  }, [data]);

  const onButtonClick = (newStatus: OrderStatus) => {
    editOrderMutation({
      variables: {
        input: {
          id: +params.id,
          status: newStatus,
        },
      },
    });
  };

  return (
    <div className="mt-32 container flex justify-center">
      <Helmet>
        <title>Order #{params.id}</title>
      </Helmet>
      <div className="border border-gray-800 w-full pb-4 max-w-screen-sm flex flex-col justify-center">
        <h4 className="bg-gray-800 w-full py-5 text-white text-center text-xl">
          Order #{params.id}
        </h4>
        <h5 className="p-5 pt-10 text-3xl text-center ">
          ${data?.getOrder.order?.total}
        </h5>
        <div className="p-5 text-xl grid gap-6">
          <div className="border-t pt-5 border-gray-700">
            Prepared By :
            <span className="font-medium">
              {data?.getOrder.order?.restaurant?.name}
            </span>
          </div>
          <div className="border-t pt-5 border-gray-700 ">
            Deliver To :
            <span className="font-medium">
              {data?.getOrder.order?.customer?.email}
            </span>
          </div>
          <div className="border-t border-b py-5 border-gray-700">
            Driver :
            <span className="font-medium">
              {data?.getOrder.order?.driver?.email || "Not yet."}
            </span>
          </div>

          {userData?.me.role === UserRole.Client && (
            <span className=" text-center mt-5 text-2xl ">
              Status :
              <span className="text-yellow-500 ml-1">
                {data?.getOrder.order?.status}
              </span>
            </span>
          )}

          {userData?.me.role === UserRole.Owner && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Pending && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Cooking)}
                  className="btn"
                >
                  Accept Order
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.Cooking && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Cooked)}
                  className="btn"
                >
                  Order Cooked
                </button>
              )}
              {data?.getOrder.order?.status !== OrderStatus.Cooking &&
                data?.getOrder.order?.status !== OrderStatus.Pending && (
                  <span className=" text-center mt-5 text-2xl ">
                    Status :
                    <span className="text-yellow-500 ml-1">
                      {data?.getOrder.order?.status}
                    </span>
                  </span>
                )}
            </>
          )}

          {/* 드라이버가 받으면 상태를 바꿀것임! */}
          {userData?.me.role === UserRole.Delivery && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Cooked && (
                <button
                  onClick={() => onButtonClick(OrderStatus.PickedUp)}
                  className="btn"
                >
                  Picked Up
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.PickedUp && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Delivered)}
                  className="btn"
                >
                  Order Delivered
                </button>
              )}
            </>
          )}
          {data?.getOrder.order?.status === OrderStatus.Delivered && (
            <span className=" text-center mb-3 -mt-1 text-lg ">
              Thank you for using
              <span className="text-yellow-400 font-semibold ml-1">
                Kwang Eats..
              </span>
              💕
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
