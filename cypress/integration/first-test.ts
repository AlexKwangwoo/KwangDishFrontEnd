// describe("First Test", () => {
//   it("should go to homepage", () => {
//     //cy는 cypress를 의미한다!
//     cy.visit("http://localhost:3000")
//     여기서 baseURL을 config에 설정해서 다음부터는 안써도됨!
//       .title()
//       //eq는 equal이라는뜻!!
//       .should("eq", "Loginn | Nuber Eats");
//   });
// });

//----중요 react component테스트에서 썻던 친구들..
//ex) findByPlaceholderText 이런거 쓸려면 앞에 무조껀 cy붙여야함 룰임!
//cy는 알아보기 힘드니 const user = cy; 를 사용할것임!
//각각의 it은 분리되어 테스트 되는것임!! 예를 들어 로그인후 로컬스토리지에
// 토큰이 저장되면 it이 다음테스트로 가게되면 지워져서 create account를 다시 갈
// 갈수있다!

const user = cy;
describe("Log In", () => {
  it("should see login page", () => {
    user.visit("/").title().should("eq", "Login | Nuber Eats");
  });

  it("can see email / password validation errors", () => {
    user.visit("/");
    user.findByPlaceholderText(/email/i).type("bad@email");
    user.findByRole("alert").should("have.text", "Please enter a valid email");
    user.findByPlaceholderText(/email/i).clear();
    //입력된거 지워주고! 그러면 이메일 필요하다 뜰것임!
    user.findByRole("alert").should("have.text", "Email is required");
    user.findByPlaceholderText(/email/i).type("bad@email.com");
    user
      .findByPlaceholderText(/password/i)
      .type("a")
      .clear();
    user.findByRole("alert").should("have.text", "Password is required");
  });

  it("can fill out the form", () => {
    user.visit("/");
    user.findByPlaceholderText(/email/i).type("bnc3049test1@gmail.com");
    user.findByPlaceholderText(/password/i).type("123123");
    user
      .findByRole("button")
      .should("not.have.class", "pointer-events-none")
      //다 입력했기에 포인터가 안올려지는건 클래스에 없어야한다!
      .click();
    //토큰은 string 이여야 한다!
    user.window().its("localStorage.nuber-token").should("be.a", "string");
  });

  it("sign up", () => {
    user.visit("/create-account");
  });
});
