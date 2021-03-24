import { render, waitFor } from "../../test-utils";
import React from "react";
import { NotFound } from "../404";

describe("<NotFound />", () => {
  it("renders OK", async () => {
    render(<NotFound />);
    await waitFor(() => {
      //waitfor은 바로 바뀌지 않을때 써야한다.. 헬멧은 랜더가 바로안되고
      //몇초뒤에 바뀌기에 waitfor을 써서 기다려줘야한다!
      expect(document.title).toBe("Not Found | Nuber Eats");
    });
  });
});
