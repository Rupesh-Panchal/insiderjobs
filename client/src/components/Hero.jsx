import { useContext, useRef } from "react"; // Importing React hooks
import React from "react";
import { assets } from "../assets/assets"; // Importing image assets
import { AppContext } from "../context/AppContext"; // Importing global app context

const Hero = () => {
  // Extracting setter functions from AppContext to update search state
  const { setSearchFilter, setIsSearched } = useContext(AppContext);

  // Refs for input fields to directly access their values
  const titleRef = useRef(null);
  const locationRef = useRef(null);

  // Function triggered when the Search button is clicked
  const onSearch = () => {
    // Setting search filters in global context
    setSearchFilter({
      title: titleRef.current.value, // Get the value from job title input
      location: locationRef.current.value, // Get the value from location input
    });
    setIsSearched(true); // Indicate that a search has been performed
  };

  return (
    <div className="container 2xl:px-20 mx-auto my-10">
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-r from-purple-800 to-purple-950 text-white py-16 text-center rounded-xl">
        {/* Main heading */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4">
          Over 10,000+ jobs to apply
        </h2>
        {/* Subheading/description */}
        <p className="mb-8 max-w-xl mx-auto text-sm font-light px-5">
          Your Next Big Career Move Starts Right Here - Explore the Best Job
          Opportunities and Take the First Step Toward Your Future!
        </p>
        {/* Search bar container */}
        <div className="flex items-center justify-between bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto">
          {/* Job title input */}
          <div className="flex items-center">
            <img className="h-4 sm:h-5" src={assets.search_icon} alt="" />
            <input
              type="text"
              placeholder="Search for jobs"
              name=""
              id=""
              className="max-sm:text-xs p-2 rounded outline-none w-full"
              ref={titleRef} // Ref to access value on search
            />
          </div>
          {/* Separator between inputs */}
          <p className="mx-2">|</p>
          {/* Location input */}
          <div className="flex items-center">
            <img className="h-4 sm:h-5" src={assets.location_icon} alt="" />
            <input
              type="text"
              placeholder="Location"
              name=""
              id=""
              className="max-sm:text-xs p-2 rounded outline-none w-full"
              ref={locationRef} // Ref to access value on search
            />
          </div>
          {/* Search button */}
          <button
            onClick={onSearch} // Trigger search function on click
            className="bg-blue-600 px-6 py-2 rounded text-white m-1 cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>

      {/* Trusted companies section */}
      <div className="border border-gray-300 shadow-md mx-2 mt-5 p-6 rounded-md flex">
        <div className="flex justify-center gap-10 lg:gap-16 flex-wrap">
          <p className="font-medium">Trusted by</p>
          {/* Company logos */}
          <img className="h-6" src={assets.microsoft_logo} alt="Company 1" />
          <img className="h-6" src={assets.walmart_logo} alt="Company 2" />
          <img className="h-6" src={assets.accenture_logo} alt="Company 3" />
          <img className="h-6" src={assets.samsung_logo} alt="Company 4" />
          <img className="h-6" src={assets.amazon_logo} alt="Company 5" />
          <img className="h-6" src={assets.adobe_logo} alt="Company 6" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
