import { createContext, useEffect, useState } from "react"; // Import React hooks
import { jobsData } from "../assets/assets"; // Import initial job data
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

// Creating a context to share state globally
export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendurl = import.meta.env.VITE_BACKEND_URL;

  const { user } = useUser();
  const { getToken } = useAuth();

  // State to store search filter values (job title and location)
  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });

  // State to check if a search has been performed
  const [isSearched, setIsSearched] = useState(false);

  // State to store the list of jobs
  const [jobs, setJobs] = useState([]);

  // State to control the visibility of the recruiter login modal
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  const [companyToken, setCompanyToken] = useState(null);

  const [companyData, setCompanyData] = useState(null);

  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplications] = useState([]);

  // Function to fetch job data (here using static data from assets)
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/jobs");

      if (data.success) {
        setJobs(data.jobs);
        console.log(data.jobs);
      } else {
        toast.error(data.message);
      }

      //setJobs(jobsData); // Set jobs state with the data
    } catch (error) {
      console.error(error.message); // Log errors if fetching fails
    }
  };

  // Function to fetch User data
  const fetchUserData = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get(backendurl + "/api/users/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Function to fetch users applied applications data
  const fetchUserApplications = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get(backendurl + "/api/users/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserApplications(data.applications);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error(error.message);
    }
  };

  //Function to fetch company data
  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/company/company", {
        headers: { token: companyToken },
      });

      if (data.success) {
        setCompanyData(data.company);
        console.log(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // useEffect runs once on component mount to fetch jobs initially
  useEffect(() => {
    fetchJobs();

    const storedCompanyToken = localStorage.getItem("companyToken");

    if (storedCompanyToken) {
      setCompanyToken(storedCompanyToken);
    }
  }, []);

  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);

  useEffect(() => {
    if (user) {
      fetchUserData();

      fetchUserApplications();
    }
  }, [user]);

  // Object to pass all states and setters via context
  const value = {
    searchFilter, // current search filter
    setSearchFilter, // function to update search filter
    isSearched, // boolean flag if search is done
    setIsSearched, // function to update search status
    jobs, // array of jobs
    setJobs, // function to update jobs
    showRecruiterLogin, //boolean to show/hide recruiter login modal
    setShowRecruiterLogin, //function to update showRecruiterLogin state
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    backendurl,
    userData,
    setUserData,
    userApplications,
    setUserApplications,
    fetchUserData,
    fetchUserApplications,
  };

  // Providing context values to all child components
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
