import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faBicycle,
  faCaretLeft,
  faChevronCircleLeft,
  faMap,
  faMapMarkedAlt,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";

interface IRestaurantProps {
  id: string;
  coverImg: string;
  name: string;
  categoryName?: string;
}

export const RestaurantMoving: React.FC<IRestaurantProps> = ({
  id,
  coverImg,
  name,
  categoryName,
}) => (
  <Link to={`/restaurants/${id}`}>
    <div className="h-24 w-64 max-w-xs bg-white mt-20 shadow-lg rounded-md">
      <div className="p-2 flex ">
        <div
          style={{ backgroundImage: `url(${coverImg})` }}
          className="bg-cover bg-center h-20 w-20"
        ></div>
        <div className="ml-4">
          <h3 className="text-sm font-semibold">{name}</h3>
          <span className="border-t mt-2 py-2 text-xs opacity-50 border-gray-400">
            {categoryName}
          </span>
        </div>
      </div>
    </div>
    <div className="h-12 w-8 border-r-2 border-white border-dashed  ml-30"></div>
    <div className="h-16 w-10 ml-30 pl-4 mt-2">
      <FontAwesomeIcon
        icon={faMapMarkedAlt}
        className="text-2xl text-black cursor-pointer"
      />
    </div>
  </Link>
);
