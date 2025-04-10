import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { BottleSummary, updateReturnedBottles } from "../../Helper/handle-api"; 
import { Link } from "react-router-dom";

const AllCustomerTable = ({searchTerm}) => {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [returnBottles, setReturnBottles] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const response = await BottleSummary();
    setCustomers(response?.customers || []);
  };

  const handleReturnBottleClick = (customer) => {
    setSelectedCustomer(customer);
    setReturnBottles(0);
    setError(""); 
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!selectedCustomer) return;

    const { pendingBottles, customer } = selectedCustomer;

    // Validate input
    if (returnBottles <= 0 || returnBottles > pendingBottles) {
      setError("Please enter a valid number of bottles to return.");
      return;
    }

    // API Call
    try {
      const response = await updateReturnedBottles(customer._id, returnBottles);
      if (response.success) {
        fetchCustomers(); // Refresh the list
        setShowModal(false);
      } else {
        setError(response.message || "Failed to update returned bottles.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const name = customer.customer?.name || "";
    const phone = customer.customer?.phone || "";
    const customerId = customer.customer?.customerId || "";
    const routeno = customer.customer?.routeno || "";
    const query = searchTerm.toLowerCase();
  
    return (
      name.toLowerCase().includes(query) ||
      phone.includes(searchTerm) ||
      customerId.toLowerCase().includes(query) ||
      routeno.toLowerCase().includes(query)
    );
  });
  


  

  return (
    <div style={{ overflowX: "auto" }}>
      <Table className="table table-dashed table-hover table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Route No</th>
            <th>Phone</th>
            <th>Delivered Bottles</th>
            <th>Returned Bottles</th>
            <th>Pending Bottles</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((data) => (
            <tr key={data._id}>
              <td>
                <Link to="#">{data?.customer?.name}</Link>
              </td>
              <td>{data?.customer?.routeno}</td>
              <td>{data?.customer?.phone}</td>
              <td>{data?.bottles || 0}</td>
              <td>{data?.returnedBottles || 0}</td>
              <td>{data?.pendingBottles || 0}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleReturnBottleClick(data)}
                  disabled={data?.pendingBottles === 0} // Disable if no pending bottles
                >
                  Return Bottle
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Return Bottle Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Return Bottle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Enter Return Bottle Count</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter count"
              value={returnBottles}
              onChange={(e) => setReturnBottles(Number(e.target.value))}
              min={1}
              max={selectedCustomer?.pendingBottles}
            />
            {error && <p className="text-danger">{error}</p>}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllCustomerTable;
