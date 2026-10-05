import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="container px-4 2xl:px-20 mx-auto flex items-center justify-between gap-4 py-3 mt-20 mb-3">
      {/** Logo of the application */}
      <img src={assets.logo} alt="Job Portal Logo" />

      {/** Copyright text, hidden on small screens */}
      <p className="flex-1 pl-4 text:sm text-gray-500 max-sm:hidden">
        Copyright @2025 Job Portal. All rights reserved.
      </p>

      {/** Social media icons */}
      <div className="flex gap-2.5">
        <img width={38} src={assets.facebook_icon} alt="Facebook" />{" "}
        {/* Facebook icon */}
        <img width={38} src={assets.twitter_icon} alt="Twitter" />{" "}
        {/* Twitter icon */}
        <img width={38} src={assets.instagram_icon} alt="Instagram" />{" "}
        {/* Instagram icon */}
      </div>
    </div>
  );
};

export default Footer;
