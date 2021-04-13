import React, { useState } from "react";
import { faSearch, faShoppingBasket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-awesome-modal";

export const OrderDetailModal = (orderItems) => {
  console.log(orderItems);
  const [visible, setVisible] = useState(false);
  const openModal = () => {
    console.log(visible);
    setVisible(true);
  };
  const closeModal = () => {
    setVisible(false);
  };
  return (
    <div>
      <Modal
        visible={visible}
        width="350"
        height="420"
        effect="fadeInUp"
        onClickAway={() => closeModal()}
      >
        <div>
          {orderItems.orderItems && (
            <div className="p-4">
              <div className="flex justify-center items-center mb-4">
                <div className="text-2xl font-semibold mr-2">
                  Your Order List
                </div>
                <FontAwesomeIcon
                  icon={faShoppingBasket}
                  className="text-xl mt-1 text-yellow-500"
                />
              </div>
              {orderItems?.orderItems?.items?.map((item, index) => (
                <div key={index} className="mb-2">
                  <div className="text-lg ">{item.id}</div>

                  {/* {dish.options !== null &&
                dish.options !== undefined &&
                dish.options.map((option, index) => (
                  <div key={index} className="text-base">
                    - {option.name}
                  </div>
                ))} */}
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
