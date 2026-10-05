import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Creating a context to share state globally
export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendurl = import.meta.env.VITE_BACKEND_URL;

    // =========================================
    // SEARCH
    // =========================================

    const [searchFilter, setSearchFilter] = useState({
        title: "",
        location: "",
    });

    const [isSearched, setIsSearched] = useState(false);

    // =========================================
    // JOBS
    // =========================================

    const [jobs, setJobs] = useState([]);

    // =========================================
    // RECRUITER
    // =========================================

    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

    const [companyToken, setCompanyToken] = useState(localStorage.getItem("companyToken") || null);

    const [companyData, setCompanyData] = useState(null);

    // =========================================
    // EMPLOYEE
    // =========================================

    const [showEmployeeLogin, setShowEmployeeLogin] = useState(false);

    const [userToken, setUserToken] = useState(localStorage.getItem("userToken") || null);

    const [userData, setUserData] = useState(null);

    const [userApplications, setUserApplications] = useState([]);

    // =========================================
    // FETCH JOBS
    // =========================================

    const fetchJobs = async () => {
        try {
            const { data } = await axios.get(backendurl + "/api/jobs");

            if (data.success) {
                setJobs(data.jobs);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Fetch jobs error:", error.message);
        }
    };

    // =========================================
    // FETCH EMPLOYEE DATA
    // =========================================

    const fetchUserData = async () => {
        if (!userToken) return;

        try {
            const { data } = await axios.get(backendurl + "/api/users/user", {
                headers: {
                    token: userToken,
                },
            });

            if (data.success) {
                setUserData(data.user);
            } else {
                setUserData(null);
            }
        } catch (error) {
            console.error("Fetch user data error:", error.message);
            setUserData(null);
        }
    };

    // =========================================
    // FETCH EMPLOYEE APPLICATIONS
    // =========================================

    const fetchUserApplications = async () => {
        if (!userToken) return;

        try {
            const { data } = await axios.get(backendurl + "/api/users/applications", {
                headers: {
                    token: userToken,
                },
            });

            if (data.success) {
                setUserApplications(data.applications);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Fetch user applications error:", error.message);
        }
    };

    // =========================================
    // FETCH COMPANY DATA
    // =========================================

    const fetchCompanyData = async () => {
        if (!companyToken) return;

        try {
            const { data } = await axios.get(backendurl + "/api/company/company", {
                headers: {
                    token: companyToken,
                },
            });

            if (data.success) {
                setCompanyData(data.company);
            } else {
                setCompanyData(null);
            }
        } catch (error) {
            console.error("Fetch company data error:", error.message);
        }
    };

    // =========================================
    // INITIAL LOAD
    // =========================================

    useEffect(() => {
        fetchJobs();
    }, []);

    // =========================================
    // COMPANY TOKEN
    // =========================================

    useEffect(() => {
        if (companyToken) {
            fetchCompanyData();
        }
    }, [companyToken]);

    // =========================================
    // EMPLOYEE TOKEN
    // =========================================

    useEffect(() => {
        if (userToken) {
            fetchUserData();
            fetchUserApplications();
        } else {
            setUserData(null);
            setUserApplications([]);
        }
    }, [userToken]);

    // =========================================
    // CONTEXT VALUE
    // =========================================

    const value = {
        // Search
        searchFilter,
        setSearchFilter,
        isSearched,
        setIsSearched,

        // Jobs
        jobs,
        setJobs,

        // Recruiter
        showRecruiterLogin,
        setShowRecruiterLogin,
        companyToken,
        setCompanyToken,
        companyData,
        setCompanyData,
        fetchCompanyData,

        // Employee
        showEmployeeLogin,
        setShowEmployeeLogin,
        userToken,
        setUserToken,
        userData,
        setUserData,
        userApplications,
        setUserApplications,
        fetchUserData,
        fetchUserApplications,

        // Backend
        backendurl,
    };

    return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
