import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import {
  FetchCustomer,
  deleteCustomer,
  fetchRoutes,
  URL,
} from "../../Helper/handle-api";
import { Link } from "react-router-dom";
const AllCustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [allRoutes, setAllRoutes] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await FetchCustomer();
      setCustomers(response);
    };
    fetchCustomers();

    const fetchAllRoutes = async () => {
      const response = await fetchRoutes();
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

  return (
    <>
      <div style={{ overflowX: "auto" }}>
        <Table className="table table-dashed table-hover digi-dataTable all-product-table table-striped">
          <thead>
            <tr>
              <th>Customer Id</th>
              <th>Proof Image</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Location </th>
              <th>Route No </th>
              <th>Route Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((data) => (
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
                </td>{" "}
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
                <td>{data.routeno}</td>
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
      </div>
    </>
  );
};

export default AllCustomerTable;
