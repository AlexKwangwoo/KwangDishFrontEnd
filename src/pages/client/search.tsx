import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory, useLocation } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  searchRestaurant,
  searchRestaurantVariables,
} from "../../generated/searchRestaurant";

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  # 위의 RestaurantParts를 넣게 해줌!
`;

export const Search = () => {
  const [queryName, setQueryName] = useState<string>();
  const location = useLocation();
  const history = useHistory();
  const [callQuery, { loading, data, called }] = useLazyQuery<
    //useLazyQuery의 callQuery를 실행해야지만 이 쿼리가 실행되는것임!!
    //useQuery는 변수보자마자 미리 실행을 시켜놓을것임!!
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);

  useEffect(() => {
    const [, query] = location.search.split("?term=");
    setQueryName(query);
    //~~~search?term= ~~이 나올건데 ?term=뒤에껄 가져오겟음!
    if (!query) {
      return history.replace("/");
      //보내고 끝낼껏임!
    }
    callQuery({
      variables: {
        input: {
          page: 1,
          query,
        },
      },
    });
  }, [history, location]);
  console.log(loading, data, called);
  return (
    <div>
      <Helmet>
        <title>Search | KwangDish</title>
      </Helmet>
      <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
        <div className="max-w-full pb-8">
          {!loading ? (
            <div>
              <div className="text-3xl font-semibold mt-6">"{queryName}"</div>
              <div className="grid mt-6 md:grid-cols-3 gap-x-5 gap-y-10">
                {data?.searchRestaurant.restaurants?.map((restaurant) => (
                  <Restaurant
                    key={restaurant.id}
                    id={restaurant.id + ""}
                    //이렇게 하면 숫자에서 문자로 변함!
                    coverImg={restaurant.coverImg}
                    name={restaurant.name}
                    categoryName={restaurant.category?.name}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
