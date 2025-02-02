import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import {
  FetchCustomer,
  deleteCustomer,
  updateCustomer,
  fetchRoutes,
  confirmCustomer
} from "../../Helper/handle-api";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AllCustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [allRoutes, setAllRoutes] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await FetchCustomer();
      setCustomers(response);
    };
    fetchCustomers();

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

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  // Updated handleInputChange to handle both top-level fields and addresses
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    // If an index is provided, update the address field
    if (typeof index === "number") {
      setSelectedCustomer((prev) => {
        const updatedAddresses = [...prev.address];
        updatedAddresses[index] = { ...updatedAddresses[index], [name]: value };
        return { ...prev, address: updatedAddresses };
      });
    } else {
      // Otherwise, update the top-level field (e.g., routeno)
      setSelectedCustomer((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedCustomer = await updateCustomer(
        selectedCustomer._id,
        selectedCustomer
      );
      setCustomers((prev) =>
        prev.map((customer) =>
          customer._id === updatedCustomer._id ? updatedCustomer : customer
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error("Failed to update customer:", error);
    }
  };
// Handle the confirmation button click
const handleConfirm = async (customerId) => {
  try {
    // Call the API endpoint to confirm the customer
    const response = await confirmCustomer(customerId);
    Swal.fire({
      icon: "success",
      title: "Confirmed",
      text: response.message || "Customer confirmed successfully.",
    });
    // Update the local state to reflect confirmation
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.customerId === customerId
          ? { ...customer, isConfirmed: true }
          : customer
      )
    );
  } catch (error) {
    console.error("Confirmation failed:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data.message || "Confirmation failed.",
    });
  }
};
  return (
    <>
      <Table className="table table-dashed table-hover digi-dataTable all-product-table table-striped">
        <thead>
          <tr>
            <th>Customer Id</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Location </th>
            <th>Route No </th>
            <th>Confirmation</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((data) => (
            <tr key={data._id}>
              <td>{data.customerId}</td>
              <td>
                <Link to="#">{data.name}</Link>
              </td>
              <td>
                {data.phone}
                <br />
                {data.email}
              </td>
              <td>
                {data.address.map((addr, index) => (
                  <div key={index}>
                    {addr.streetAddress}, {addr.apartment}, {addr.postcode}
                  </div>
                ))}
              </td>
              <td>
                <a
                  href={`https://www.google.com/maps?q=${encodeURIComponent(
                    data.location
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Location
                </a>
              </td>
              <td>{data.routeno}<br/>{data.routename}</td>
              <td>
    <button 
      className="btn btn-primary"
      onClick={() => handleConfirm(data.customerId)}
      disabled={data.isConfirmed} // Disable if isConfirmed is true
    >
      {data.isConfirmed ? "Confirmed" : "Confirm"}
    </button>
              </td>
              <td>
                <div className="btn-box">
                  <button onClick={() => handleEditClick(data)}>
                    <i className="fa-light fa-pen"></i>
                  </button>
                  <button onClick={() => deleteCustomer(data._id)}>
                    <i className="fa-light fa-trash"></i>
                  </button>
                </div>
              </td>
              
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomer && (
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={selectedCustomer.name || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={selectedCustomer.phone || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={selectedCustomer.email || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={selectedCustomer.location || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Addresses</Form.Label>
                {selectedCustomer?.address.map((addr, index) => (
                  <div
                    key={addr._id}
                    style={{
                      marginBottom: "10px",
                      borderBottom: "1px solid #ddd",
                      paddingBottom: "10px"
                    }}
                  >
                    <Form.Control
                      type="text"
                      name="streetAddress"
                      placeholder="Street Address"
                      value={addr.streetAddress || ""}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                    <Form.Control
                      type="text"
                      name="apartment"
                      placeholder="Apartment"
                      value={addr.apartment || ""}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                    <Form.Control
                      type="text"
                      name="postcode"
                      placeholder="Postcode"
                      value={addr.postcode || ""}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </div>
                ))}
              </Form.Group>
              <Form.Group>
                <Form.Label>Route No</Form.Label>
                <select
                  name="routeno"
                  value={selectedCustomer.routeno || ""}
                  onChange={handleInputChange}
                >
                  <option value="">Select Route No</option>
                  {Array.isArray(allRoutes) &&
                    allRoutes.map((route) => (
                      <option key={route._id} value={route.name}>
                        {route.name}
                      </option>
                    ))}
                </select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Route Name</Form.Label>
                <Form.Control
                  type="text"
                  name="routename"
                  value={selectedCustomer.routename || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AllCustomerTable;
