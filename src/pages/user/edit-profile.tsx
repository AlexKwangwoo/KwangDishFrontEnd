import { gql, useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { useMe } from "../../hooks/useMe";
import { editProfile, editProfileVariables } from "../../generated/editProfile";
import { Helmet } from "react-helmet";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  email?: string;
  password?: string;
}

export const EditProfile = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  // const onClickLoggedOut = () => {
  //   localStorage.removeItem(LOCALSTORAGE_TOKEN);
  //   window.location.assign("/");
  //   //리로드하면서 루트페이지로 가게해준다!
  // };
  const onCompleted = (data: editProfile) => {
    const {
      editProfile: { ok, error },
    } = data;
    console.log(error);
    if (ok && userData) {
      const {
        me: { email: prevEmail, id },
        //캐시에서 가져온 로그인할때 이메일과
        // 새로 저장할려는 이메일을 비교할것임!
      } = userData;
      const { email: newEmail } = getValues();
      if (prevEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              verified
              email
            }
          `,
          data: {
            email: newEmail,
            verified: false,
          },
        });
      }
    }
  };
  const [editProfile, { loading }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFILE_MUTATION, {
    onCompleted,
  });
  const { register, handleSubmit, getValues, formState } = useForm<IFormProps>({
    mode: "onChange",
    defaultValues: {
      email: userData?.me.email,
      //이메일을 placehold처럼 처음에 입력시켜둔다
    },
  });
  const onSubmit = () => {
    const { email, password } = getValues();
    editProfile({
      variables: {
        input: {
          email,
          ...(password !== "" && { password }),
          //패스워드는 없던가 있어야만함.. 빈칸 안됨!
          //... + {} 는 결국 아무것도 없는것이됨!
        },
      },
    });
  };
  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <Helmet>
        <title>Edit Profile | KwangDish</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          ref={register({
            pattern:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          name="email"
          className="input"
          type="email"
          placeholder="Email"
        />
        <input
          ref={register}
          name="password"
          className="input"
          type="password"
          placeholder="Password"
        />
        <Button
          loading={loading}
          canClick={formState.isValid}
          // require부분이 다채워지면 isValid가 true가 된다!
          actionText="Save Profile"
        />
      </form>
      {/* <button
        className="focus:outline-none text-red-600 font-bold text-lg"
        onClick={() => onClickLoggedOut()}
      >
        Logged Out
      </button> */}
    </div>
  );
};
