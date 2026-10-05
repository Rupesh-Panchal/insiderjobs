import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const EmployeeLogin = () => {
    const [state, setState] = useState("Login");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { backendurl, setShowEmployeeLogin, setUserData, setUserToken } = useContext(AppContext);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            if (state === "Login") {
                const { data } = await axios.post(backendurl + "/api/users/login", {
                    email,
                    password,
                });

                if (data.success) {
                    setUserData(data.user);
                    setUserToken(data.token);
                    localStorage.setItem("userToken", data.token);
                    setShowEmployeeLogin(false);
                    toast.success("Login successful");
                } else {
                    toast.error(data.message);
                }

                return;
            }

            if (password !== confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }

            if (password.length < 6) {
                toast.error("Password must be at least 6 characters");
                return;
            }

            const { data } = await axios.post(backendurl + "/api/users/register", {
                name,
                email,
                password,
            });

            if (data.success) {
                toast.success("Account created successfully");
                // If backend automatically logs user in after signup
                if (data.token) {
                    setUserData(data.user);
                    setUserToken(data.token);
                    localStorage.setItem("userToken", data.token);
                    setShowEmployeeLogin(false);
                } else {
                    setState("Login");
                    setPassword("");
                    setConfirmPassword("");
                    toast.info("Please login with your new account");
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Employee authentication error:", error);

            toast.error(error.response?.data?.message || error.message || "Something went wrong");
        }
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
            <form onSubmit={onSubmitHandler} className="relative bg-white p-10 rounded-xl text-slate-500 w-[90%] max-w-md">
                {/* Heading */}
                <h1 className="text-center text-2xl text-neutral-700 font-medium">Employee {state}</h1>
                <p className="text-sm text-center mt-1">{state === "Login" ? "Welcome back! Please login to continue" : "Create your employee account to apply for jobs"}</p>

                {/* Name */}
                {state === "Sign Up" && (
                    <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-6">
                        <img src={assets.person_icon} alt="" className="w-4" />
                        <input className="outline-none text-sm w-full" onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Full Name" required />
                    </div>
                )}

                {/* Email */}
                <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                    <img src={assets.email_icon} alt="" className="w-4" />
                    <input className="outline-none text-sm w-full" onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Email ID" required />
                </div>

                {/* Password */}
                <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                    <img src={assets.lock_icon} alt="" className="w-4" />
                    <input className="outline-none text-sm w-full" onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Password" required />
                </div>

                {/* Confirm Password */}
                {state === "Sign Up" && (
                    <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                        <img src={assets.lock_icon} alt="" className="w-4" />
                        <input
                            className="outline-none text-sm w-full"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            type="password"
                            placeholder="Confirm Password"
                            required
                        />
                    </div>
                )}

                {/* Forgot Password */}
                {state === "Login" && <p className="text-sm text-blue-600 mt-4 cursor-pointer">Forgot Password?</p>}

                {/* Submit */}
                <button type="submit" className="bg-blue-600 w-full text-white py-2 rounded-full cursor-pointer mt-5">
                    {state === "Login" ? "Login" : "Create Account"}
                </button>

                {/* Switch Login / Signup */}
                {state === "Login" ? (
                    <p className="mt-4 text-center text-sm">
                        Don't have an account?{" "}
                        <span
                            className="text-blue-600 cursor-pointer"
                            onClick={() => {
                                setState("Sign Up");
                                setPassword("");
                                setConfirmPassword("");
                            }}
                        >
                            Sign Up
                        </span>
                    </p>
                ) : (
                    <p className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <span
                            className="text-blue-600 cursor-pointer"
                            onClick={() => {
                                setState("Login");
                                setPassword("");
                                setConfirmPassword("");
                            }}
                        >
                            Login
                        </span>
                    </p>
                )}

                {/* Close */}
                <img onClick={() => setShowEmployeeLogin(false)} className="absolute top-5 right-5 cursor-pointer w-4" src={assets.cross_icon} alt="" />
            </form>
        </div>
    );
};

export default EmployeeLogin;
