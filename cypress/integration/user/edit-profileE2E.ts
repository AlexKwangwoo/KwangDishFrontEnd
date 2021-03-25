describe("Edit Profile", () => {
  const user = cy;
  beforeEach(() => {
    //모든 개인 하나씩 실행하기전에 로그인먼저 시킨다!
    // @ts-ignore
    user.login("kwangTest@gmail.com", "123123");
  });
  it("can go to /edit-profile using the header", () => {
    user.get('a[href="/edit-profile"]').click();
    //css 셀렉터를 이용해 가져올수있다!
    user.wait(2000);
    user.title().should("eq", "Edit Profile | Nuber Eats");
  });
  it("can change email", () => {
    //유저가 beforeEach에서 로그인하고 수정할때마다 바꾸기전 이름으로 우리가
    //방해해서 값을 넣어줄것임!
    user.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (req.body?.operationName === "editProfile") {
        //ts무시안해주면 오류가 날것임!

        // @ts-ignore
        req.body?.variables?.input?.email = "kwangTest@gmail.com";
      }
    });
    user.visit("/edit-profile");
    user.findByPlaceholderText(/email/i).clear().type("kwangTest2@gmail.com");
    user.findByRole("button").click();
  });
});
