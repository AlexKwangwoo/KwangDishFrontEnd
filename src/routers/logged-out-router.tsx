import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { CreateAccount } from "../pages/create-account";
import { Login } from "../pages/login";
import { NotFound } from "../pages/404";

export const LoggedOutRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/create-account">
          <CreateAccount />
        </Route>
        <Route path="/" exact>
          <Login />
        </Route>
        {/* 로그인 안된상태..즉 여기페이지에서 /다음 이상한거 입력하면
        notfound 페이지로 가게된다! */}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};

// import React from "react";
// import { useForm } from "react-hook-form";

// //타입스크립트 적용시키기!!
// interface IForm {
//   email: string;
//   password: string;
// }

// export const LoggedOutRouter = () => {
//   const { register, watch, handleSubmit, errors } = useForm<IForm>();
//   //watch는 onChange라 보면됨.. 바뀌는걸 다 캐치함
//   const onSubmit = () => {
//     console.log(watch("password"));
//     console.log(watch());
//     //watch안에 필드네임 넣으면 그것만 반환할것임!
//     //빈칸은 바뀐거 싹다 넣어줄것임!
//   };
//   const onInvalid = () => {
//     console.log("cant create account");
//   };
//   console.log(errors);
//   return (
//     <div>
//       <h1>Logged Out</h1>
//       <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
//         {/* 첫번째인자는 유효할때 불리고 두번째는 아닐때!! */}
//         <div>
//           <input
//           //ref에 register넣어야 form적용됨!
//             ref={register({
//               required: "This is required",//무조껀 써야됨!!
//               pattern: /^[A-Za-z0-9._%+-]+@gmail.com$/,
//               // validate: (email:string) => email.includes("@gmail.com")
//             })}
//             name="email"
//             type="email"
//             placeholder="email"
//           />
//           {errors.email?.message && (
//             <span className="font-bold text-red-600">
//               {errors.email?.message}
//             </span>
//           )}
//           {errors.email?.type === "pattern" && (
//             <span className="font-bold text-red-600">Only gmail allowed</span>
//           )}
//         </div>
//         <div>
//           <input
//             ref={register({ required: true })}
//             name="password"
//             type="password"
//             required
//             placeholder="password"
//           />
//         </div>
//         <button className="bg-yellow-300 text-white">Submit</button>
//       </form>
//     </div>
//   );
// };
