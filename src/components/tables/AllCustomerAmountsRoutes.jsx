import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { FetchCustomer } from "../../Helper/handle-api";
import { Link } from "react-router-dom";

const AllCustomerAmountTable = ({ searchTerm }) => {
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
      const routeKey = customer.routeno || "No Route";
      if (!acc[routeKey]) {
        acc[routeKey] = [];
      }
      acc[routeKey].push(customer);
      return acc;
    }, {});
    setGroupedCustomers(grouped);
  };

  return (
    <div style={{ overflowX: "auto" }}>
      {Object.keys(groupedCustomers)
        .filter((routeNo) =>
          routeNo.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((routeNo) => {
          // Calculate total for this route
          const totalAmount = groupedCustomers[routeNo].reduce(
            (sum, customer) =>
              sum +
              customer.paidAmounts.reduce((subSum, entry) => subSum + entry.amount, 0),
            0
          );

          return (
            <div key={routeNo}>
              <b>Route No: {routeNo}</b>
              <Table className="table table-dashed table-hover table-striped">
                <thead>
                  <tr>
                    <th>Customer Id</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Paid Amount</th>
                    <th>Unpaid Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedCustomers[routeNo].map((data) => (
                    <tr key={data._id}>
                      <td style={{ textAlign: "center" }}>{data.customerId}</td>
                      <td>
                        <Link to="#">{data.name}</Link>
                      </td>
                      <td>{data.phone}</td>
                      <td>
                        {data.address.map((addr, index) => (
                          <div key={index}>
                            {addr.streetAddress}, {addr.apartment},{" "}
                            {addr.postcode}
                          </div>
                        ))}
                      </td>
                      <td>
                        {data.paidAmounts
                          .filter((entry) => entry.isGet)
                          .reduce((sum, entry) => sum + entry.amount, 0)}
                      </td>
                      <td>
                        {data.paidAmounts
                          .filter((entry) => !entry.isGet)
                          .reduce((sum, entry) => sum + entry.amount, 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {/* Show the total only once per route */}
              <div style={{ textAlign: "right", fontWeight: "bold" }}>
                Total for Route {routeNo}:  {totalAmount}
              </div>
              <br />
            </div>
          );
        })}
    </div>
  );
};

export default AllCustomerAmountTable;
