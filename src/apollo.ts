import {
  ApolloClient,
  InMemoryCache,
  makeVar,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { LOCALSTORAGE_TOKEN } from "./constants";

// export const isLoggedInVar = makeVar(false);
//이 makevar => reactVeriable 은 어디든지 사용가능하고 이게 바뀌면
// 이걸 사용하는 모든 친구들이 자동으로 refresh된다!

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
//로컬에서 처음에 토큰을 못가져오면 null리턴이고 boolean(null)
//은 false이다!
//즉처음에 isLoggedInVar 은 false고 authTokenVar은 null임!
//그뒤로 토큰이 로컬에 저장되면 true가 되고 토큰도 값이 있음
export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  //여기는 모든 리퀘스트보낼때 발생할것임!!!! 이것의 기능이 그러함!
  //로그인 없어도 여기 request는 헤더를 포함시킨다!!
  return {
    headers: {
      ...headers,
      //토큰이 없으면 null을 보내겠음!
      "x-jwt": authTokenVar() || "",
    },
  };
});

export const client = new ApolloClient({
  //link는 연결시켜준다 http, auth, webSocket등
  link: authLink.concat(httpLink),
  //localhost~~ head+ 토큰 정보를 넣어 보내겠음!
  cache: new InMemoryCache({
    //캐시를 사용하여 localstate를 저장할것임..
    //백앤드 설정안한것도 프론트앤드에서 만질수있음!
    typePolicies: {
      Query: {
        fields: {
          //밑에 것이 gql로컬스테이스 쿼리이름이다!
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },

          token: {
            read() {
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});
