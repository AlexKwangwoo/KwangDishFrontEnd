import {
  ApolloClient,
  InMemoryCache,
  makeVar,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { LOCALSTORAGE_TOKEN } from "./constants";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

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

//디비에서 query.를 사용해 연결할때는 request header를 가지고
//subscription을 사용하면 connection의 context를 사용했다!
const wsLink = new WebSocketLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "wss://kwang-eats-backend.herokuapp.com/graphql"
      : //nelify가 우리에게 https 와 wss를 제공함 s하나더추가함으로 보안성높임!
        `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      "X-JWT": authTokenVar() || "",
      // "x-jwt": authTokenVar() || "",
      //여기 내용들은 아폴로 그래프큐엘 참조함 23.2강
      //req는 x-jwt로 오지만 connection 소켓으로오는건 x-jwt대문자로 넣어줘야함!!
    },
  },
});

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "https://kwang-eats-backend.herokuapp.com/graphql"
      : "http://localhost:4000/graphql",
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

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    ); //subscription은 웹소켓을쓰기에 다르게 받아줘야한다!
  },
  //위의 함수는 false 또는 true를 줄껀데 true면 wsLink고
  //false면 authLink로 갈껏임! //일반 사용은 false받아  authLink로 갈것임!
  wsLink,
  authLink.concat(httpLink)
);

export const client = new ApolloClient({
  //link는 연결시켜준다 http, auth, webSocket등
  link: splitLink,
  // link: authLink.concat(httpLink),
  //localhost~~ head+ 토큰 정보를 넣어 보내겠음!
  cache: new InMemoryCache({
    //캐시를 사용하여 localstate를 저장할것임..
    //백앤드 설정안한것도 프론트앤드에서 만질수있음!
    typePolicies: {
      Query: {
        fields: {
          //밑에 것이 gql로컬스테이스 쿼리이름이다!
          //이걸 사용하기위해서는 gql``를 사용해야한다!! 백앤드까지 안감!
          //지금은 전역변수로 밑에껄 안썼지만 app에서 쓸려면
          //const IS_LOGGED_IN = gql`
          //   query isLoggedIn {
          //     isLoggedIn @client
          //   }
          // `; <--- 이부분을 써줘야함
          //그다음 usdQuery(IS_LOGGED_IN) 으로 사용하면됨!
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
