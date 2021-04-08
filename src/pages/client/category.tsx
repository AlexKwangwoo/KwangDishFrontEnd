import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { category, categoryVariables } from "../../generated/category";

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface ICategoryParams {
  slug: string;
}

export const Category = () => {
  const params = useParams<ICategoryParams>();
  const { data, loading } = useQuery<category, categoryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          page: 1,
          slug: params.slug,
        },
      },
    }
  );
  console.log(data);
  return (
    <div>
      <Helmet>
        <title>Search | KwangDish</title>
      </Helmet>
      <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
        <div className="max-w-full pb-8">
          {!loading ? (
            <div>
              <div className="text-3xl font-semibold mt-6">
                {data?.category?.category?.name}
              </div>
              <div className="grid mt-6 md:grid-cols-3 gap-x-5 gap-y-10">
                {data?.category?.restaurants?.map((restaurant) => (
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
