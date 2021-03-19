import { useReactiveVar } from "@apollo/client";
import React from "react";
import { isLoggedInVar } from "./apollo";
import { LoggedInRouter } from "./routers/logged-in-router";
import { LoggedOutRouter } from "./routers/logged-out-router";

//이게 원래 apollo에서 정의해서 @client로 백앤드 안넣고
//쿼리쓰는 방법이였으나!! 이제는
// const IS_LOGGED_IN = gql`
//   query isLoggedIn{
//     isLoggedIn @client
//   }
// `
// const isLoggedIn = useReactiveVar(isLoggedInVar);이렇게 가능함!
function App() {
  // const {
  //   data:{isLoggedIn},
  // }= useQuery(IS_LOGGED_IN);
  // 이렇게 대신 useReactiveVar를 쓸수있음!
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
}

export default App;
