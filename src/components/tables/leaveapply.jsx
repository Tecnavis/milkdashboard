import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { BottleSummary, updateReturnedBottles } from "../../Helper/handle-api"; 
import { Link } from "react-router-dom";

const AllCustomerTable = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const response = await BottleSummary();
    setCustomers(response?.customers || []);
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
                  size="sm">
                 Apply Leave
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AllCustomerTable;
