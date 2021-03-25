describe("Create Account", () => {
  const user = cy;
  it("should see email / password validation errors", () => {
    user.visit("/");
    user.findByText(/create an account/i).click();
    user.findByPlaceholderText(/email/i).type("non@good");
    user.findByRole("alert").should("have.text", "Please enter a valid email");
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole("alert").should("have.text", "Email is required");
    user.findByPlaceholderText(/email/i).type("real@mail.com");
    user
      .findByPlaceholderText(/password/i)
      .type("a")
      .clear();
    user.findByRole("alert").should("have.text", "Password is required");
  });

  it("should be able to create account and login", () => {
    user.intercept("http://localhost:4000/graphql", (req) => {
      //자꾸 테스트할때마다 유저가 생긴다 그걸 방지하기위해 낚아채서
      //유저생성을 한번만하고 두번째부터는 생성을 방지할것임! 19.4강의
      //console.log(req.body);
      const { operationName } = req.body;
      if (operationName && operationName === "createAccountMutation") {
        //위에껄 안해주면 로그인할때도 createAccountoutput으로 답장함
        //그래서 아이디 만들때만 사용할수있도록 해야함!
        //월래는 ok가 false여야하지만 내가 true로 바꾸겠음!! 그럼 통과함!
        req.reply((res) => {
          res.send({
            fixture: "auth/create-accountE2E.json",
          });
        });
      }
    });
    user.visit("/create-account");
    user.findByPlaceholderText(/email/i).type("kwangTest@gmail.com");
    user.findByPlaceholderText(/password/i).type("123123");
    user.findByRole("button").click();
    user.wait(3000);
    // @ts-ignore
    user.login("kwangTest@gmail.com", "123123");
  });
});
