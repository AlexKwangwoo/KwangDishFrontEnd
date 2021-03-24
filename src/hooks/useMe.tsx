import { gql, useQuery } from "@apollo/client";
import { meQuery } from "../generated/meQuery";

export const ME_QUERY = gql`
  query meQuery {
    me {
      # id가 있으면 아폴로가 캐쉬저장할때 이걸 id로 쓴다!
      id
      email
      role
      verified
    }
  }
`;

export const useMe = () => {
  return useQuery<meQuery>(ME_QUERY);
};
