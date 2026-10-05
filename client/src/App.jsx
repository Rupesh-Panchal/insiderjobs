import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ApplyJob from "./pages/Applyjob";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";
import RecruiterLogin from "./components/RecruiterLogin";
import EmployeeLogin from "./components/EmployeeLogin";
import { AppContext } from "./context/AppContext";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import ManageJobs from "./pages/ManageJobs";
import ViewApplications from "./pages/ViewApplications";
import "quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
    const { showRecruiterLogin, showEmployeeLogin, companyToken } = useContext(AppContext);

    return (
        <div>
            {showRecruiterLogin && <RecruiterLogin />}
            {showEmployeeLogin && <EmployeeLogin />}
            <ToastContainer />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/apply-job/:id" element={<ApplyJob />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />}>
                    {companyToken ? (
                        <>
                            <Route path="add-job" element={<AddJob />} />
                            <Route path="manage-jobs" element={<ManageJobs />} />
                            <Route path="view-applications" element={<ViewApplications />} />
                        </>
                    ) : null}
                </Route>
            </Routes>
        </div>
    );
};

export default App;
