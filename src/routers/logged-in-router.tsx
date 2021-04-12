import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Restaurants } from "../pages/client/restaurants";
import { useMe } from "../hooks/useMe";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";
import { NotFound } from "../pages/404";
import { Search } from "../pages/client/search";
import { Category } from "../pages/client/category";
import { RestaurantDetail } from "../pages/client/restaurantDetail";
import { MyRestaurants } from "../pages/owner/my-restaurants";
import { AddRestaurant } from "../pages/owner/add-restaurants";
import { MyRestaurant } from "../pages/owner/my-restaurant";
import { AddDish } from "../pages/owner/add-dish";
import { Order } from "../pages/order";
import { Dashboard } from "../pages/driver/dashboard";
import { UserRole } from "../generated/globalTypes";
import {
  faBed,
  faCalendarTimes,
  faTimes,
  faTimesCircle,
  faWalking,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// const ClientRoutes = [
//   <Route key={1} path="/" exact>
//     <Restaurants />
//   </Route>,
//   <Route key={2} path="/confirm">
//     <ConfirmEmail />
//   </Route>,
//   <Route key={3} path="/edit-profile">
//     <EditProfile />
//   </Route>,
//   <Route key={4} path="/search">
//     <Search />
//   </Route>,
//   <Route key={5} path="/category/:slug">
//     <Category />
//   </Route>,
//   <Route key={6} path="/restaurants/:id">
//     <RestaurantDetail />
//   </Route>,
// ];

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

const clientRoutes = [
  {
    path: "/",
    component: <Restaurants />,
  },
  {
    path: "/search",
    component: <Search />,
  },
  {
    path: "/category/:slug",
    component: <Category />,
  },
  {
    path: "/restaurants/:id",
    //:~ 뒤에 나용이 파라미터에서 변수로 받을 변수명임!!!!
    component: <RestaurantDetail />,
  },
];

const commonRoutes = [
  { path: "/confirm", component: <ConfirmEmail /> },
  { path: "/edit-profile", component: <EditProfile /> },
  { path: "/orders/:id", component: <Order /> },
];

const restaurantRoutes = [
  { path: "/", component: <MyRestaurants /> },
  { path: "/add-restaurant", component: <AddRestaurant /> },
  { path: "/restaurants/:id", component: <MyRestaurant /> },
  //:~ 뒤에 나용이 파라미터에서 변수로 받을 변수명임!!!!
  { path: "/restaurants/:restaurantId/add-dish", component: <AddDish /> },
];

const driverRoutes = [{ path: "/", component: <Dashboard /> }];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  console.log(data);
  if (!data || loading || error) {
    return (
      <div>
        <div className="h-screen flex flex-col justify-center items-center">
          <div>
            <FontAwesomeIcon
              icon={faWalking}
              className="text-4xl mr-2 text-yellow-600"
            />
          </div>
          <span className="font-medium text-2xl tracking-wide text-center">
            Database is waking up now from sleep
            <br />
            <span className="text-lg">
              Please wait a moment..💕 It takes less than 30 Seconds..🕒
            </span>
            <br />
            <span className="text-sm mr-2"></span>
          </span>
        </div>
      </div>
    );
  }
  return (
    //무조껀 라우터 안에 있어야한다!! 모튼 컴포넌트는!
    <Router>
      <Header />
      <Switch>
        {data.me.role === UserRole.Client &&
          clientRoutes.map((route) => (
            <Route exact key={route.path} path={route.path}>
              {route.component}
            </Route>
          ))}
        {data.me.role === UserRole.Owner &&
          restaurantRoutes.map((route) => (
            <Route exact key={route.path} path={route.path}>
              {route.component}
            </Route>
          ))}
        {data.me.role === UserRole.Delivery &&
          driverRoutes.map((route) => (
            <Route exact key={route.path} path={route.path}>
              {route.component}
            </Route>
          ))}
        {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path}>
            {route.component}
          </Route>
        ))}

        {/* <ClientRoutes/>를 ClientRoutes 로 해줌 ClientRoutes를 배열로 만들어주면*/}
        {/* {data.me.role === "Client" && ClientRoutes}
        를 찾을수없으면  또는찾는 경로가 없으면 /로 보낼것임!*/}
        {/* <Redirect to="/" /> */}
        <Route>
          <NotFound />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
};
