import React from "react";

interface IDishOptionProps {
  isSelected: boolean;
  name: string;
  optionName: string;
  extra?: number | null;
  dishId: number;
  addOptionToItem: (dishId: number, name: string, optionName: string) => void;
  removeOptionFromItem: (
    dishId: number,
    name: string,
    optionName: string
  ) => void;
}

export const DishOption: React.FC<IDishOptionProps> = ({
  isSelected,
  name,
  optionName,
  extra,
  addOptionToItem,
  removeOptionFromItem,
  dishId,
}) => {
  const onClick = () => {
    if (isSelected) {
      removeOptionFromItem(dishId, name, optionName);
    } else {
      addOptionToItem(dishId, name, optionName);
    }
  };
  return (
    <span
      onClick={onClick}
      className={`border px-2 py-1 ${
        isSelected ? "border-gray-800" : "hover:border-gray-800"
      }`}
    >
      <span className="mr-2">{optionName}</span>
      {<span className="text-sm opacity-75">(${extra})</span>}
    </span>
  );
};
