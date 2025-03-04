import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { FetchCustomer, deleteCustomer, URL } from "../../Helper/handle-api";
import { Link } from "react-router-dom";

const AllCustomerTable = ({ searchTerm }) => {
  const [customers, setCustomers] = useState([]);
  const [groupedCustomers, setGroupedCustomers] = useState({});

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
    </div>
  );
};

export default AllCustomerTable;
