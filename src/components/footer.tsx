import React from "react";
import apple from "../images/apple.jpg";
import google from "../images/google.jpg";
import KwangLogoWhite from "../images/KwangLogoWhite.png";
import sns from "../images/sns.jpg";

export const Footer = () => {
  return (
    <div className="bg-black sm:w-full sm:h-96 h-0 w-0 mt-52">
      <div className="flex p-8 px-48">
        <div className=" w-1/2 h-0 sm:h-60 border-b-2 border-white">
          <div>
            <img src={KwangLogoWhite} className="w-56 mb-32" alt="Nuber Eats" />
            <div className="flex">
              <img src={apple} className="w-28 mr-6" alt="Nuber Eats" />
              <img src={google} className="w-28" alt="Nuber Eats" />
            </div>
          </div>
          <div></div>
        </div>
        <div className="w-1/4  h-0  sm:h-60 border-b-2 border-white">
          <div className="text-white">
            <div className="mb-2">About Kwang Dish</div>
            <div className="mb-2">Read our blog</div>
            <div className="mb-2">Buy gift cards</div>
            <div className="mb-2">Create a business account</div>
            <div className="mb-2">Add your restaurant</div>
            <div className="mb-2">Sign up to deliver</div>
          </div>
        </div>
        <div className="w-1/4  h-0  sm:h-60 border-b-2 border-white">
          <div className="text-white">
            <div className="mb-2">Get Help</div>
            <div className="mb-2">View all cities</div>
            <div className="mb-2">View all countries</div>
            <div className="mb-2">Restaurants near me</div>
            <div className="mb-2">English</div>
          </div>
        </div>
      </div>
      <div className="flex px-48">
        <div className="w-1/2 h-30 text-white">
          <img src={sns} className="w-28" alt="Nuber Eats" />
        </div>
        <div className="w-1/2 h-30 text-white flex justify-end">
          <div className="mr-4">Privacy Policy</div>
          <div className="mr-4">Terms</div>
          <div>Pricing</div>
        </div>
      </div>
    </div>
  );
};
