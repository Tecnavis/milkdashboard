import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { BottleSummary } from "../../Helper/handle-api";
import { Link } from "react-router-dom";

const AllCustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [returnBottles, setReturnBottles] = useState(0);

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await BottleSummary();
      setCustomers(response?.customers || []);
    };
    fetchCustomers();
  }, []);

  const handleReturnBottleClick = (customer) => {
    setSelectedCustomer(customer);
    setReturnBottles(0);
    setShowModal(true);
  };

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
          {customers.map((data) => (
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
              onChange={(e) => setReturnBottles(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success">Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllCustomerTable;
