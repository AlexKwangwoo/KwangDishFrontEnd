import React from "react";
import { useMe } from "../hooks/useMe";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalculator,
  faHeart,
  faQuestion,
  faSignOutAlt,
  faTicketAlt,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { LOCALSTORAGE_TOKEN } from "../constants";

export const ModalDetail = () => {
  const { data: userData } = useMe();
  const editProfileButton = () => {
    // history.push({
    //   pathname: "/edit-profile",
    // });
    window.location.assign("/edit-profile");
  };

  const checkOrdersButton = () => {
    // history.push({
    //   pathname: "/edit-profile",
    // });
    window.location.assign("/ordersHistory");
  };
  const onClickLoggedOut = () => {
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    window.location.assign("/");
    //리로드하면서 루트페이지로 가게해준다!
  };
  const checkFavoriteRestaurantsButton = () => {
    // history.push({
    //   pathname: "/edit-profile",
    // });
    window.location.assign("/favoriteRestaurants");
  };

  return (
    <div className="mx-auto p-6 shadow-inner">
      <div className="w-full border-yellow-400">
        <div className="flex items-center">
          <div
            className="w-14 h-14 bg-cover rounded-full"
            style={{
              backgroundImage: `url(https://d1w2poirtb3as9.cloudfront.net/default.jpeg?Expires=1617790282&Signature=PUcV36PlF6hPVd4X6eJaUwmrNHU~hDIZfgZt3~prJPhC6xa5eOI3qerkgO0Obm4-PVXAq1lWeSY6CmDqU2aL6cIojEMT5hv80EmPL7O3I6NCpjqgQy6Jppf7xiLyn-YKvVUvYOhK11btUhpf80Fyot9S4FAbBzzMh0TnRs~NrZmTbGe5AajLcHX1MI35JKKKhA7ZwSls027enD8t-wth4YcEMCSDjFzbgq8-1a8yRpVGLerZSRCnhaJRNmJnxgdxaxFcDgPX8vbQ~k0FZMJSuShBhUKy8m5GwMoqE5hRREOb94tXz0MvChajHg9kjCEEmM-XRNiusr8kowTZMnQMxQ__&Key-Pair-Id=APKAJSDH2OZQQSA64LQQ)`,
            }}
          ></div>
          <div className="ml-4 text-base font-semibold">
            <div>{userData?.me?.email}</div>
            <button
              className="text-yellow-500 font-semibold focus:outline-none"
              onClick={() => editProfileButton()}
            >
              View account
            </button>
          </div>
        </div>
        <div className="flex items-center mt-8">
          <div className="w-6 ">
            <FontAwesomeIcon
              icon={faCalculator}
              className="text-xl cursor-pointer"
              onClick={() => checkOrdersButton()}
            />
          </div>
          <div
            onClick={() => checkOrdersButton()}
            className="text-base font-semibold ml-2 cursor-pointer"
          >
            Orders
          </div>
        </div>
        <div className="flex items-center mt-6">
          <div className="w-6">
            <FontAwesomeIcon
              icon={faHeart}
              className="text-xl cursor-pointer"
              onClick={() => checkFavoriteRestaurantsButton()}
            />
          </div>
          <div
            onClick={() => checkFavoriteRestaurantsButton()}
            className="text-base font-semibold ml-2 cursor-pointer"
          >
            Favorites
          </div>
        </div>
        <div className="flex items-center mt-6">
          <div className="w-6">
            <FontAwesomeIcon
              icon={faWallet}
              className="text-xl cursor-pointer"
            />
          </div>
          <div className="text-base font-semibold ml-2">Wallet</div>
        </div>
        <div className="flex items-center mt-6">
          <div className="w-6">
            <FontAwesomeIcon
              icon={faQuestion}
              className="text-xl cursor-pointer"
            />
          </div>
          <div className="text-base font-semibold ml-2">Help</div>
        </div>
        <div className="flex items-center mt-6">
          <div className="w-6">
            <FontAwesomeIcon
              icon={faTicketAlt}
              className="text-lg cursor-pointer"
            />
          </div>
          <div className="text-base font-semibold ml-2">Promotions</div>
        </div>
        <div className="flex items-center mt-10">
          <div className="w-6">
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className="text-xl cursor-pointer"
              onClick={() => onClickLoggedOut()}
            />
          </div>
          <div
            onClick={() => onClickLoggedOut()}
            className="text-base font-semibold ml-2 cursor-pointer"
          >
            Sign Out
          </div>
        </div>
      </div>
    </div>
  );
};
