import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import {
  FetchCustomer,
  deleteCustomer,
  updateCustomer,
} from "../../Helper/handle-api";
import { Link } from "react-router-dom";

const AllCustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await FetchCustomer();
      setCustomers(response);
    };
    fetchCustomers();
  }, []);

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCustomer((prev) => ({ ...prev, [name]: value }));
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

  return (
    <>
      <Table className="table table-dashed table-hover digi-dataTable all-product-table table-striped">
        <thead>
          <tr>
            <th className="no-sort">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="markAllProduct"
                />
              </div>
            </th>
            <th>Customer Id</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Location </th>
            <th>Address</th>
            <th>Route No </th>
            <th>Route Name </th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((data) => (
            <tr key={data._id}>
              <td>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" />
                </div>
              </td>
              <td>{data.customerId}</td>
              <td>
                <Link to="#">{data.name}</Link>
              </td>
              <td>{data.phone}</td>

              <td>{data.address} </td>
              <td>
  <a
    href={`https://www.google.com/maps?q=${encodeURIComponent(data.location)}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    Location
  </a>
</td>


              <td>{data.routeno}</td>
              <td>{data.routename} </td>
              <td>
                <div className="btn-box">
                  <button onClick={() => handleEditClick(data)}>
                    <i className="fa-light fa-pen"></i>
                  </button>
                  <button>
                    <i
                      className="fa-light fa-trash"
                      onClick={() => deleteCustomer(data._id)}
                    ></i>
                  </button>
                </div>{" "}
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
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={selectedCustomer.location || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={selectedCustomer.address || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Route No</Form.Label>
                <Form.Control
                  type="text"
                  name="routeno"
                  value={selectedCustomer.routeno || ""}
                  onChange={handleInputChange}
                />
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
