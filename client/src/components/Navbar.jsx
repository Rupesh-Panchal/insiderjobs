import React, { useContext } from "react";
import { assets } from "../assets/assets.js";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

const Navbar = () => {
  {
    /*  User button */
  }
  const { openSignIn } = useClerk(); // Hook to open the sign-in modal

  const { user } = useUser(); // Hook to get the current user information

  {
    /*  Navigate to Homepage */
  }
  const navigate = useNavigate(); // Hook to programmatically navigate

  const { setShowRecruiterLogin } = useContext(AppContext);

  return (
    <div className="shadow py-4 mt-3">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        {/** Logo that navigates to the homepage when clicked */}
        <img
          className="cursor-pointer"
          onClick={() => navigate("/")}
          src={assets.logo}
          alt=""
        />
        {user ? ( // Check if the user is logged in
          <div className="flex items-center gap-3">
            {/* Link to applied jobs page */}
            <Link to={"/applications"}>Applied Jobs</Link>
            <p>|</p>

            {/** Display user's name if logged in */}
            <p className="max-sm:hidden">
              Hi, {user.firstName + " " + user.lastName}
            </p>
            <UserButton />
          </div>
        ) : (
          <div className="flex gap-4 max-sm:text-xs">
            <button
              onClick={(e) => setShowRecruiterLogin(true)}
              className="text-gray-600 cursor-pointer"
            >
              Recruiter Login
            </button>
            <button
              onClick={(e) => {
                openSignIn(); // Open the sign-in modal when clicked
              }}
              className="bg-blue-600 text-white px-5 sm:px-9 py-2 rounded-full cursor-pointer"
            >
              Login {/* Button to trigger login modal */}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
