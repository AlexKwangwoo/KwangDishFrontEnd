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
처음사용할때 모든파일 다 검사하기에 특정부분(우리가 테스트하고싶은부분)
만 할수있게 설정해야함!
"test:coverage": "npm test -- --coverage --watchAll=false",
"jest": {
"collectCoverageFrom": [
"./src/components/**/*.tsx",
"./src/pages/**/*.tsx",
"./src/routers/**/*.tsx"
]
}

최상위루트 app을 지워주고 컴포넌트 파일로 옮김..테스트를 위하여!
그리고 테스트 대상은 \_\_test\_\_(밑줄두개..인식이안됨)안에 넣어야 jest가 인식할것임!
