import { render, waitFor } from "@testing-library/react";
import React from "react";
import { isLoggedInVar } from "../../apollo";
import { App } from "../app";

//1. app에 들어가면 맨처음 logged-out-router가 나오고
//<span>logged-out</span>, 나오게 할것이다!
jest.mock("../../routers/logged-out-router", () => {
  return {
    LoggedOutRouter: () => <span>logged-out</span>,
  };
});
jest.mock("../../routers/logged-in-router", () => {
  return {
    LoggedInRouter: () => <span>logged-in</span>,
  };
});

describe("<App />", () => {
  //App 은 그냥 아무거나 쓰면됨..정해지지않음!
  it("renders LoggedOutRouter", () => {
    const { getByText } = render(<App />);
    //render안에는 우리가 직접테스트하고싶은 컴포넌트를 넣어야함!
    //랜더는 많은 함수들을 가지고 있다!
    // getByText("logged-out");
    // getByText("logged-outaaaaaaaaa");
    //../../routers/logged-out-router을 실행하면
    //그 컴포넌트 안에  <span>logged-out</span> 로그드아웃이있는지 볼것이다!
  });

  //이부분은 로그인되어야하기에 waitFor을 써서
  //reactValue를 바꿔줌!! 내장함수임!
  it("renders LoggedInRouter", async () => {
    const { getByText, debug } = render(<App />);
    await waitFor(() => {
      isLoggedInVar(true);
    });

    //debug는 컴포넌트 안의 html을 보여준다!
    // debug();
    //waitFor은 전역 state변수를 바꿔줄수있따!
    getByText("logged-in");
  });
});
