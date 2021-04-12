import React from "react";
import { restaurant_restaurant_restaurant_menu_options } from "../generated/restaurant";

interface IDishProps {
  id?: number;
  description: string;
  name: string;
  price: number;
  photo: string | null;
  isCustomer?: boolean;
  orderStarted?: boolean;
  options?: restaurant_restaurant_restaurant_menu_options[] | null;
  addItemToOrder?: (dishId: number, name: string) => void;
  removeFromOrder?: (dishId: number) => void;
  isSelected?: boolean;
  // addOptionToItem?: (dishId: number, option: any) => void;
}

export const Dish: React.FC<IDishProps> = ({
  id = 0,
  description,
  name,
  price,
  photo,
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
        addItemToOrder(id, name);
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
      className={` px-8 py-4 border cursor-pointer flex justify-between transition-all ${
        isSelected ? "border-gray-800" : " hover:border-gray-800"
      }`}
    >
      <div className="mb-5 w-3/5">
        <div className="mb-5">
          <h3 className="text-lg font-medium flex items-center ">
            {orderStarted && (
              <button
                className={`mr-3 py-1 px-3 focus:outline-none text-sm  text-white ${
                  isSelected ? "bg-red-500" : " bg-lime-600"
                }`}
                onClick={onClick}
              >
                {isSelected ? "Remove" : "Add"}
              </button>
            )}
            {name}
          </h3>
          <h4 className="font-medium">{description}</h4>
        </div>
        <span>${price}</span>

        {isCustomer && options && options?.length !== 0 && (
          <div>
            <h5 className="mt-8 mb-3 font-medium">Dish Options:</h5>
            <div className="grid gap-2  justify-start">{dishOptions}</div>
            {/* 컴포넌트 밖에서 만들고 여기로 가져올수도있다!! */}
          </div>
        )}
      </div>
      <div className="h-40 w-40">
        {photo !== null && (
          <img src={photo} alt="dishpic" className="h-40 w-40"></img>
        )}
      </div>
    </div>
  );
};
