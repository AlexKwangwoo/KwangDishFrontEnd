import React from "react";
import { restaurant_restaurant_restaurant_menu_options } from "../generated/restaurant";

interface IDishProps {
  id?: number;
  description: string;
  name: string;
  price: number;
  isCustomer?: boolean;
  orderStarted?: boolean;
  options?: restaurant_restaurant_restaurant_menu_options[] | null;
  addItemToOrder?: (dishId: number) => void;
  removeFromOrder?: (dishId: number) => void;
  isSelected?: boolean;
  // addOptionToItem?: (dishId: number, option: any) => void;
}

export const Dish: React.FC<IDishProps> = ({
  id = 0,
  description,
  name,
  price,
  isCustomer = false,
  orderStarted = false,
  options,
  addItemToOrder,
  isSelected,
  removeFromOrder,
  children: dishOptions,

  // addOptionToItem,
}) => {
  const onClick = () => {
    if (orderStarted) {
      //오더 스타트가 된다면!!
      if (!isSelected && addItemToOrder) {
        //선택되어 있지 않다면 추가할것이고
        //선택되어있다면 제거할것임!
        //리턴 하나 안하나 똑같음!
        addItemToOrder(id);
        return;
      }
      if (isSelected && removeFromOrder) {
        return removeFromOrder(id);
      }
    }
  };

  return (
    // restaurantDetail 에서 오더 스타트해야 클릭할수있게됨!
    // 오더 스타트하고 아이탬클릭시 보더가 색깔이생김!
    <div
      className={` px-8 py-4 border cursor-pointer  transition-all ${
        isSelected ? "border-gray-800" : " hover:border-gray-800"
      }`}
    >
      <div className="mb-5">
        <h3 className="text-lg font-medium ">
          {name}
          {orderStarted && (
            <button onClick={onClick}>{isSelected ? "Remove" : "Add"}</button>
          )}
        </h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>${price}</span>
      {isCustomer && options && options?.length !== 0 && (
        <div>
          <h5 className="mt-8 mb-3 font-medium">Dish Options:</h5>
          {dishOptions}
          {/* 컴포넌트 밖에서 만들고 여기로 가져올수도있다! */}
        </div>
      )}
    </div>
  );
};
