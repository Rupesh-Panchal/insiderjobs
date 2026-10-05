import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext.jsx";

const Profile = () => {
    const navigate = useNavigate();

    const { backendurl, userToken, userData, setUserData } = useContext(AppContext);

    const [uploadingResume, setUploadingResume] = useState(false);
    const resumeInputRef = useRef(null);

    const handleResumeUpload = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

        if (!allowedTypes.includes(file.type)) {
            alert("Please upload a PDF, DOC, or DOCX file.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Resume size must be less than 5 MB.");
            event.target.value = "";
            return;
        }

        try {
            setUploadingResume(true);

            const formData = new FormData();
            formData.append("resume", file);

            const response = await fetch(`${backendurl}/api/users/update-resume`, {
                method: "POST",
                headers: {
                    token: userToken,
                },
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setUserData((prev) => ({
                    ...prev,
                    resume: data.resume,
                }));

                alert("Resume uploaded successfully.");
            } else {
                alert(data.message || "Failed to upload resume.");
            }
        } catch (error) {
            console.error("Resume upload error:", error);
            alert("Something went wrong while uploading the resume.");
        } finally {
            setUploadingResume(false);
            event.target.value = "";
        }
    };

    if (!userData) {
        return (
            <>
                <Navbar />

                <div className="min-h-[60vh] flex items-center justify-center px-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-800">Please login to view your profile</h2>

                        <button onClick={() => navigate("/")} className="mt-5 bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer">
                            Go to Home
                        </button>
                    </div>
                </div>

                <Footer />
            </>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* ================= NAVBAR ================= */}
            <Navbar />

            {/* ================= PROFILE CONTENT ================= */}
            <main className="flex-1">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back Button */}
                    <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 cursor-pointer">
                        <span>←</span>
                        <span>Back to Jobs</span>
                    </button>

                    {/* Page Heading */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold text-gray-900">My Profile</h1>

                        <p className="text-gray-500 mt-2">Manage your personal information and resume.</p>
                    </div>

                    {/* ================= PROFILE CARD ================= */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Profile Header */}
                        <div className="bg-gray-900 px-6 sm:px-8 py-8">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                {/* Profile Image */}
                                <div className="relative">
                                    {userData.image ? (
                                        <img src={userData.image} alt={userData.name} className="w-28 h-28 rounded-full object-cover border-4 border-white" />
                                    ) : (
                                        <div className="w-28 h-28 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-semibold border-4 border-white">
                                            {userData.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                    )}

                                    {/* Change Photo */}
                                    <button
                                        type="button"
                                        className="absolute bottom-0 right-0 bg-white text-gray-700 w-9 h-9 rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-100"
                                        title="Change photo"
                                    >
                                        ✎
                                    </button>
                                </div>

                                {/* User Details */}
                                <div className="text-center sm:text-left text-white">
                                    <h2 className="text-2xl font-semibold">{userData.name}</h2>

                                    <p className="text-gray-300 mt-1">{userData.email}</p>

                                    <p className="text-gray-400 text-sm mt-3">Employee Account</p>
                                </div>
                            </div>
                        </div>

                        {/* ================= PERSONAL INFORMATION ================= */}
                        <div className="p-6 sm:p-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>

                                    <div className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-800">{userData.name || "Not available"}</div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Email Address</label>

                                    <div className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-800 break-all">{userData.email || "Not available"}</div>
                                </div>
                            </div>
                        </div>

                        {/* ================= RESUME ================= */}
                        <div className="border-t border-gray-200 p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">Resume</h3>

                                    <p className="text-gray-500 text-sm mt-1">Upload your latest resume for job applications.</p>
                                </div>

                                {/* Hidden File Input */}
                                <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />

                                {/* Upload / Replace Button */}
                                <button
                                    type="button"
                                    onClick={() => resumeInputRef.current?.click()}
                                    disabled={uploadingResume}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2.5 rounded-lg cursor-pointer disabled:cursor-not-allowed"
                                >
                                    {uploadingResume ? "Uploading..." : userData.resume ? "Replace Resume" : "Upload Resume"}
                                </button>
                            </div>

                            {/* Resume Exists */}
                            {userData.resume ? (
                                <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            {/* Resume Icon */}
                                            <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center text-xl">📄</div>

                                            <div>
                                                <p className="font-medium text-gray-800">Resume uploaded</p>

                                                <p className="text-sm text-gray-500">PDF / DOC / DOCX</p>
                                            </div>
                                        </div>

                                        {/* View Resume */}
                                        <a href={userData.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium">
                                            View Resume →
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                                    <div className="text-4xl mb-3">📄</div>

                                    <h4 className="font-medium text-gray-800">No resume uploaded</h4>

                                    <p className="text-sm text-gray-500 mt-1">Upload a PDF, DOC, or DOCX file up to 5 MB.</p>

                                    <button type="button" onClick={() => resumeInputRef.current?.click()} className="mt-4 text-blue-600 font-medium hover:text-blue-700 cursor-pointer">
                                        Upload Resume
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* ================= ACCOUNT INFORMATION ================= */}
                        <div className="border-t border-gray-200 p-6 sm:p-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Account Type</p>

                                    <p className="font-medium text-gray-800 mt-1">Employee</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Account Status</p>

                                    <p className="font-medium text-green-600 mt-1">Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* ================= FOOTER ================= */}
            <Footer />
        </div>
    );
};

export default Profile;
