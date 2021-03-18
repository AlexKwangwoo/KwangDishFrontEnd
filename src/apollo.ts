import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";

export const isLoggedInVar = makeVar(false);
//이 makevar => reactVeriable 은 어디든지 사용가능하고 이게 바뀌면
// 이걸 사용하는 모든 친구들이 자동으로 refresh된다!

export const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
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
        },
      },
    },
  }),
});
