import { render } from "@testing-library/react";
import React from "react";
import { Button } from "../button";

describe("<Button />", () => {
  it("should render OK with props", () => {
    const { getByText } = render(
      <Button canClick={true} loading={false} actionText={"test"} />
    );
    getByText("test");
    //rerender 도 가능하다!! 18.2 보면!!
  });
  it("should display loading", () => {
    const { getByText, container } = render(
      <Button canClick={false} loading={true} actionText={"test"} />
    );
    getByText("Loading...");
    //container는 div라고 보면된다!! debug찍어보면 div 자식으로 button이 있음
    // 그 버튼이 pointer events none이 있는지 보는것임! false일때!
    expect(container.firstChild).toHaveClass("pointer-events-none");
  });
});
