import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import {
  createRestaurant,
  createRestaurantVariables,
} from "../../generated/createRestaurant";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";
import { useHistory } from "react-router-dom";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(inputhere: $input) {
      # 월래는 input이나 내가 백앤드에서 test겸 inputhere로 함!
      error
      ok
      restaurantId
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

//이렇게 쓴 이유.. 일단 myrestaurant 속성을 다넣어준다!!
//그리고 myrestaurant안에 resturants가 있는데 이또한
//월래 있던 내용은 넣어주고 필요한부분만 넣으면 자동으로
//업데이트가 된다
// 그래서 ...queryResult.myRestaurants.restaurants, 을 밑에
//restaurants 속성으로 넣어줌!!! 중요*************************
//밑에 내용은 console.log(data) 해서 restaurant 형태를
//다 따라 해야한다!!
// __proto__:Object, 이부분은 js부분으로 필요없음! 캐시에서 필요x

export const AddRestaurant = () => {
  const client = useApolloClient();
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState("");

  const onCompleted = (data: createRestaurant) => {
    console.log("데이터!!!!!!!", data);
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    if (ok) {
      const { name, categoryName, address } = getValues();

      setUploading(false);
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
      console.log(queryResult);
      client.writeQuery({
        query: MY_RESTAURANTS_QUERY,
        data: {
          myRestaurants: {
            ...queryResult.myRestaurants,
            restaurants: [
              {
                address,
                category: {
                  name: categoryName,
                  __typename: "Category",
                },
                coverImg: imageUrl,
                id: restaurantId,
                isPromoted: false,
                name,
                __typename: "Restaurant",
              },
              ...queryResult.myRestaurants.restaurants,
            ],
          },
        },
      });
      history.push("/");
    }
  };
  const [createRestaurantMutation, { data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
    //refetchQueries:[{query:MY_RESTAURANTS_QUERY}] 사용하면 새로만들걸
    //새로고침시에 볼수있음!
  });

  const {
    register,
    getValues,
    formState,
    errors,
    handleSubmit,
  } = useForm<IFormProps>({
    mode: "onChange",
  });

  const [uploading, setUploading] = useState(false);
  const onSubmit = async () => {
    try {
      setUploading(true);
      const { file, name, categoryName, address } = getValues();

      //이미지는 디비에 저장되기전에 aws에 요청해 storage에 저장되고
      //그 스토리지 url이 뮤테이션을 통해 db에 저장될것임!
      const actualFile = file[0];
      //파일은 리스트로 오기에 맨처음껄로 해준다!
      const formBody = new FormData();

      //append뒤에 file은  디비부분 업로드 컨트롤 부분의
      //@UseInterceptors(FileInterceptor('file'))
      //async uploadFile(@UploadedFile() file) {
      //'file'과 똑같은 것이다!!
      formBody.append("file", actualFile);
      const { url: coverImg } = await //파일을 전송하고 url을 받을 것임!
      (
        await fetch("https://kwang-eats-backend.herokuapp.com/uploads/", {
          method: "POST",
          body: formBody,
        })
      ).json();
      console.log("coverImg", coverImg);
      setImageUrl(coverImg);
      try {
        createRestaurantMutation({
          variables: {
            input: {
              name,
              categoryName,
              address,
              coverImg,
            },
          },
        });
      } catch (e) {
        console.error(e);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Add Restaurant</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          className="input"
          type="text"
          name="name"
          placeholder="Name"
          ref={register({ required: "Name is required.", minLength: 2 })}
        />
        {errors.name?.type === "minLength" && (
          <FormError errorMessage="Name must be more than 1 char" />
        )}
        <input
          className="input"
          type="text"
          name="address"
          placeholder="Address"
          ref={register({ required: "Address is required." })}
        />
        <input
          className="input"
          type="text"
          name="categoryName"
          placeholder="Category Name"
          ref={register({ required: "Category Name is required." })}
        />
        <div>
          <input
            type="file"
            name="file"
            accept="image/*"
            ref={register({ required: true })}
          />
        </div>
        <Button
          loading={uploading}
          canClick={formState.isValid}
          actionText="Create Restaurant"
        />
        {data?.createRestaurant?.error && (
          <FormError errorMessage={data.createRestaurant.error} />
        )}
      </form>
    </div>
  );
};
