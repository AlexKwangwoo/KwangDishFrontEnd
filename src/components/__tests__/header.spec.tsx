import { MockedProvider } from "@apollo/client/testing";
import { BrowserRouter as Router } from "react-router-dom";
import { render, waitFor } from "@testing-library/react";
import React from "react";
import { ME_QUERY } from "../../hooks/useMe";
import { Header } from "../header";

describe("<Header />", () => {
  it("renders verify banner", async () => {
    //쿼리를 쓰기위해선 waitfor안에
    //await new Promise((resolve) => setTimeout(resolve, 0)); 도 해줘야한다!!
    //그냥 식으로 외우자!
    await waitFor(async () => {
      //waitfor은 state가 바뀜으로써 rerender 는걸 기다려야함!
      const { getByText } = render(
        //목프로바이더는 그래프큐엘 보내는걸 목할수있다!
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: "",
                    role: "",
                    verified: false,
                  },
                },
              },
            },
          ]}
        >
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
      getByText("Please verify your email.");
    });
  });
  it("renders without verify banner", async () => {
    await waitFor(async () => {
      const { queryByText } = render(
        //queryByText 는 찾지못하면 null을 리턴함!!
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: "",
                    role: "",
                    verified: true,
                  },
                },
              },
            },
          ]}
        >
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
      //Please verify your email. 이메일 true니깐 이건 없을것이다!
      expect(queryByText("Please verify your email.")).toBeNull();
      //queryByText 는 찾는게 없으면 null
    });
  });
});
