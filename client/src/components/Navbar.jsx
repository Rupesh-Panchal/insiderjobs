import React, { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

const Navbar = () => {
    const navigate = useNavigate();

    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const { setShowRecruiterLogin, setShowEmployeeLogin, userData, setUserData, setUserToken } = useContext(AppContext);

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        setUserData(null);
        setUserToken("");
        setShowProfileMenu(false);
        setShowMobileMenu(false);
        navigate("/");
    };

    const handleMobileNavigation = (path) => {
        setShowMobileMenu(false);
        navigate(path);
    };

    return (
        <div className="shadow mt-3 bg-white relative z-50">
            <div className="container px-4 sm:px-6 2xl:px-20 mx-auto">
                <div className="h-16 flex items-center justify-between">
                    <img className="cursor-pointer w-36 sm:w-auto"
                        onClick={() => {
                            setShowMobileMenu(false);
                            setShowProfileMenu(false);
                            navigate("/");
                        }} src={assets.logo} alt="InsiderJobs"
                    />

                    {userData ? (
                        <>
                            <div className="sm:hidden flex items-center gap-2">
                                <span className="text-xs font-medium whitespace-nowrap max-w-[85px] truncate">Hi, {userData.name}</span>
                    
                                <button type="button" onClick={handleLogout} className="text-xs text-red-500 whitespace-nowrap cursor-pointer">
                                    Logout
                                </button>

                                <button type="button"
                                    onClick={() => {
                                        setShowMobileMenu(!showMobileMenu);
                                        setShowProfileMenu(false);
                                    }} className="w-8 h-8 flex items-center justify-center cursor-pointer" aria-label="Toggle navigation menu" aria-expanded={showMobileMenu}
                                >
                                    <span className="text-xl leading-none">{showMobileMenu ? "✕" : "☰"}</span>
                                </button>
                            </div>

                            <div className="hidden sm:flex items-center gap-3">
                                <Link to="/applications" className="cursor-pointer">
                                    Applied Jobs
                                </Link>

                                <p className="text-gray-400">|</p>

                                <div className="relative">
                                    <button type="button" onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 cursor-pointer">
                                        <span>Hi, {userData.name}</span>
                                        <span className="text-sm">▾</span>
                                    </button>

                                    {showProfileMenu && (
                                        <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                                            <button type="button"
                                                onClick={() => {
                                                    setShowProfileMenu(false);
                                                    navigate("/profile");
                                                }} className="w-full text-left px-4 py-3 hover:bg-gray-100 cursor-pointer"
                                            >
                                                My Profile
                                            </button>

                                            <button type="button"
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

                                <button type="button" onClick={handleLogout} className="text-red-500 cursor-pointer">
                                    Logout
                                </button>
                            </div>

                            {showMobileMenu && (
                                <div className="absolute left-0 right-0 top-[64px] bg-white border-t border-gray-200 shadow-md sm:hidden z-50">
                                    <div className="container px-4 mx-auto py-2">
                                        <button type="button" onClick={() => handleMobileNavigation("/profile")} className="w-full text-left px-3 py-3 rounded-md hover:bg-gray-100 cursor-pointer">
                                            My Profile
                                        </button>

                                        <button type="button" onClick={() => handleMobileNavigation("/applications")} className="w-full text-left px-3 py-3 rounded-md hover:bg-gray-100 cursor-pointer">
                                            Applied Jobs
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="hidden sm:flex items-center gap-4">
                                <button type="button" onClick={() => setShowRecruiterLogin(true)} className="text-gray-600 cursor-pointer">
                                    Recruiter Login
                                </button>

                                <button type="button" onClick={() => setShowEmployeeLogin(true)} className="bg-blue-600 text-white px-5 sm:px-9 py-2 rounded-full cursor-pointer">
                                    Login
                                </button>
                            </div>

                            <div className="sm:hidden flex items-center gap-2">
                                <button type="button" onClick={() => setShowRecruiterLogin(true)} className="text-xs text-gray-600 whitespace-nowrap cursor-pointer">
                                    Recruiter
                                </button>

                                <button type="button" onClick={() => setShowEmployeeLogin(true)} className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs whitespace-nowrap cursor-pointer">
                                    Login
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
