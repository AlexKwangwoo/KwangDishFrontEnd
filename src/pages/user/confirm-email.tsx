import React, { useEffect } from "react";
import { verifyEmail, verifyEmailVariables } from "../../generated/verifyEmail";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import { useMe } from "../../hooks/useMe";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

//이메일 검증이 되면 수동적으로 캐쉬에 접근해
//현재 유저가 verified가 false라면 직접 true로 바꿔서
//새로고침없이 바로 화면이 전환되게 할것이다!
export const ConfirmEmail = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  //아폴로 캐쉬 접근!!client라 하자!
  const history = useHistory();

  console.log(client);
  const onCompleted = (data: verifyEmail) => {
    const {
      verifyEmail: { ok },
    } = data;
    if (ok && userData?.me.id) {
      //여기서 리딩과 쓰기를 캐쉬에 할것이다!
      //16.1참고!! User는 아폴로 캐쉬에있음!
      //캐쉬가서 비교해보면알수있다!@
      //VerifiedUser는 내가 정하면되지만 on뒤에는 아폴로캐쉬
      //안의 이름으로 써야함! ex User:12 유저:12가 id가되어야한다!!
      //12가 id가 아님!! 중요함!!
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
            # 바꾸고 싶은 영역을 정한다!!
          }
        `,
        // 보내고 싶은 데이터를 쓴다!
        data: {
          verified: true,
        },
      });
      history.push("/");
    }
  };

  const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(
    VERIFY_EMAIL_MUTATION,
    {
      onCompleted,
    }
  );

  useEffect(() => {
    const [, code] = window.location.href.split("code=");
    //window.location.href URL을 가져올수있다!! 위에껄 split하면
    //두가지 배열이 오는데 처음껀 필요없고 code=뒤에게 const code에 들어감!

    verifyEmail({
      variables: {
        input: {
          code,
        },
      },
    });
  }, [verifyEmail]);

  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <Helmet>
        <title>Verify Email | Nuber Eats</title>
      </Helmet>
      <h2 className="text-lg mb-1 font-medium">Confirming email...</h2>
      <h4 className="text-gray-700 text-sm">
        Please wait, don't close this page...
      </h4>
    </div>
  );
};
