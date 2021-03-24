import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { render, RenderResult, waitFor } from "@testing-library/react";
import React from "react";
import { Login, LOGIN_MUTATION } from "../login";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("<Login />", () => {
  let renderResult: RenderResult;
  //RenderResult이것은 render한 결과의 타입이될것임!
  let mockedClient: MockApolloClient;

  beforeEach(async () => {
    //많은곳에서 wait가 일어날꺼기에 매번 실행시켜줌! waitFor이 있으면
    await waitFor(async () => {
      mockedClient = createMockClient();

      renderResult = render(
        <HelmetProvider>
          <Router>
            <ApolloProvider client={mockedClient}>
              <Login />
            </ApolloProvider>
          </Router>
        </HelmetProvider>
      );
    });
  });

  it("should render OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Login | Nuber Eats");
    });
  });

  it("displays email validation errors", async () => {
    const { getByPlaceholderText, debug, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    //여기서 i는 대소문자 구분안한다는뜻!
    // 랜더 된곳에서 email placehoulder인곳을 가져온다!

    // console.log("email", email);
    await waitFor(() => {
      //userEvent는 가짜로 이벤트를 발생시킬수있다!
      //email칸에 this@wont가 들어갔다고 보면됨!
      userEvent.type(email, "this@wont");
    });

    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/please enter a valid email/i);
    //이메일이 제대로 들어가지않으면 경고창에 pleaase enter~~~ 하라고 요구문구가
    //보일것을 expect 한다라는 뜻!!

    await waitFor(() => {
      userEvent.clear(email);
      //clear는 email인풋에서 모든 value를 다 지운다는 의미!
      //tpye은 입력!
    });
    //다시 role을 불러 와야함..안그러면 전에썻던게 그대로 있음!
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/email is required/i);
  });
  //

  it("display password required errors", async () => {
    const { getByPlaceholderText, debug, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const submitBtn = getByRole("button");
    await waitFor(() => {
      userEvent.type(email, "this@wont.com");
      //이메일 잘써주고!
      //클릭을 해주자!!
      userEvent.click(submitBtn);
    });
    const errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/password is required/i);
  });
  //

  //뮤테이션테스트!!
  it("submits form and calls mutation", async () => {
    const { getByPlaceholderText, debug, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole("button");
    const formData = {
      email: "real@test.com",
      password: "123",
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      //login_mutation에 받고싶은 값 쓰는 방법!!
      //data안에 작성하여야한다!
      data: {
        login: {
          ok: true,
          token: "XXX",
          //토큰을 받고 애러는 절대 생길순없다
          //하지만 테스트만 해보겠음!@!
          error: "mutation-error",
        },
      },
    });
    //client에 LOGIN_MUTATION뮤테이션 이용에 값은mockedMutationResponse을
    //넣겠다!!
    //즉 provider로 가는 mutation과 query를 가진 request를 가로채서 행동한다!
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);

    //로컬스토리지가 call되는지 볼것이다!
    jest.spyOn(Storage.prototype, "setItem");
    //Storage.prototype 부분에서 "setItem이 일어나면 );뒤에 할일을
    //적어줘야하는데 아무것도 안적어줌!
    //Storage.prototype 안에 localstroage가 있고 그안에 setItem이 있음

    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      //뭐랑 같이 입력되었는가~
      loginInput: {
        email: formData.email,
        password: formData.password,
      },
    });

    const errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/mutation-error/i);
    //jest.spyOn(Storage.prototype, "setItem"); 을 가져와서 확인한다 18.7강임..
    expect(localStorage.setItem).toHaveBeenCalledWith("nuber-token", "XXX");
  });
});
