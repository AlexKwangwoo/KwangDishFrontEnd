import React from "react";
import { Restaurant } from "../../components/restaurant";
import { useMe } from "../../hooks/useMe";

export const FavoriteRestaurants = () => {
  const { data: userData } = useMe();
  // console.log(userData.me.favorite);
  return (
    <div className="max-w-screen-2xl pb-20 mx-auto mt-20 mb-10">
      <div className="max-w-full pb-8">
        <div className="text-2xl font-bold">My Favorite Restaurants</div>
        <div className="grid mt-6 md:grid-cols-3 gap-x-5 gap-y-10">
          {userData?.me?.favorite !== undefined &&
            userData?.me?.favorite?.map((restaurant) => (
              <div className="pr-4" key={restaurant.id}>
                <Restaurant
                  key={restaurant.id}
                  id={restaurant.id + ""}
                  //이렇게 하면 숫자에서 문자로 변함!
                  coverImg={restaurant.coverImg}
                  name={restaurant.name}
                  categoryName={restaurant.category?.name}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
