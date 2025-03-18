"use client";

import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import TimePicker from "react-time-picker";  // Import the time picker
import 'react-time-picker/dist/TimePicker.css';


const EmployerForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    location: "",
    type: "",
    description: "",
    working_time: "12:00",  // Default time in 12-hour format
    job_category: "",
    salary_range: [30000, 90000],
  });

  const [errors, setErrors] = useState<any>({});
  const [message, setMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validation function with regular expressions
  const validateForm = () => {
    const newErrors: any = {};

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
    
    if (formData.salary_range[0] >= formData.salary_range[1])
      newErrors.salary_range = "Minimum salary should be less than maximum salary";
    if (!formData.description)
      newErrors.description = "Job description is required";

    if (!formData.working_time)
      newErrors.working_time = "Working time is required";

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
            working_time: "12:00", // Reset to default time
            job_category: "",
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
                  className={`alert ${
                    message.includes("successfully")
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
                    className={`form-control ${
                      errors.title ? "is-invalid" : ""
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
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
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
                    className={`form-control ${
                      errors.location ? "is-invalid" : ""
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
                    className={`form-control ${
                      errors.description ? "is-invalid" : ""
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

                {/* Working Time (AM/PM Time Picker) */}
                <div
                  className={`mb-3 ${errors.working_time ? "is-invalid" : ""}`}
                >
                  <label htmlFor="working_time" className="form-label">
                    Working Time 
                  </label>
                  <TimePicker
                    id="working_time"
                    name="working_time"
                    value={formData.working_time}
                    onChange={(newTime) => {
                      setFormData((prevData) => ({
                        ...prevData,
                        working_time: newTime || "12:00", // Default to 12:00 if null
                      }));
                    }}
                    format="hh:mm a" // 12-hour format with AM/PM
                    clearIcon={null} // Optional: Remove clear icon
                  />
                  {errors.working_time && (
                    <div className="invalid-feedback">
                      {errors.working_time}
                    </div>
                  )}
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
                    className={`form-control ${
                      errors.job_category ? "is-invalid" : ""
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
