import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Dish } from "../../components/dish";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { restaurant, restaurantVariables } from "../../generated/restaurant";
import { Helmet } from "react-helmet-async";
import { CreateOrderItemInput } from "../../generated/globalTypes";

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
    }
  }
`;

interface IRestaurantParams {
  id: string;
}

export const RestaurantDetail = () => {
  const params = useParams<IRestaurantParams>();
  const { loading, data } = useQuery<restaurant, restaurantVariables>(
    RESTAURANT_QUERY,
    {
      variables: {
        input: {
          restaurantId: +params.id,
          //숫자로 바꿔준다! 숫자로 디비에서 받아주기에..
        },
      },
    }
  );

  const [orderStarted, setOrderStarted] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
  const triggerStartOrder = () => {
    setOrderStarted(true);
  };

  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId);
  };

  const isSelected = (dishId: number) => {
    //여길통해 우리가 클릭한 아이탬과 orderItems에 있다면 true 보여줘서
    //Dish 에 넘겨 테두리 변화 줄것임!
    return Boolean(getItem(dishId));
  };

  const addItemToOrder = (dishId: number) => {
    //선택이 되어있다면 그냥 무시하고 안되있다면 추가해줄것임!
    //여기 메소드는 Dish에서 처리할것임 remove랑!!
    //왜냐하면 isSelected값에 따라 add가 되고 remove가될것이기에.
    if (isSelected(dishId)) {
      return;
    }
    setOrderItems((current) => [{ dishId, options: [] }, ...current]);
  };

  const removeFromOrder = (dishId: number) => {
    setOrderItems((current) =>
      current.filter((dish) => dish.dishId !== dishId)
    );
  };

  const addOptionToItem = (dishId: number, option: any) => {
    if (!isSelected(dishId)) {
      return;
    }
    //중요*************************************
    //추가된 친구를 가져와서 다른곳에 저장을 하고
    //그다음 배열안에서 지울려는걸 지우고
    //추가된 친구 + 다음옵션을 넣어야한다!!!!
    const oldItem = getItem(dishId);
    if (oldItem) {
      // removeFromOrder(dishId);
      // //추가옵션 아이탬이 있다면 기존껄 지워주고!
      // //다시 새로 추가해줄것임!

      // //리액트는 state안에서 mutate하지말고 지우고 새로만드는게
      // //리액트가 더 인식을 잘한다!
      // setOrderItems((current) => [
      //   { dishId, options: [option, ...oldItem.options!] },
      //   //! 느낌표써서 믿어라고 말해줘야 넘어갈수있음!!
      //   ...current,
      // ]);
      const hasOption = Boolean(
        //중복 옵션이 추가되는것을 막아야한다
        //그래서 지금 추가할려는 옵션이 있는지 없는지 체크하자!
        oldItem.options?.find((aOption) => aOption.name == option.name)
      );
      if (!hasOption) {
        removeFromOrder(dishId);
        setOrderItems((current) => [
          { dishId, options: [option, ...oldItem.options!] },
          ...current,
        ]);
      }
    }
  };

  const getOptionFromItem = (
    //선택된 옵션이 배열안에 이미 선택되어있다면 테두리 색을 다르게 해주기위함!
    item: CreateOrderItemInput,
    optionName: string
  ) => {
    return item.options?.find((option) => option.name === optionName);
  };

  const isOptionSelected = (dishId: number, optionName: string) => {
    //optionName에는 현재 화면에 월래 디시가 가지고있는 각각의 옵션이름이 들어있음
    const item = getItem(dishId);
    if (item) {
      //즉 현재 담겨있는 선택된 아이탬들중 내가 선택한 디쉬 아이디를 주고
      // 옵션 한줄이름을 넣어줌 ex)red onion
      //그래서 밑의 식으로 들어가서 옵션의 이름이 내가선택한 디쉬 정보에
      //이미 추가했는지 안했는지와 비교를 하면된다!

      //----즉 내가 선택한 아이탬에서 화면에 있는 옵션들이 선택되어있는지 비교!!
      return Boolean(getOptionFromItem(item, optionName));
    }
  };

  console.log(orderItems);

  return (
    <div>
      <Helmet>
        <title>{data?.restaurant.restaurant?.name || ""} | Nuber Eats</title>
      </Helmet>
      <div
        className=" bg-gray-800 bg-center bg-cover py-48"
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
        }}
      >
        <div className="bg-white w-3/12 py-8 pl-48">
          <h4 className="text-4xl mb-3">{data?.restaurant.restaurant?.name}</h4>
          <h5 className="text-sm font-light mb-2">
            {data?.restaurant.restaurant?.category?.name}
          </h5>
          <h6 className="text-sm font-light">
            {data?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>

      <div className="container pb-32 flex flex-col items-end mt-20">
        <button onClick={triggerStartOrder} className="btn px-10">
          {orderStarted ? "Ordering" : "Start Order"}
        </button>
        <div className="w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
          {data?.restaurant.restaurant?.menu.map((dish, index) => (
            <Dish
              // 디시 추가하고 꺼지는건 좀어려움.. isSeleted는 여기서도 검사를해야한다!
              // add와remove는 넘겨줘서 dish 안에서 판단할수있게 만든다! 클릭시 테두리땜시
              isSelected={isSelected(dish.id)}
              id={dish.id}
              orderStarted={orderStarted}
              key={index}
              name={dish.name}
              description={dish.description}
              price={dish.price}
              isCustomer={true}
              options={dish.options}
              addItemToOrder={addItemToOrder}
              removeFromOrder={removeFromOrder}
            >
              {/* 여기 밑에 쓰는 부분이 children에 Dish컴포넌트에 들어갈것임!! */}
              {dish.options?.map((option, index) => (
                <span
                  onClick={() =>
                    addOptionToItem
                      ? addOptionToItem(dish.id, {
                          name: option.name,
                        })
                      : null
                  }
                  className={`flex border items-center ${
                    isOptionSelected(dish.id, option.name)
                      ? "border-gray-800"
                      : ""
                  }`}
                  key={index}
                >
                  <h6 className="mr-2">{option.name}</h6>
                  <h6 className="text-sm opacity-75">(${option.extra})</h6>
                </span>
              ))}
            </Dish>
          ))}
        </div>
      </div>
    </div>
  );
};