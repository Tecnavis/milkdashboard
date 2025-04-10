import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FetchCustomer, URL } from "../../Helper/handle-api"; 
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AllCustomerTable = ({searchTerm}) => {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [leaveDates, setLeaveDates] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const response = await FetchCustomer();
    setCustomers(response);
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

    // Format dates properly to account for timezone issues
    const requestData = {
      customerId: selectedCustomer._id,
      dates: leaveDates.map(date => {
        // Create a new date with the year, month, and day to avoid timezone issues
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      })
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


  const filteredCustomers = customers.filter((customer) => {
    const name = customer?.name || "";
    const phone = customer?.phone || "";
    const customerId = customer?.customerId || "";
    const routeno = customer?.routeno || "";
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((data) => (
            <tr key={data._id}>
              <td>
                <Link to="#">{data?.name}</Link>
              </td>
              <td>{data?.routeno}</td>
              <td>{data?.phone}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApplyLeaveClick(data)}
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
          <Form>
            <Form.Group>
              <Form.Label>Select Leave Dates</Form.Label>
              <DatePicker
                selected={null}
                onChange={(date) => setLeaveDates([...leaveDates, date])}
                inline
                multiple
              />
              <div className="mt-3">
                <strong>Selected Dates:</strong>
                <ul>
                  {leaveDates.map((date, index) => (
                    <li key={index}>
                      {date.toLocaleDateString()}
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="ms-2"
                        onClick={() => setLeaveDates(leaveDates.filter((_, i) => i !== index))}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
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