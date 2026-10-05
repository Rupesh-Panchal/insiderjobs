import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  return (
    <div className="border p-6 shadow rounded">
      {/** Company Logo */}
      <div className="flex justify-between items-center">
        <img className="h-8" src={job.companyId.image} alt="" />
      </div>

      {/** Job Title */}
      <h4 className="font-medium text-xl mt-2">{job.title}</h4>

      {/** Company Location and Level */}
      <div className="flex items-center gap-3 mt-2 text-xs">
        <span className="bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
          {job.location} {/* Display job location */}
        </span>
        <span className="bg-red-50 border border-red-200 px-4 py-1.5 rounded">
          {job.level} {/* Display job level */}
        </span>
      </div>

      {/** Job Description */}
      <p
        className="text-gray-500 mt-4"
        dangerouslySetInnerHTML={{ __html: job.description.slice(0, 150) }} // Display first 150 characters of job description
      ></p>

      {/** Buttons for Apply or Learn More */}
      <div className="mt-4 flex gap-4 text-sm">
        <button
          onClick={() => {
            navigate(`/apply-job/${job._id}`); // Navigate to apply job page
            window.scrollTo(0, 0); // Scroll to top of the page
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Apply Now {/* Button to apply for the job */}
        </button>
        <button
          onClick={() => {
            navigate(`/job-details/${job._id}`); // Navigate to job details page
            window.scrollTo(0, 0); // Scroll to top of the page
          }}
          className="border border-gray-300 px-4 py-2 rounded cursor-pointer"
        >
          Learn More {/* Button to view more details about the job */}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
