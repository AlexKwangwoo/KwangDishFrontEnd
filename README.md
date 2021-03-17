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