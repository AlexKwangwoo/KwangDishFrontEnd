import React from "react";

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

export const Button: React.FC<IButtonProps> = ({
  canClick,
  loading,
  actionText,
}) => (
  <button
    role="button"
    className={`text-lg font-medium focus:outline-none text-white py-4  transition-colors ${
      canClick
        ? "bg-yellow-400 hover:bg-yellow-500"
        : "bg-gray-300 pointer-events-none"
      //pointer-events-none 은 클릭못하게한다!
    }`}
  >
    {loading ? "Loading..." : actionText}
  </button>
);
