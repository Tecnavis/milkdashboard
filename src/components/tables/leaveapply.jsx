import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BottleSummary, URL } from "../../Helper/handle-api"; 
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AllCustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [leaveDates, setLeaveDates] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const response = await BottleSummary();
    setCustomers(response?.customers || []);
  };

  const handleApplyLeaveClick = (customer) => {
    setSelectedCustomer(customer);
    setLeaveDates([]); // Ensure it's always an empty array initially
    setShowModal(true);
  };
  
  const handleSubmitLeave = async () => {
    if (!selectedCustomer || leaveDates.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Please select leave dates.",
    })
      return;
    }

    const requestData = {
      customerId: selectedCustomer._id,
      dates: leaveDates.map(date => date.toISOString().split("T")[0]) // Format as YYYY-MM-DD
    };

    try {
      const response = await fetch(`${URL}/plan/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: result.message,
        })
        setShowModal(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message,
        })  
      }
    } catch (error) {
      console.error("Error applying leave:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error applying leave. Please try again.",
    })
    }
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
                  onClick={() => handleApplyLeaveClick(data.customer)}
                >
                  Apply Leave
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Leave Application Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title style={{color:"white"}}>Apply Leave for {selectedCustomer?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form >
            <Form.Group>
              <Form.Label>Select Leave Dates</Form.Label>
              <DatePicker
  selected={null} // Since `react-datepicker` doesn’t allow an array for `selected`
  onChange={(date) => setLeaveDates([...leaveDates, date])}
  inline
  multiple
/>

            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitLeave}>
            Submit Leave
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllCustomerTable;
