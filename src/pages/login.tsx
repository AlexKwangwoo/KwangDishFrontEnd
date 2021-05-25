import React from "react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import KwangLogoBlack from "../images/KwangLogoBlack.png";
import {
  loginMutation,
  loginMutationVariables,
} from "../generated/loginMutation";
import { Link } from "react-router-dom";
import { Button } from "../components/button";
import { Helmet } from "react-helmet-async";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";

// # $는 변수라는뜻! 밑에줄은 FRONT 의 아폴로를 위한 것임
// # mutation loginMutation($email: String!, $password: String!) {
// #   login(input: { email: $email, password: $password }) {
// #  ------------DTO에서 쓰던 input type을 써보자!!!!!!!!!!!!!!!
// # LoginInput! 은 백앤드에서 똑같이 가져와야한다!
export const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
      # 문제가 생기면 우리가 정해놓은 백앤드에서 에러가 전달될것임!
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    getValues,
    errors,
    handleSubmit,
    formState,
    //formState
  } = useForm<ILoginForm>({
    mode: "onChange",
    //이것은 다 입력되면 isvalid가 true가 된다!
  });
  // const [loginMutation, { loading, error, data }] = useMutation(LOGIN_MUTATION);
  //apollo codegen을 이용해 만들어진 타입으로 변수를 보호하자!
  const onCompleted = (data: loginMutation) => {
    //데이터는 loginMutation타입{ error, ok, token }으로 가지고있을것임!
    //------------------->여기서 나온 데이터는 loginMutationResult 이름으로
    //으로 변환시켜줄것임!
    const {
      login: { ok, token },
      //로그인은 쿼리 이름임!! 결과가 쿼리이름이됨!
    } = data;
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      //LOCALSTORAGE_TOKEN이 "nuber-token"이므로 속성이름이nuber-token에다가
      //토큰을 저장한다!
      authTokenVar(token);
      isLoggedInVar(true);
      //아폴로.ts에서 우리가 만든 전역변수!! static이라 보면됨!
    }
  };
  const [loginMutationAAAA, { data: loginMutationResult, loading }] =
    useMutation<
      //data안에 loginMutationResult이 있고 안에 쿼리 이름으로 결과가있음(login)
      loginMutation,
      loginMutationVariables
      //useMutation에서 처음은 쓸 쿼리아웃풋타입
      //두번째는 넣을 변수의 인풋타입!!
    >(LOGIN_MUTATION, {
      //로그인이 실행되고 결과값을 onCompleted에 넘겨줄것임!
      onCompleted, //onCompleted은 정해진 함수임 이름바꾸면안됨!! 속성임!
    });
  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutationAAAA({
        variables: {
          //변수 적용방법!!
          // email,
          // password,
          //이제는 인풋타입이 정해져서 인풋타입이용해야함!
          loginInput: {
            email,
            password,
          },
        },
      });
    }
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      {/* 헬멧은 타이틀을 바꿔준다! */}
      <Helmet>
        <title>Login | KwangDish</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={KwangLogoBlack} className="w-52 mb-10" alt="Nuber Eats" />{" "}
        <h4 className="w-full font-medium text-left text-3xl mb-5">
          Welcome back
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 w-full mb-5"
        >
          <input
            ref={register({
              required: "Email is required",
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name="email"
            // name 없으면 useForm이 찾질 못한다!!
            required
            //required 두개써서 이중으로 보호. 여기 required html에서 누가 지우면
            // 위의 ref의 required가 error message로 적용될것임!
            type="email"
            placeholder="Email"
            className="input"
          />
          {errors.email?.type === "pattern" && (
            <FormError errorMessage={"Please enter a valid email"} />
          )}
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          <input
            ref={register({ required: "Password is required" })}
            required
            name="password"
            type="password"
            placeholder="Password"
            className="input"
          />
          {/* 버튼이 하나일경우 무조껀 submit버튼이라 간주됨! */}
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage="Password must be more than 10 chars." />
          )}
          <Button
            canClick={formState.isValid}
            //formState에서 제출이 가능할때(모든 유효검사마친뒤) true됨!
            //제출가능할때!
            loading={loading}
            actionText={"Log in"}
          />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
        <div>
          New to KwangDish?
          <Link
            to="/create-account"
            className="text-yellow-500 hover:underline ml-2"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
