import React from "react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import {
  loginMutation,
  loginMutationVariables,
} from "../generated/loginMutation";

// # $는 변수라는뜻! 밑에줄은 FRONT 의 아폴로를 위한 것임
// # mutation loginMutation($email: String!, $password: String!) {
// #   login(input: { email: $email, password: $password }) {
// #  ------------DTO에서 쓰던 input type을 써보자!!!!!!!!!!!!!!!
// # LoginInput! 은 백앤드에서 똑같이 가져와야한다!
const LOGIN_MUTATION = gql`
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
  resultError?: string;
}

export const Login = () => {
  const { register, getValues, errors, handleSubmit } = useForm<ILoginForm>();
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
    if (ok) {
      console.log(token);
    }
  };
  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
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
      loginMutation({
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
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg pt-10 pb-7 rounded-lg text-center">
        <div className="bg-white w-full max-w-lg py-10 rounded-lg text-center">
          <h3 className="text-2xl text-gray-800">Log In</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-3 mt-5 px-5"
          >
            <input
              ref={register({ required: "Email is required" })}
              name="email"
              // name 없으면 useForm이 찾질 못한다!!
              required
              //required 두개써서 이중으로 보호. 여기 required html에서 누가 지우면
              // 위의 ref의 required가 error message로 적용될것임!
              type="email"
              placeholder="Email"
              className="input"
            />
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
            <button className="mt-3 btn">
              {loading ? "Loading..." : "Log In"}
            </button>
            {loginMutationResult?.login.error && (
              <FormError errorMessage={loginMutationResult.login.error} />
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
