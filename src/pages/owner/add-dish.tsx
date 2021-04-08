import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../../components/button";
import { createDish, createDishVariables } from "../../generated/createDish";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  restaurantId: string;
}

//form은 스트링밖에 안된다!
interface IForm {
  name: string;
  price: string;
  description: string;
  [key: string]: string;
}

export const AddDish = () => {
  const { restaurantId } = useParams<IParams>();
  const history = useHistory();
  const [createDishMutation, { loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION, {
    //createDishMutation이 일어나면 myrestaurant쿼리를 리로드 한다!
    //음식이 추가됐기에..
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: +restaurantId,
          },
        },
      },
    ],
  });

  const {
    register,
    handleSubmit,
    formState,
    getValues,
    setValue,
  } = useForm<IForm>({
    //formState는 onChange가 필수이다!
    mode: "onChange",
  });

  const onSubmit = () => {
    const { name, price, description, ...rest } = getValues();
    console.log(rest);
    //...rest ...left 아무것이나 하면됨! 나머지 것들을 담아줄것임!
    // console.log(rest);
    const optionObjects = optionsNumber.map((theId) => ({
      //optionsNumber그냥 날짜로 만들어진 아이디일뿐!!
      // 1617047433521-optionExtra: "2"
      // 1617047433521-optionName: "hot"
      //이런식으로 값을 가지는데.. 밑에걸로 2, hot 값을 받을수있음!
      name: rest[`${theId}-optionName`],
      //하나하나값의 키값을 넣어 찾고자하는 값을 받는다!
      extra: +rest[`${theId}-optionExtra`],
    }));
    createDishMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          restaurantId: +restaurantId,
          options: optionObjects,
        },
      },
    });
    history.goBack();
  };

  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);

  const onAddOptionClick = () => {
    setOptionsNumber((current) => [Date.now(), ...current]);
    //add할때마다 날짜들만 들어간 배열을 만들것임!
  };

  const onDeleteClick = (idToDelete: number) => {
    setOptionsNumber((current) => current.filter((id) => id !== idToDelete));
    //setValue 는 기본적으로 form에서 원하는값을 설정할수있다!
    //이걸 하는 이유는 위에서 쓴 ...rest 에 존재하기때문에 지워줘야함!!

    //OptionsNumber는 지워졌으나 form안의 getValue안은 안지워졌기에 지워야함!
    setValue(`${idToDelete}-optionName`, "");
    setValue(`${idToDelete}-optionExtra`, "");
  };
  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | KwangDish</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          className="input"
          type="text"
          name="name"
          placeholder="Name"
          ref={register({ required: "Name is required." })}
        />
        <input
          className="input"
          type="number"
          name="price"
          min={0}
          placeholder="Price"
          ref={register({ required: "Price is required." })}
        />
        <input
          className="input"
          type="text"
          name="description"
          placeholder="Description"
          ref={register({ required: "Description is required." })}
        />
        <div className="my-10">
          <h4 className="font-medium  mb-3 text-lg">Dish Options</h4>
          <span
            onClick={onAddOptionClick}
            className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 bg-"
          >
            Add Dish Option
          </span>
          {/* {optionsNumber !== 0 &&
            //Array.from은 안의 인자들을 하나하나나누어 배열로 만든 배열의집합
            Array.from(new Array(optionsNumber)).map((_, index) => (
              //optionsNumber 만큼 배열을 만들어 넣겠음!!
              //console.log(Array.from('foo'));
              //expected output: Array ["f", "o", "o"]

              //console.log(Array.from([1, 2, 3], x => x + x));
              //expected output: Array [2, 4, 6] */}

          {optionsNumber.length !== 0 &&
            optionsNumber.map((id) => (
              //id는 날짜가 될것임!!
              <div key={id} className="mt-5">
                <input
                  ref={register}
                  name={`${id}-optionName`}
                  className="py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2"
                  type="text"
                  placeholder="Option Name"
                />

                <input
                  ref={register}
                  name={`${id}-optionExtra`}
                  className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2"
                  type="number"
                  min={0}
                  placeholder="Option Extra"
                />

                {/* 그리고 버튼을 만들면 버튼을 누를때마다 서브밋이 되어버림!  */}
                {/* <span onClick={() => onDeleteClick(index)}>Delete Option</span> */}
                {/* onClick={onDeleteClick(index)} 하면 함수가 바로 실행될것임 */}

                <span
                  className="cursor-pointer text-white bg-red-500 ml-3 py-3 px-4 mt-5 bg-"
                  onClick={() => onDeleteClick(id)}
                >
                  Delete Option
                </span>
              </div>
            ))}
        </div>

        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="Create Dish"
        />
      </form>
    </div>
  );
};
