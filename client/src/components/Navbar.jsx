import React, { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

const Navbar = () => {
    const navigate = useNavigate();

    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const { setShowRecruiterLogin, setShowEmployeeLogin, userData, setUserData, setUserToken } = useContext(AppContext);

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        setUserData(null);
        setUserToken("");
        navigate("/");
    };

    return (
        <div className="shadow py-4 mt-3">
            <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
                {/* Logo */}
                <img className="cursor-pointer" onClick={() => navigate("/")} src={assets.logo} alt="" />

                {userData ? (
                    <div className="flex items-center gap-3">
                        {/* Applied Jobs */}
                        <Link to="/applications">Applied Jobs</Link>

                        <p>|</p>

                        {/* Employee Profile Menu */}
                        <div className="relative">
                            <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 cursor-pointer">
                                <span className="max-sm:hidden">Hi, {userData.name}</span>

                                <span className="text-sm">▾</span>
                            </button>

                            {showProfileMenu && (
                                <div className="absolute right-0 top-10 w-48 bg-white border rounded-lg shadow-lg z-50">
                                    {/* My Profile */}
                                    <button
                                        onClick={() => {
                                            setShowProfileMenu(false);
                                            navigate("/profile");
                                        }} className="w-full text-left px-4 py-3 hover:bg-gray-100 cursor-pointer"
                                    >
                                        My Profile
                                    </button>

                                    {/* My Applications */}
                                    <button
                                        onClick={() => {
                                            setShowProfileMenu(false);
                                            navigate("/applications");
                                        }} className="w-full text-left px-4 py-3 hover:bg-gray-100 cursor-pointer"
                                    >
                                        My Applications
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Logout */}
                        <button onClick={handleLogout} className="text-red-500 cursor-pointer">
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-4 max-sm:text-xs">
                        {/* Recruiter Login */}
                        <button onClick={() => setShowRecruiterLogin(true)} className="text-gray-600 cursor-pointer">
                            Recruiter Login
                        </button>

                        {/* Employee Login */}
                        <button onClick={() => setShowEmployeeLogin(true)} className="bg-blue-600 text-white px-5 sm:px-9 py-2 rounded-full cursor-pointer">
                            Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
