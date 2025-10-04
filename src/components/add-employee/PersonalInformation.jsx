import React from "react";
import { createWarehouse } from "../../Helper/handle-api";
import { useForm } from "../../Helper/useForm";
import Swal from "sweetalert2";

const PersonalInformation = () => {
  const [values, handleChange] = useForm({
    name: "",
    phone: "",
    address: "",
    email: "",
  });

  const handleSave = async () => {
    try {
      if (!values.name || !values.address || !values.email || !values.phone) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please fill all fields before saving.',
        })
        return;
      }

      const response = await createWarehouse(values);
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Warehouse created successfully!',
    })

      // Clear form fields after successful creation
      handleChange({ target: { name: "name", value: "" } });
      handleChange({ target: { name: "address", value: "" } });
      handleChange({ target: { name: "email", value: "" } });
      handleChange({ target: { name: "phone", value: "" } });
    } catch (error) {
      console.error("Error creating warehouse:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to create warehouse. Please try again.',
    })
    }
  };

  return (
    <div className="col-12">
      <div className="panel">
        <div className="panel-header">
          <h5>Warehouse Create</h5>
        </div>
        <div className="panel-body">
          <div className="row g-3">
            <div className="col-xxl-3 col-lg-6 col-sm-6">
              <label className="form-label">Warehouse Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Warehouse Name"
                name="name"
                onChange={handleChange}
                value={values.name}
              />
            </div>
            <div className="col-xxl-3 col-lg-6 col-sm-6">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="Address"
                name="address"
                onChange={handleChange}
                value={values.address}
              />
            </div>
            <div className="col-xxl-3 col-lg-6 col-sm-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                value={values.email}
              />
            </div>
            <div className="col-xxl-3 col-lg-6 col-sm-6">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-control"
                placeholder="Phone"
                name="phone"
                onChange={handleChange}
                value={values.phone}
              />
            </div>
            <div className="col-xxl-3 col-lg-6 col-sm-6">
              <button className="btn btn-sm btn-success" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
