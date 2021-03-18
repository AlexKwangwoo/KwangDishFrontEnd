Tailwind 를 커스터마이징 하기위해 tailwind config파일이 필요하고!
postCss 는 inline css가 보통 md-background~~
이면 md는 테일윈드가 안붙여준다 그래서 postcss가 알아서 붙여줌!

package json에서 script부분에
"tailwind:build": ->
"tailwind build ./src/styles/tailwind.css -o ./src/styles/styles.css",
"start": "npm run tailwind:build & react-scripts start",
추가 하여 npm run start 시 테일윈드 만의 방법으로
css변경해 ./src/styles/styles.css", 로 아웃풋하겠음 -o <-아웃풋하겠음!

로컬호스트 4000/graphql로 디비가 연결되어 localhost3000가서 inspect에서
apollo 들어가면 grqphql doc가면 그동안 만든 디비 스키마들 다 볼수있음!

로컬스테이트 저장법
apollo.ts의 cache => typePolicies -> Query -> fields -> 여기에 쓸 쿼리 지정
컴포넌트 가서 gql`` + 메인함수에서 useQuery로 사용하면됨!

prettier와 eslint작용안되면
npm i -D eslint prettier eslint-config-airbnb-typescript-prettier
한뒤 src에 eslintc.js와 prettierrc.js 한것처럼 추가!!

tailwind가 PureCss에 적용이 안될때!!
https://stackoverflow.com/questions/62118325/how-do-you-get-rid-of-these-sass-linting-errors-when-using-tailwind-css/62254613#62254613
이용한다!

햇깔리면 15.7보기
아폴로 이용해서 타입 정하기!!
apollo client:codegen --target=typescript --outputFlat 입력하면(최상위루트로 다모아줌!!)
gql 태그된곳을 찾아서 내가 쓴 mutation이름으로 타입을 정해주고 mutation이 가져올(백엔드에서) 뮤테이션 이름(ex) login 을 우리가 정해준 dto 타입정리를 가져다 준다! loginMutation_login loginMutation loginMutationVariables 세가지를 자동만들어줌 내가 이름만 백앤드에서썼던 login 이라고만 잘 gql에 써준다면!

인풋까지 타입 받고싶으면 LoginInput! 을 백앤드와 똑같이 써준다!
mutation loginMutation($loginInput: LoginInput!) {
login(input: $loginInput) {

여기서 variable은 인풋타입이라 보면되고
loginMutation은 아웃풋타입이라 보면됨!
export interface loginMutation {
login: loginMutation_login;
}

export interface loginMutationVariables {
loginInput: LoginInput;
}
