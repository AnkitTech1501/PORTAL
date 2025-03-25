"use client";

import React, { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";  // Import the time picker

const EmployerForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    location: "",
    type: "",
    description: "",
    start_time: "07:00", // Default start time (7:00 AM)
    end_time: "17:00", // Default end time (5:00 PM)
    job_category: "",
    salary_range: [30000, 90000],
    address: "",
    state: "",
    city: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [message, setMessage] = useState<string>("");
  const [states, setStates] = useState<string[]>([]); // For storing states
  const [cities, setCities] = useState<string[]>([]); // For storing cities based on selected state

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      return updatedData;
    });
  };

  // Validation function with regular expressions
  const validateForm = () => {
    const newErrors: any = {};

    // for time validation
    const startHour = parseInt(formData.start_time.split(":")[0], 10);
    const endHour = parseInt(formData.end_time.split(":")[0], 10);

    const startTime = new Date(`1970-01-01T${formData.start_time}:00`);
    const endTime = new Date(`1970-01-01T${formData.end_time}:00`);
    if (endTime <= startTime) {
      newErrors.end_time = "End time must be later than start time.";
    }

    const nameRegex = /^[A-Za-z\s]+$/; // Allows letters and spaces for title and name
    const locationRegex = /^[A-Za-z0-9\s,]+$/; // Allows letters, numbers, and commas for location

    // Check if fields are empty
    if (!formData.title) newErrors.title = "Job title is required";
    else if (!nameRegex.test(formData.title))
      newErrors.title = "Job title should contain only letters and spaces";

    if (!formData.name) newErrors.name = "Employer name is required";
    else if (!nameRegex.test(formData.name))
      newErrors.name = "Employer name should contain only letters and spaces";

    if (!formData.location) newErrors.location = "Location is required";
    else if (!locationRegex.test(formData.location))
      newErrors.location =
        "Location should contain letters, numbers, and commas only";

    if (!formData.type) newErrors.type = "Job type is required";

    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";

    if (formData.salary_range[0] >= formData.salary_range[1])
      newErrors.salary_range = "Minimum salary should be less than maximum salary";
    if (!formData.description)
      newErrors.description = "Job description is required";

    if (!formData.job_category)
      newErrors.job_category = "Job category is required";
    return Object.keys(newErrors).length === 0 ? true : newErrors;
  };

  const handleSalaryChange = (value: number[]) => {
    setFormData((prevData) => ({
      ...prevData,
      salary_range: value,
    }));
  };

  // Fetch cities when a state is selected
  useEffect(() => {
    if (formData.state) {
      const fetchCities = async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/api/cities/${formData.state}` // Laravel API endpoint for cities based on state
          );
          const data = await response.json();
          setCities(data); // Assuming the response contains an array of cities
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      };

      fetchCities();
    }
  }, [formData.state]);

  // Fetch states when the component mounts
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/states"); // Laravel API endpoint for states
        const data = await response.json();
        console.log("data = ",data);
        setStates(data); // Assuming the response contains an array of states
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationResults = validateForm();

    if (validationResults === true) {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/employers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage(data.message);
          setFormData({
            title: "",
            name: "",
            location: "",
            type: "",
            salary_range: [],
            description: "",
            start_time: "07:00", // Reset to default start time
            end_time: "17:00", // Reset to default end time
            job_category: "",
            address: "",
            state: "",
            city: "",
          });
        } else {
          setMessage(data.message || "Something went wrong!");
        }
      } catch (error) {
        setMessage("Error connecting to the server!");
      }
    } else {
      setErrors(validationResults); // Display errors
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-dark text-white text-center">
              <h4>Employer Form</h4>
            </div>
            <div className="card-body">
              {message && (
                <div
                  className={`alert ${message.includes("successfully")
                    ? "alert-success"
                    : "alert-danger"
                    }`}
                  role="alert"
                >
                  {message}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className={`mb-3 ${errors.title ? "is-invalid" : ""}`}>
                  <label htmlFor="title" className="form-label">
                    Job Title
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.title ? "is-invalid" : ""
                      }`}
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                  {errors.title && (
                    <div className="invalid-feedback">{errors.title}</div>
                  )}
                </div>

                {/* Employer Name */}
                <div className={`mb-3 ${errors.name ? "is-invalid" : ""}`}>
                  <label htmlFor="name" className="form-label">
                    Employer Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""
                      }`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                {/* Location */}
                <div className={`mb-3 ${errors.location ? "is-invalid" : ""}`}>
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.location ? "is-invalid" : ""
                      }`}
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                  {errors.location && (
                    <div className="invalid-feedback">{errors.location}</div>
                  )}
                </div>



                {/* Location Details: Address, State, and City */}
                <div className="mb-3">
                  <div className="d-flex flex-column p-3 border rounded-3 shadow-sm">
                    <h5 className="mb-3">Location Details</h5>

                    {/* State and City in the same row */}
                    <div className="d-flex justify-content-between">

                      {/* State */}
                      <div className={`flex-fill mb-3 ${errors.state ? "is-invalid" : ""}`}>
                        <label htmlFor="state" className="form-label">
                          State
                        </label>
                        <select
                          className={`form-select ${errors.state ? "is-invalid" : ""}`}
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                        >
                          <option value="">Select State</option>
                          {states.map((state) => (
                            <option key={state.id} value={state.id}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                        {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                      </div>

                      {/* City */}
                      <div className={`flex-fill mb-3 ${errors.city ? "is-invalid" : ""}`}>
                        <label htmlFor="city" className="form-label">
                          City
                        </label>
                        <select
                          className={`form-select ${errors.city ? "is-invalid" : ""}`}
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                        >
                          <option value="">Select City</option>
                          {cities.map((city) => (
                            <option key={city.id} value={city.name}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                        {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                      </div>
                    </div>

                    {/* Address (comes below State and City) */}
                    <div className={`mb-3 ${errors.address ? "is-invalid" : ""}`}>
                      <label htmlFor="address" className="form-label">
                        Address
                      </label>
                      <textarea
                        type="text"
                        className={`form-control ${errors.address ? "is-invalid" : ""}`}
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                      {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                    </div>
                  </div>
                </div>

                {/* Job Type */}
                <div className={`mb-3 ${errors.type ? "is-invalid" : ""}`}>
                  <label htmlFor="type" className="form-label">
                    Job Type
                  </label>
                  <select
                    className={`form-select ${errors.type ? "is-invalid" : ""}`}
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="">Select Job Type</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                  {errors.type && (
                    <div className="invalid-feedback">{errors.type}</div>
                  )}
                </div>

                {/* Salary Range (Dual Range Slider) */}
                <div
                  className={`mb-3 ${errors.salary_range ? "is-invalid" : ""}`}
                >
                  <label htmlFor="salary_range" className="form-label">
                    Salary Range
                  </label>

                  <div className="d-flex justify-content-between">
                    <span>{formData.salary_range[0]}</span>
                    <span>{formData.salary_range[1]}</span>
                  </div>

                  <Slider
                    range
                    min={10000}
                    max={200000}
                    step={1000}
                    value={formData.salary_range}
                    onChange={handleSalaryChange}
                    allowCross={false}
                  />

                  {errors.salary_range && (
                    <div className="invalid-feedback">
                      {errors.salary_range}
                    </div>
                  )}
                </div>

                {/* Job Description */}
                <div
                  className={`mb-3 ${errors.description ? "is-invalid" : ""}`}
                >
                  <label htmlFor="description" className="form-label">
                    Job Description
                  </label>
                  <textarea
                    className={`form-control ${errors.description ? "is-invalid" : ""
                      }`}
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  ></textarea>
                  {errors.description && (
                    <div className="invalid-feedback">{errors.description}</div>
                  )}
                </div>
                {/* Start Time  END TIME AND AM/PM*/}
                <div className="mb-3">
                  <div className="d-flex flex-column p-3 border rounded-3 shadow-sm">
                    <h5 className="mb-3">Working Hours</h5>
                    <div className="d-flex justify-content-between">
                      {/* Start Time */}
                      <div className={`flex-fill mb-3 ${errors.start_time ? "is-invalid" : ""}`}>
                        <label htmlFor="start_time" className="form-label">
                          Start Time
                        </label>
                        <input
                          type="time"
                          className={`form-control ${errors.start_time ? "is-invalid" : ""}`}
                          id="start_time"
                          name="start_time"
                          value={formData.start_time}
                          onChange={handleChange}
                        />
                        {errors.start_time && (
                          <div className="invalid-feedback">{errors.start_time}</div>
                        )}
                      </div>

                      {/* End Time */}
                      <div className={`flex-fill mb-3 ${errors.end_time ? "is-invalid" : ""}`}>
                        <label htmlFor="end_time" className="form-label">
                          End Time
                        </label>
                        <input
                          type="time"
                          className={`form-control ${errors.end_time ? "is-invalid" : ""}`}
                          id="end_time"
                          name="end_time"
                          value={formData.end_time}
                          onChange={handleChange}
                        />
                        {errors.end_time && (
                          <div className="invalid-feedback">{errors.end_time}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Category */}
                <div
                  className={`mb-3 ${errors.job_category ? "is-invalid" : ""}`}
                >
                  <label htmlFor="job_category" className="form-label">
                    Job Category
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.job_category ? "is-invalid" : ""
                      }`}
                    id="job_category"
                    name="job_category"
                    value={formData.job_category}
                    onChange={handleChange}
                  />
                  {errors.job_category && (
                    <div className="invalid-feedback">
                      {errors.job_category}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-dark form-control">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerForm;
