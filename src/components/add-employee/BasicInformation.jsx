import React, { useEffect, useState } from 'react';
import { useForm } from '../../Helper/useForm';
import { Customercreate, fetchRoutes } from '../../Helper/handle-api';
import Swal from 'sweetalert2';

const BasicInformation = () => {
  // Extend the form state to include address details.
  const [values, handleChange] = useForm({
    name: '',
    password: '',
    phone: '',
    location: '',
    routeno: '',
    email: '',
    routename: '',
    addressPostcode: '',
    addressStreet: '',
    addressApartment: '',
  });
const [allRoutes, setAllRoutes] = useState([]);
  const [image, setImage] = useState('');

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("password", values.password);
    formData.append("phone", values.phone);
    formData.append("location", values.location);
    formData.append("routeno", values.routeno);
    formData.append("email", values.email);
    formData.append("routename", values.routename);
    formData.append("image", image);

    // Create an array with a single address object containing postcode, streetAddress, and apartment.
    const addressArray = JSON.stringify([
      {
        postcode: values.addressPostcode,
        streetAddress: values.addressStreet,
        apartment: values.addressApartment,
      },
    ]);
    formData.append("address", addressArray);

    try {
      const response = await Customercreate(formData);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Customer created successfully! Please confirm your account before logging in.',
      });
    } catch (error) {
      if (error.response?.status === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message || 'Phone number already exists.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Unexpected Error',
          text: 'An unexpected error occurred.',
        });
      }
    }
  };
useEffect(() => {
    const fetchAllRoutes = async () => {
          const response = await fetchRoutes();
          // Adjust this based on the actual response structure
          if (response && response.routes) {
            setAllRoutes(response.routes);
          } else if (Array.isArray(response)) {
            setAllRoutes(response);
          } else {
            setAllRoutes([]);
          }
        };
        fetchAllRoutes();
  }, []);
  return (
    <div className="col-12">
      <div className="panel">
        <div className="panel-header">
          <h5>Customer Create</h5>
        </div>
        <div className="panel-body">
          <div className="row g-3">
            {/* Image Input */}
            <div className="col-xxl-3 col-lg-4 col-sm-6">
              <label className="form-label">Image</label>
              <input
                type="file"
                className="form-control form-control-sm"
                onChange={handleImage}
                accept="image/*"
              />
            </div>

            {/* Full Name */}
            <div className="col-xxl-3 col-lg-4 col-sm-6">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
              />
            </div>

            {/* Phone */}
            <div className="col-xxl-3 col-lg-4 col-sm-6">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-control form-control-sm"
                placeholder="Phone"
                name="phone"
                value={values.phone}
                onChange={handleChange}
              />
            </div>

            {/* Location */}
            <div className="col-xxl-3 col-lg-4 col-sm-6">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Location"
                name="location"
                value={values.location}
                onChange={handleChange}
              />
            </div>

            {/* Route No */}
            <div className="col-xxl-3 col-lg-4 col-sm-6">
              <label className="form-label">Route No</label>
              <select
                className="form-control form-control-sm"
                name="routeno"
                value={values.routeno}
                onChange={handleChange}
              >
                <option value="">Select Route No</option>
                  {Array.isArray(allRoutes) &&
                    allRoutes.map((route) => (
                      <option key={route._id} value={route.name}>
                        {route.name}
                      </option>
                    ))}
              </select>
            </div>

            {/* Email */}
            <div className="col-xxl-3 col-lg-4 col-sm-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control form-control-sm"
                placeholder="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
              />
            </div>

            {/* Route Name */}
            <div className="col-xxl-3 col-lg-4 col-sm-6">
              <label className="form-label">Route Name</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Route Name"
                name="routename"
                value={values.routename}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="col-xxl-3 col-lg-4 col-sm-6">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control form-control-sm"
                placeholder="Password"
                name="password"
                value={values.password}
                onChange={handleChange}
              />
            </div>

            {/* Address Inputs */}
            <div className="col-xxl-3 col-lg-4 col-sm-6">
              <label className="form-label">Postcode</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Postcode"
                name="addressPostcode"
                value={values.addressPostcode}
                onChange={handleChange}
              />
            </div>
            <div className="col-xxl-3 col-lg-4 col-sm-6">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Street Address"
                name="addressStreet"
                value={values.addressStreet}
                onChange={handleChange}
              />
            </div>
            <div className="col-xxl-3 col-lg-4 col-sm-6">
              <label className="form-label">Apartment</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Apartment"
                name="addressApartment"
                value={values.addressApartment}
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <div className="col-12">
              <button className="btn btn-sm btn-primary" onClick={handleSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
