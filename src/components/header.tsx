import { faList, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import nuberLogo from "../images/logo.svg";
import { useForm } from "react-hook-form";
import KwangLogoBlack from "../images/KwangLogoBlack.png";
import Modal from "react-awesome-modal";
import { ModalDetail } from "./modalDetail";
interface IFormProps {
  searchTerm: string;
}

export const Header: React.FC = () => {
  const { data } = useMe();
  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const history = useHistory();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: "/search",
      search: `?term=${searchTerm}`,
      // state도 있음 스테이트는 감춰서 보냄! 하지만 useLocation
      //으로 찾을수있음! //새로고침해도 리액트가 브라우저 메모리에 저장시킴!
    });
  };

  const [visible, setVisible] = useState(false);
  const openModal = () => {
    console.log(visible);
    setVisible(true);
  };
  const closeModal = () => {
    setVisible(false);
  };

  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-center text-base text-white">
          <span>Please verify your email.</span>
        </div>
      )}
      <header className="py-4">
        <div className="w-full px-5 xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-center">
          <Link to="/">
            <img src={KwangLogoBlack} className="w-48 mr-11" alt="Nuber Eats" />
          </Link>
          <form
            onSubmit={handleSubmit(onSearchSubmit)}
            className="md:w-2/3 flex bg-gray-100 items-center border-b-2 border-black"
          >
            <div className="ml-4">
              <FontAwesomeIcon icon={faSearch} className="text-lm" />
            </div>
            <input
              ref={register({ required: true, min: 3 })}
              name="searchTerm"
              type="Search"
              className="input rounded-sm border-none bg-gray-100 w-3/4 md:w-full placeholder-gray-500"
              placeholder="What are you craving?"
            />
          </form>
          <span className="text-xs ml-4">
            <FontAwesomeIcon
              onClick={openModal}
              icon={faList}
              className="text-3xl cursor-pointer"
            />
            <Modal
              visible={visible}
              width="350"
              height="420"
              effect="fadeInUp"
              onClickAway={() => closeModal()}
            >
              <div className="p-8">
                <ModalDetail />
              </div>
            </Modal>

            {/* <Link to="/edit-profile">
              <FontAwesomeIcon icon={faUser} className="text-3xl" />
            </Link> */}
          </span>
        </div>
      </header>
    </>
  );
};
