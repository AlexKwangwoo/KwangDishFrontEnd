import React from "react";

interface IFormErrorProps {
  errorMessage: string;
}

//리엑트에 적용방법 React.FC하고 타입을 넣어주면된다! 그러면 prop을 검사해줄것임!
export const FormError: React.FC<IFormErrorProps> = ({ errorMessage }) => (
  <span role="alert" className="font-medium text-red-500">
    {errorMessage}
  </span>
);
