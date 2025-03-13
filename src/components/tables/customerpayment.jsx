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
      const routeKey = customer.routeno || "No Route";
      if (!acc[routeKey]) acc[routeKey] = [];
      acc[routeKey].push(customer);
      return acc;
    }, {});
    setGroupedCustomers(grouped);
  };

  const updateCustomerIndexes = async (updatedCustomers) => {
    try {
      await Promise.all(
        updatedCustomers.map((customer, index) =>
          fetch(`${URL}/customer/update-customer-index/${customer.customerId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerindex: index + 1 }),
          })
        )
      );
      Swal.fire("Success!", "Customer index updated successfully.", "success");
    } catch (error) {
      console.error("Error updating customer index:", error);
      Swal.fire("Error!", "Failed to update customer index.", "error");
    }
  };

  const swapCustomers = (routeNo, index1, index2) => {
    const updatedCustomers = [...groupedCustomers[routeNo]];
    [updatedCustomers[index1], updatedCustomers[index2]] = [
      updatedCustomers[index2],
      updatedCustomers[index1],
    ];

    updatedCustomers.forEach((customer, index) => {
      customer.customerindex = index + 1;
    });

    setGroupedCustomers({ ...groupedCustomers, [routeNo]: updatedCustomers });
    updateCustomerIndexes(updatedCustomers);
  };

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
                  <th>Name</th>
                  <th>Address</th>
                  <th>Location</th>
                  <th>Route Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {groupedCustomers[routeNo].map((data, index) => (
                  <tr key={data._id}>
                    <td>{data.customerId}</td>
                    <td>{data.customerindex || "N/A"}</td>
                    <td>
                      <Link to="#">{data.name}</Link>
                    </td>
                    <td>
                      {data.address.map((addr, i) => (
                        <div key={i}>
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
                    <td>{data.routename}</td>
                    <td>
                      <div className="btn-box">
                        {/* <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                          Update Index
                        </button> */}
                        <button onClick={() => deleteCustomer(data._id)}>
                          <i className="fa-light fa-trash"></i>
                        </button>
                        <button
                          className="btn btn-secondary"
                          disabled={index === 0}
                          onClick={() => swapCustomers(routeNo, index, index - 1)}
                        >
                          ↑
                        </button>
                        <button
                          className="btn btn-secondary"
                          disabled={index === groupedCustomers[routeNo].length - 1}
                          onClick={() => swapCustomers(routeNo, index, index + 1)}
                        >
                          ↓
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
          <Button variant="primary" onClick={() => updateCustomerIndexes([{ ...selectedCustomer, customerindex }])}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllCustomerTable;
