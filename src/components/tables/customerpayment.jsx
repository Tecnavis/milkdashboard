import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { FetchCustomer, deleteCustomer, URL } from "../../Helper/handle-api";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AllCustomerTable = ({ searchTerm }) => {
  const [customers, setCustomers] = useState([]);
  const [groupedCustomers, setGroupedCustomers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerIndex, setCustomerIndex] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await FetchCustomer();
      setCustomers(response);
      groupCustomersByRoute(response);
    };
    fetchCustomers();
  }, []);

  const groupCustomersByRoute = (customerList) => {
    const grouped = customerList.reduce((acc, customer) => {
      const routeKey = customer.routeno || "No Route"; // Handle empty route number
      if (!acc[routeKey]) {
        acc[routeKey] = [];
      }
      acc[routeKey].push(customer);
      return acc;
    }, {});

    setGroupedCustomers(grouped);
  };

  const handleUpdateClick = (customer) => {
    setSelectedCustomer(customer);
    setCustomerIndex(customer.customerindex || ""); // Pre-fill if available
    setShowModal(true);
  };

  const handleUpdateCustomerIndex = async () => {
    if (!selectedCustomer) return;

    try {
      const response = await fetch(`${URL}/customer/update-customer-index/${selectedCustomer.customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerindex: customerIndex }),
      });

      const result = await response.json();
      if (response.ok) {
        Swal.fire("Success!", result.message, "success");
        setShowModal(false);
        setCustomers((prevCustomers) =>
          prevCustomers.map((cust) =>
            cust.customerId === selectedCustomer.customerId
              ? { ...cust, customerindex: customerIndex }
              : cust
          )
        );
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error updating customer index:", error);
      Swal.fire("Error!", "Failed to update customer index.", "error");
    }
  };

  // Filter based on search term
  const filteredRoutes = Object.keys(groupedCustomers).filter((routeNo) =>
    routeNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ overflowX: "auto" }}>
      {filteredRoutes.length > 0 ? (
        filteredRoutes.map((routeNo) => (
          <div key={routeNo}>
            <b>Route No: {routeNo}</b>
            <Table className="table table-dashed table-hover digi-dataTable all-product-table table-striped">
              <thead>
                <tr>
                  <th>Customer Id</th>
                  <th>Customerindex</th>
                  <th>Proof Image</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Location</th>
                  <th>Route Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {groupedCustomers[routeNo].map((data) => (
                  <tr key={data._id}>
                    <td>{data.customerId}</td>
                    <td>{data.customerindex ||"N/A"}</td>
                    <td>
                      {data.image ? (
                        <img
                          src={`${URL}/images/${data.image}`}
                          alt="Proof"
                          style={{ width: "100px", height: "100px" }}
                        />
                      ) : null}
                    </td>
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
                        href={`https://www.google.com/maps?q=${encodeURIComponent(data.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Location
                      </a>
                    </td>
                    <td>{data.routename}</td>
                    <td>
                      <div className="btn-box">
                        <button className="btn btn-primary" onClick={() => handleUpdateClick(data)}>
                          Update Index
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
            <br />
          </div>
        ))
      ) : (
        <p>No customers found for the entered route number.</p>
      )}

      {/* Modal for Updating Customer Index */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Customer Index</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Customer Index</Form.Label>
              <Form.Control
                type="text"
                value={customerIndex}
                onChange={(e) => setCustomerIndex(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateCustomerIndex}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllCustomerTable;
