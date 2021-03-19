import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { Restaurants } from "../pages/client/restaurants";
import { useMe } from "../hooks/useMe";
import { Header } from "../components/header";

const ClientRoutes = [
  <Route path="/" exact>
    <Restaurants />
  </Route>,
];

// const ME_QUERY = gql`
//   query meQuery {
//     me {
//       id
//       email
//       role
//       verified
//     }
//   }
// `;

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  console.log(data);
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    //무조껀 라우터 안에 있어야한다!! 모튼 컴포넌트는!
    <Router>
      <Header />
      <Switch>
        {data.me.role === "Client" && ClientRoutes}

        {/* <ClientRoutes/>를 ClientRoutes 로 해줌 ClientRoutes를 배열로 만들어주면*/}
        {/* {data.me.role === "Client" && ClientRoutes}
        를 찾을수없으면  또는찾는 경로가 없으면 /로 보낼것임!*/}
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};
