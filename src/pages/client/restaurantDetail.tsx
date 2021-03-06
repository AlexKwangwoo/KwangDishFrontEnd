import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Dish } from "../../components/dish";
import { DishOption } from "../../components/dish-option";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { restaurant, restaurantVariables } from "../../generated/restaurant";
import { Helmet } from "react-helmet-async";
import { CreateOrderItemInput } from "../../generated/globalTypes";
import { createOrder, createOrderVariables } from "../../generated/createOrder";
import {
  faAddressBook,
  faGrinHearts,
  faHeartbeat,
  faHeartBroken,
  faListAlt,
  faPizzaSlice,
  faShoppingBasket,
  faStarHalfAlt,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-awesome-modal";
import { useMe } from "../../hooks/useMe";

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

const ADD_FAVORITE_RESTAURANT = gql`
  mutation addFavoriteRestaurant($input: AddFavoriteRestaurantInput!) {
    addFavoriteRestaurant(input: $input) {
      ok
      error
    }
  }
`;

const DELETE_FAVORITE_RESTAURANT = gql`
  mutation deleteFavoriteRestaurant($input: DeleteFavoriteRestaurantInput!) {
    deleteFavoriteRestaurant(input: $input) {
      ok
      error
    }
  }
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
      orderId
    }
  }
`;

interface IRestaurantParams {
  id: string;
}

export const RestaurantDetail = () => {
  const [visible, setVisible] = useState(false);
  const [like, setLike] = useState<boolean>();
  const { data: userData } = useMe();
  const params = useParams<IRestaurantParams>();

  useEffect(() => {
    if (userData !== undefined) {
      if (userData.me.favorite) {
        const favoriteNow = userData.me.favorite;
        const newFavoriteNow = favoriteNow.filter(
          (restaurant) => restaurant.id === +params.id
        );
        if (newFavoriteNow.length === 0) {
          setLike(false);
        } else {
          setLike(true);
        }
      }
    }
  }, []);

  const openModal = () => {
    console.log(visible);
    setVisible(true);
  };
  const closeModal = () => {
    setVisible(false);
  };

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
  const [orderItemPrice, setOrderItemPrice] = useState<number>();
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

  const addItemToOrder = (dishId: number, name: string) => {
    //선택이 되어있다면 그냥 무시하고 안되있다면 추가해줄것임!
    //여기 메소드는 Dish에서 처리할것임 remove랑!!
    //왜냐하면 isSelected값에 따라 add가 되고 remove가될것이기에.
    if (isSelected(dishId)) {
      return;
    }
    setOrderItems((current) => [{ dishId, name, options: [] }, ...current]);
  };

  const removeFromOrder = (dishId: number) => {
    setOrderItems((current) =>
      current.filter((dish) => dish.dishId !== dishId)
    );
  };

  const addOptionToItem = (
    dishId: number,
    name: string,
    optionName: string
  ) => {
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
        oldItem.options?.find((aOption) => aOption.name == optionName)
      );
      if (!hasOption) {
        removeFromOrder(dishId);
        setOrderItems((current) => [
          {
            dishId,
            name,
            options: [{ name: optionName }, ...oldItem.options!],
          },
          ...current,
        ]);
      }
    }
  };

  const removeOptionFromItem = (
    dishId: number,
    name: string,
    optionName: string
  ) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      removeFromOrder(dishId);
      //ex 위에서 복사해두고 옵션 두개 가지고 있는걸 지운다!!
      //복사한것에서 옵션만 하나지우고 다시 원래 배열에 넣어준다!
      setOrderItems((current) => [
        {
          dishId,
          name,
          options: oldItem.options?.filter(
            (option) => option.name !== optionName
          ),
        },
        //가지고 있던거 넣기!
        ...current,
      ]);
      return;
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
    return false;
  };

  const triggerCancelOrder = () => {
    setOrderStarted(false);
    setOrderItems([]);
  };
  const history = useHistory();
  const onCompleted = (data: createOrder) => {
    const {
      createOrder: { ok, orderId },
    } = data;
    if (data.createOrder.ok) {
      history.push(`/orders/${orderId}`);
    }
  };
  const [createOrderMutation, { loading: placingOrder }] = useMutation<
    createOrder,
    createOrderVariables
  >(CREATE_ORDER_MUTATION, {
    onCompleted,
  });

  const [addFavoriteRestaurant, { loading: likeLoading }] = useMutation(
    ADD_FAVORITE_RESTAURANT
  );

  const [deleteFavoriteRestaurant, { loading: unLikeLoading }] = useMutation(
    DELETE_FAVORITE_RESTAURANT
  );

  // const itemTotal =()=>{
  //   orderItems.map((item)=>(item.))
  // }

  const triggerConfirmOrder = () => {
    if (placingOrder) {
      return;
    }
    if (orderItems.length === 0) {
      alert("Can't place empty order");
      return;
    }
    const ok = window.confirm("You are about to place an order");
    if (ok) {
      createOrderMutation({
        variables: {
          input: {
            restaurantId: +params.id,
            items: orderItems,
          },
        },
      });
    }
  };

  const likeButton = () => {
    addFavoriteRestaurant({
      variables: {
        input: {
          restaurantId: +params.id,
        },
      },
    });
    setLike(true);
  };

  const unLikeButton = () => {
    deleteFavoriteRestaurant({
      variables: {
        input: {
          restaurantId: +params.id,
        },
      },
    });
    setLike(false);
  };

  console.log("orderItems", orderItems);
  return (
    <div>
      <Helmet>
        <title>{data?.restaurant.restaurant?.name || ""} | KwangDish</title>
      </Helmet>
      <div
        className=" bg-gray-800 bg-center bg-cover h-80 mt-10 shadow-inner flex items-end"
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
        }}
      >
        <div className="text-white max-w-screen-2xl mx-auto w-full pb-4">
          <div className="max-w-sm bg-gray-700 bg-opacity-50 pl-4 py-4">
            {/* className="xl:w-3/12 pl-10 pt-40 sm:py-8 sm:pl-48" */}
            <h4 className="text-4xl font-semibold mb-3 mx-auto">
              {data?.restaurant.restaurant?.name}
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-md font-semibold mb-2">
                  <FontAwesomeIcon
                    icon={faPizzaSlice}
                    className="text-sm mr-2 text-yellow-600"
                  />
                  Category : {data?.restaurant.restaurant?.category?.name}
                </h5>
                <h6 className="text-md font-semibold">
                  <FontAwesomeIcon
                    icon={faAddressBook}
                    className="text-sm mr-2 text-green-700"
                  />
                  Address : {data?.restaurant.restaurant?.address}
                </h6>
              </div>
              <div className=" w-11 h-11 mr-2 mt-4 flex justify-center">
                {like ? (
                  <FontAwesomeIcon
                    icon={faHeartbeat}
                    className="text-2xl text-white mt-5 cursor-pointer"
                    onClick={() => unLikeButton()}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="text-2xl text-white mt-5 cursor-pointer"
                    onClick={() => likeButton()}
                  />
                )}
                {/* <FontAwesomeIcon
                  icon={faThumbsUp}
                  className="text-2xl text-white mt-5 cursor-pointer"
                  onClick={() => likeButton()}
                />
                <FontAwesomeIcon
                  icon={faThumbsDown}
                  className="text-2xl text-white mt-5 cursor-pointer"
                  onClick={() => unLikeButton()}
                /> */}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="w-full h-10 bg-gradient-to-t from-black to-gray-200"></div> */}
      </div>

      <div className="container pb-32 flex flex-col mt-20">
        {!orderStarted && (
          <div>
            <button onClick={triggerStartOrder} className="btn px-10">
              Start Order
            </button>
          </div>
        )}
        {orderStarted && (
          <div className="flex justify-between items-start">
            <span className="text-xs">
              <button onClick={openModal} className="btn px-10">
                Check Order List
              </button>

              <Modal
                visible={visible}
                width="350"
                height="420"
                effect="fadeInUp"
                onClickAway={() => closeModal()}
              >
                <div className="p-4">
                  <div className="flex justify-center items-center mb-4">
                    <div className="text-2xl font-semibold mr-2">
                      Your Order List
                    </div>
                    <FontAwesomeIcon
                      icon={faShoppingBasket}
                      className="text-xl mt-1 text-yellow-500"
                    />
                  </div>
                  {orderItems.map((dish, index) => (
                    <div key={index} className="mb-2">
                      <div className="text-lg ">{dish.name}</div>

                      {dish.options !== null &&
                        dish.options !== undefined &&
                        dish.options.map((option, index) => (
                          <div key={index} className="text-base">
                            - {option.name}
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </Modal>
            </span>
            <div className="flex flex-col md:flex-none">
              <button
                onClick={triggerConfirmOrder}
                className="btn px-4 mb-4 w-48"
              >
                Confirm Order
              </button>
              <button
                onClick={triggerCancelOrder}
                className="w-48 text-lg font-medium focus:outline-none text-white py-4  transition-colors bg-red-500 hover:bg-red-600 px-4"
              >
                Cancel Order
              </button>
            </div>
          </div>
        )}
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
              photo={dish.photo}
            >
              {/* 여기 밑에 쓰는 부분이 children에 Dish컴포넌트에 들어갈것임!! */}
              {dish.options?.map((option, index) => (
                <DishOption
                  key={index}
                  name={dish.name}
                  dishId={dish.id}
                  isSelected={isOptionSelected(dish.id, option.name)}
                  optionName={option.name}
                  extra={option.extra}
                  addOptionToItem={addOptionToItem}
                  removeOptionFromItem={removeOptionFromItem}
                />
              ))}
            </Dish>
          ))}
        </div>
      </div>
    </div>
  );
};
