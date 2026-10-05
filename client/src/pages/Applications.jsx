import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { assets } from "../assets/assets";
import moment from "moment";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Applications = () => {
    const navigate = useNavigate();

    // State to manage resume edit mode
    const [isEdit, setIsEdit] = useState(false);

    // State to manage the resume file
    const [resume, setResume] = useState(null);

    const { backendurl, userData, userToken, userApplications, fetchUserData, fetchUserApplications } = useContext(AppContext);

    // Update Resume
    const updateResume = async () => {
        if (!resume) {
            toast.error("Please select a resume first.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("resume", resume);

            const { data } = await axios.post(backendurl + "/api/users/update-resume", formData, {
                headers: {
                    token: userToken,
                },
            });

            if (data.success) {
                toast.success(data.message);
                await fetchUserData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Resume update error:", error);
            toast.error(error.response?.data?.message || error.message || "Failed to update resume.");
        }

        setIsEdit(false);
        setResume(null);
    };

    // Fetch user applications
    useEffect(() => {
        if (userToken) {
            fetchUserApplications();
        }
    }, [userToken]);

    return (
        <>
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
                {/* ================= BACK BUTTON ================= */}
                <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 cursor-pointer">
                    <span className="text-lg">←</span>
                    <span>Back to Jobs</span>
                </button>

                {/* ================= RESUME SECTION ================= */}
                <h2 className="text-xl font-semibold">Your Resume</h2>

                <div className="flex gap-2 mb-6 mt-3">
                    {isEdit || (userData && userData.resume === "") ? (
                        <>
                            <label className="flex items-center" htmlFor="resumeUpload">
                                <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2">{resume ? resume.name : "Select Resume"}</p>

                                <input onChange={(e) => setResume(e.target.files[0])} accept=".pdf,.doc,.docx" type="file" id="resumeUpload" hidden />

                                <img src={assets.profile_upload_icon} alt="" />
                            </label>

                            <button onClick={updateResume} className="bg-green-100 border border-green-400 rounded-lg px-4 py-2 cursor-pointer">
                                Save
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            {/* View Resume */}
                            <a className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg" href={userData?.resume} target="_blank" rel="noopener noreferrer">
                                Resume
                            </a>

                            {/* Edit Resume */}
                            <button onClick={() => setIsEdit(true)} className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2 cursor-pointer">
                                Edit
                            </button>
                        </div>
                    )}
                </div>

                {/* ================= JOBS APPLIED ================= */}
                <h2 className="text-xl font-semibold mb-4">Jobs Applied</h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                            <tr>
                                <th className="py-3 px-4 border-b text-left">Company</th>

                                <th className="py-3 px-4 border-b text-left">Job Title</th>

                                <th className="py-3 px-4 border-b text-left max-sm:hidden">Location</th>

                                <th className="py-3 px-4 border-b text-left max-sm:hidden">Date</th>

                                <th className="py-3 px-4 border-b text-left">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {userApplications.map((job, index) => (
                                <tr key={index}>
                                    {/* Company */}
                                    <td className="py-3 px-4 border-b">
                                        <div className="flex items-center gap-2">
                                            <img className="w-8 h-8 object-contain" src={job.companyId.image} alt="" />

                                            {job.companyId.name}
                                        </div>
                                    </td>

                                    {/* Job Title */}
                                    <td className="py-2 px-4 border-b">{job.jobId.title}</td>

                                    {/* Location */}
                                    <td className="py-2 px-4 border-b max-sm:hidden">{job.jobId.location}</td>

                                    {/* Date */}
                                    <td className="py-2 px-4 border-b max-sm:hidden">{moment(job.date).format("MMM D")}</td>

                                    {/* Status */}
                                    <td className="py-2 px-4 border-b">
                                        <span className={`${job.status === "Accepted" ? "bg-green-100" : job.status === "Rejected" ? "bg-red-100" : "bg-blue-100"} px-4 py-1.5 rounded`}>
                                            {job.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* No Applications */}
                {userApplications.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-500">You haven't applied for any jobs yet.</p>

                        <button onClick={() => navigate("/")} className="mt-4 text-blue-600 hover:text-blue-700 cursor-pointer">
                            Browse Jobs
                        </button>
                    </div>
                )}
            </div>

            {/* Footer */}
            <Footer />
        </>
    );
};

export default Applications;
