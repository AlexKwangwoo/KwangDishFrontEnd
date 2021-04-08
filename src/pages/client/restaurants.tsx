import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Restaurant } from "../../components/restaurant";
import { RestaurantMoving } from "../../components/restaurantMoving";
import { url } from "inspector";
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from "../../generated/restaurantsPageQuery";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import mainPic from "../../images/mainPic.jpg";
// import uberlogo from "../../images/uberlogo2.jpg";
import cityView from "../../images/cityView.jpg";
import {
  restaurantsByCategory,
  restaurantsByCategoryVariables,
} from "../../generated/restaurantsByCategory";
// @ts-ignore
import { Slider as SliderFixed } from "infinite-react-carousel";

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    # 두개의 쿼리가 있지만 레스토랑만 페이지 인풋을 받음!!
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    # 위의 인풋이 여기로 온다!
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

const RESTAURANTS_BYCATEGORY_QUERY = gql`
  query restaurantsByCategory($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

interface IFormProps {
  searchTerm: string;
}

export const Restaurants = () => {
  const [page, setPage] = useState(1);
  // const [fastFood, setFastFood] = useState<restaurantsByCategory>();
  const { data, loading } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        // page: page,
        page,
        //react 가 page가 바뀌면 알아서 rerender해줌!
      },
    },
  });

  const { data: cateData, loading: cateLoading } = useQuery<
    restaurantsByCategory,
    restaurantsByCategoryVariables
  >(RESTAURANTS_BYCATEGORY_QUERY, {
    variables: {
      input: {
        // page: page,
        page: 1,
        slug: "fast-food",
        //react 가 pagepass가 바뀌면 알아서 rerender해줌!
      },
    },
  });

  const { data: bbqData, loading: bbqLoading } = useQuery<
    restaurantsByCategory,
    restaurantsByCategoryVariables
  >(RESTAURANTS_BYCATEGORY_QUERY, {
    variables: {
      input: {
        // page: page,
        page: 1,
        slug: "bbq",
        //react 가 pagepass가 바뀌면 알아서 rerender해줌!
      },
    },
  });

  useEffect(() => {
    // const fastRestaurants = cateData;
    // setFastFood(fastRestaurants);
    //
  }, [RESTAURANTS_BYCATEGORY_QUERY]);

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);

  //----Search
  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const history = useHistory();

  // useEffect(() => {
  //   const fast = cateData?.category?.restaurants;
  //   setFastFood(fast);
  // });
  // const fastRestaurant = () => {
  //   const fast = cateData?.category?.restaurants;
  //   setFastFood(fast);
  //   return null;
  // };

  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: "/search",
      search: `?term=${searchTerm}`,
      // state도 있음 스테이트는 감춰서 보냄! 하지만 useLocation
      //으로 찾을수있음! //새로고침해도 리액트가 브라우저 메모리에 저장시킴!
    });
  };

  const settings = {
    slidesToShow: 3,
    arrowsBlock: false,
    autoplay: true,
    autoplayScroll: 2,
    autoplaySpeed: 6000,
    duration: 500,
  };

  const settings2 = {
    slidesToShow: 2,
    arrowsBlock: false,
    autoplay: true,
    autoplayScroll: 2,
    autoplaySpeed: 200,
    duration: 30000,
    arrows: false,
  };

  const settings3 = {
    slidesToShow: 6,
    arrowsBlock: false,
    autoplay: true,
    autoplayScroll: 2,
    autoplaySpeed: 1000,
    duration: 8000,
  };

  return (
    <div>
      <Helmet>
        <title>Home | Nuber Eats</title>
      </Helmet>
      <div className="bg-gray-800 w-full py-8">
        <div className="max-w-screen-2xl mx-auto grid md:grid-cols-2">
          <div className="w-full my-auto">
            <div className="text-5xl text-white">Crave it? Get it.</div>
            <div className="text-lg mt-2 text-white">
              Search for a favorite restaurant, cuisine, or dish
            </div>
          </div>
          <div className="w-full mt-8 md:mt-0">
            <img src={mainPic} />
          </div>
        </div>
      </div>
      {/* <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="bg-gray-800 w-full py-40 flex items-center justify-center"
      >
        <input
          ref={register({ required: true, min: 3 })}
          name="searchTerm"
          type="Search"
          className="input rounded-md border-0 w-3/4 md:w-3/12"
          placeholder="Search restaurants..."
        />
      </form> */}
      {!loading &&
      !cateLoading &&
      !bbqLoading &&
      bbqData?.category?.restaurants !== undefined &&
      bbqData?.category?.restaurants !== undefined ? (
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
          <div className="max-w-full border-b-2 pb-8">
            <div className="flex justify-around max-w-sm mx-auto ">
              {data?.allCategories.categories?.map((category) => (
                <Link key={category.id} to={`/category/${category.slug}`}>
                  <div className="flex flex-col group items-center cursor-pointer mx-5">
                    <div
                      className=" w-16 h-16 bg-cover group-hover:bg-gray-100 rounded-full"
                      style={{ backgroundImage: `url(${category.coverImg})` }}
                    ></div>
                    <span className="mt-1 text-sm text-center font-medium">
                      {category.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-4xl font-semibold mt-6">In a rush?</div>
            <div className="text-base mt-2 mb-6">
              Here's the fastest delivery for you
            </div>
            <div className="-mr-4">
              <SliderFixed {...settings}>
                {cateData?.category?.restaurants !== undefined &&
                  cateData?.category?.restaurants?.map((restaurant) => (
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
              </SliderFixed>
            </div>
          </div>
          <div>
            <div className="text-4xl font-semibold mt-6">Orders near you</div>
            <div className="text-base mt-2 mb-6">
              Your neighborhood's latest orders
            </div>
            <div
              className="-mr-4 bg-gray-600 bg-cover md:bg-contain h-80 shadow-inner bg-bottom"
              style={{ backgroundImage: `url(${cityView})` }}
            >
              <SliderFixed {...settings2}>
                {bbqData?.category?.restaurants !== undefined &&
                  bbqData?.category?.restaurants?.map((restaurant) => (
                    <div className="pr-4" key={restaurant.id}>
                      <RestaurantMoving
                        key={restaurant.id}
                        id={restaurant.id + ""}
                        //이렇게 하면 숫자에서 문자로 변함!
                        coverImg={restaurant.coverImg}
                        name={restaurant.name}
                        categoryName={restaurant.category?.name}
                      />
                    </div>
                  ))}
              </SliderFixed>
            </div>
          </div>
          <div className=" md:flex md:justify-between mt-16 mb-8">
            <div className="flex flex-col justify-center items-center">
              <div
                className="rounded-full h-52 w-52 bg-cover "
                style={{
                  backgroundImage: `url(https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly9kdXl0NGg5bmZuajUwLmNsb3VkZnJvbnQubmV0L3NrdS9DYXRlZ29yeUVudHJ5UG9pbnRJbGx1c3RyYXRpb25fMTY4eDEzNXB4QDN4LmpwZw==)`,
                }}
              ></div>
              <div className="font-semibold mt-2 mb-4">Latest Deals</div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div
                className="rounded-full h-52 w-52 bg-cover "
                style={{
                  backgroundImage: `url(https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly9kdXl0NGg5bmZuajUwLmNsb3VkZnJvbnQubmV0L3NlYXJjaF9ob21lL2Vzc2VudGlhbHMuanBn)`,
                }}
              ></div>
              <div className="font-semibold mt-2 mb-4">Everyday Essentials</div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div
                className="rounded-full h-52 w-52 bg-cover "
                style={{
                  backgroundImage: `url(https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly9kdXl0NGg5bmZuajUwLmNsb3VkZnJvbnQubmV0L3NrdS9kMTE2NDcxNGEyNTlkMTgwNDcxZTIwMjU0YjgyMTFmNw==)`,
                }}
              ></div>
              <div className="font-semibold mt-2 mb-4">Bakery</div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div
                className="rounded-full h-52 w-52 bg-cover "
                style={{
                  backgroundImage: `url(https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly9kdXl0NGg5bmZuajUwLmNsb3VkZnJvbnQubmV0L3NrdS8wYmM5Y2ExOWEwMmUzYmQwM2YyMzk1YzhjZjhhM2UwYw==)`,
                }}
              ></div>
              <div className="font-semibold mt-2 mb-4">
                Breakfast and Brunch
              </div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div
                className="rounded-full h-52 w-52 bg-cover "
                style={{
                  backgroundImage: `url(https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly9kdXl0NGg5bmZuajUwLmNsb3VkZnJvbnQubmV0L3NrdS85ZGRhZTAxZDMxNzA4MmE1Y2IzNzI3ZDk0NWE0ODgwYg==)`,
                }}
              ></div>
              <div className="font-semibold mt-2 mb-4">Cafe</div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div
                className="rounded-full h-52 w-52 bg-cover "
                style={{
                  backgroundImage: `url(https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly9kdXl0NGg5bmZuajUwLmNsb3VkZnJvbnQubmV0L3NrdS9hNWFhOWJiYmEwMTcyMTM0NDQ5YjRhZDQ4NjExZDkyYg==)`,
                }}
              ></div>
              <div className="font-semibold mt-2 mb-4">American</div>
            </div>
          </div>
          {/* <div>
          <div className="text-4xl font-semibold">Today's offers</div>
        </div>
        <div>
          <div className="text-4xl font-semibold">Popular near you</div>
        </div>
        <div>
          <div className="text-4xl font-semibold">Loved by locals</div>
        </div>
        <div>
          <div className="text-4xl font-semibold">Family favorites</div>
        </div> */}
          <div>
            <div className="text-4xl font-semibold">All Stores</div>
          </div>
          <div className="grid mt-6 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.restaurants.results?.map((restaurant) => (
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
          <div className="grid grid-cols-3 -mb-20 text-center max-w-md items-center mx-auto mt-10">
            {page > 1 ? (
              <button
                onClick={onPrevPageClick}
                className="focus:outline-none font-medium text-2xl"
              >
                &larr;
              </button>
            ) : (
              <div></div>
            )}

            <span>
              Page {page} of {data?.restaurants.totalPages}
            </span>

            {page !== data?.restaurants.totalPages ? (
              <button
                onClick={onNextPageClick}
                className="focus:outline-none font-medium text-2xl"
              >
                &rarr;
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      ) : (
        <div className="font-bold text-4xl max-w-screen-2xl pt-48 mx-auto flex items-center justify-center">
          💕Thank you for using Kwang
          <span className="text-yellow-400">Dish</span>
          💕
        </div>
      )}
    </div>
  );
};
