- npx cypress open (npm run start 한뒤에 하면된다!!)
- multer 업로드 기능을 할 수 있다!

Tailwind의 screen은 640px부터 시작된다!
아무것도 적지않으면 sm화면이라고 보면된다.. px-5면 작은사이즈일때 패딩5주고
xl:px-0이면 화면 xl크기일때 패딩이 0이된다!
(이유는 테일윈드는 모바일전용이기에 sm이 디폴트이다!)

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

로컬스토리지 이용!!
localStorage.setItem(LOCALSTORAGE_TOKEN, token);
LOCALSTORAGE_TOKEN이 "nuber-token"이므로 속성이름이nuber-token에다가
토큰을 저장한다!

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
토큰사용!!

hook 사용하여 api를 만들면
훅쓸때마다 api를 사용해야만하나?(루트쪽에서
api를 로드시셔서 props로 가져다 주면 몇번이고
api를 안불러도 되는데.. 그대신 깊숙한 컴포넌트까지
계속 끌고 내려가야하지만..)
apollo 는 그래서 좋다. 왜냐하면 처음 api를 통해
쿼리를 사용하게되면 캐시에 저장된다 그리고 다시 같은 api를
사용할려는경우 apollo는 캐시부터 뒤져본다 그리고 있으면 api사용안하고
캐시안에서 가져오고 없으면 api 를 로드해 원하는걸 가져온다!
캐시에 유저가 저장되면 verified가 false(처음로그인)인경우에
우리가 캐시를 이용해 캐시에 저장된User:1 (아폴로클라이언트속)을 false를
true로 바꿔줄것이다 그렇게하면 캐시가 변경됨에 따라 자동적으로 새로고침없이
화면이 바뀔것이다! (이메일 검증해주세요 빨간색이 없어지고 home화면으로 redirect됨!)

캐쉬를 사용해 업데이트하자.. 예를들어 프로필을 업데이트후 다시
백앤드에서 api를 불러오게되면
웹사이트가 느리다..
(어짜피 저장은 디비에 새로 될것임.. 즉 저장되길 기다리고 다시
api를 불어올걸 기다릴 필요가 없음!)  
캐시 수정방법 직접 써서 수정하는방법과 fragment써서,.,,
또는!!!
UseQuery를 refetch하는것임!
리패치는 다시 api를 가져오는것임!(느릴수있음 서버가 크면!!)
const { data: userData, refetch } = useMe();

최상위 컴포넌트에 css(group)을 적어주면 그밑의 친구들이 작동한다
예를들어 최상위가 group이고 자식컴포넌트가 group-hover:bg-gray이면
최상위 컴포넌트가 호버될때 자식컴포넌트가 gray된다

interface IFormProps {
searchTerm: string;
}
이건 input name이랑 searchTerm여기가 똑같아야 타입검사함!!

Lazy Query(조건에 따라 실행되는 쿼리)
(예를들어 검색어 없이 search?term=)에 못간다!
useLazyQuery의 callQuery를 실행해야지만 이 쿼리가 실행되는것임!!
useQuery는 변수보자마자 미리 실행을 시켜놓을것임!!
즉 [a,{loading,error}]=useLazyQuery는 a가 실행되어야만 쿼리가 작동함!

Replace VS push
history.replace("/");는 뒤로가기 안되고 푸시는
기록에 남긴다! 리플레이스는 히스토리에 없다!
예를들어 search?term=korean해서 search만 남기고 페이지 이동했는데
그러면 검색어가 없기에 replace로인해 /로 가지만 뒤로 가기하면 seach남긴
url로 가지않고 전전인 search?term=korean으로 가게된다!

fragment 쓰면 gql에서 속성을 다안써줘도 된

URL 에 온내용 param으로 써보기(split으로 해도되고!)
const params = useParams<ICategoryParams>();
이 있다면 주소가 /category/:slug 라면(:다음설정한게 params의 속성이됨!)
http://localhost:3000/category/american 주소에서
params.slug는 american이 된다!

--jest
---(**로직을 검사하는게 아니다!! 사용자가 보일 화면만 테스트 할것임!!)-----------
처음사용할때 모든파일 다 검사하기에 특정부분(우리가 테스트하고싶은부분)
만 할수있게 설정해야함!
"test:coverage": "npm test -- --coverage --watchAll=false",
"jest": {
"collectCoverageFrom": [
"./src/components/**/_.tsx",
"./src/pages/\*\*/_.tsx",
"./src/routers/\*_/_.tsx"
]
}

최상위루트 app을 지워주고 컴포넌트 파일로 옮김..테스트를 위하여!
그리고 테스트 대상은 \_\_test\_\_(밑줄두개..인식이안됨)안에 넣어야 jest가 인식할것임!
test 패키지 제이슨에서 --verbose쓰면 describe 글 보여준다
//waitfor은 바로 바뀌지 않을때 써야한다.. 헬멧은 랜더가 바로안되고
//몇초뒤에 바뀌기에 waitfor을 써서 기다려줘야한다!

mock하는 두가지 유형방법

1. MockedProvider 를 사용하여 쿼리에주는 변수를 목한다!
2. Mock Apollo Client를 사용하면됨!<-조금더 좋은 테스트 방법
   - client를 목해서 apolloprovider에 넣어주면된다!
   - 이걸 사용하는 이유는 아폴로 테스트 기본방법은 그냥은안되는데
   - 이걸 이용해 뮤테이션에 접근할수있다!(아웃풋만 만질수있는데 이걸통해 form에입력가능)\

implementation부분(로직부분)은 우리가 신경쓰지 않기에 100%채울수없다!

spyOn은 alert처럼 implement 안된다 할때 강제로 사용하여 지켜볼수있다.
리턴을 아무것도 안해주면 그냥 월래 있던걸 진행시키겠다는 의미!

- 라이버리를 테스트 하고싶을땐 라이브러리 자체를 목해야한다!! createAccountTest에있음

- cypress 의 tsconfig는 react application의 typescript 구성과는 다르다!!
- 또한 findByPlaceholderText 와 같은 리액트 테스트 컴포넌트가 없기에 우리가
  직접 설치 해줘서 사용해야한다!(npm i @testing-library/cypress --save-dev) 해야함
  commands 가서 import "@testing-library/cypress/add-commands"; 쓰고
  tsconfig도 types에 "@testing-library/cypress" 이것을 추가해야함!
- cypress의 req res 둘다 intercept 가능하다!! create와 edit profile살펴볼것!
  아이디를 만들때는 일단 디비에 넣고 같은게 있으면 오류가 뜨는데 그 오류를 인터셉트해
  res 로 ok를 true로 해줘서 오류를 안뜨게 한다
  edit profile은 req(요청)자체를 바꿔서 보내게 되기에 이름이 수정이 안된다!
