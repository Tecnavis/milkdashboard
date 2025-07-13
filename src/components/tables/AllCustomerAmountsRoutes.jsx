import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { FetchCustomer } from "../../Helper/handle-api";
import { Link, useNavigate } from "react-router-dom";

const AllCustomerAmountTable = ({ searchTerm }) => {
  const [customers, setCustomers] = useState([]);
  const [groupedCustomers, setGroupedCustomers] = useState({});
  const nvigate = useNavigate();

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

  const term = searchTerm.toLowerCase();
  const filteredGrouped = {};
  Object.entries(groupedCustomers).forEach(([routeNo, custList]) => {
    const filtered = custList.filter((c) => {
      return (
        (c.customerId && c.customerId.toString().toLowerCase().includes(term)) ||
        (c.name && c.name.toLowerCase().includes(term)) ||
        (c.phone && c.phone.toLowerCase().includes(term)) ||
        (c.address && c.address.some((a) =>
          `${a.streetAddress} ${a.apartment} ${a.postcode}`.toLowerCase().includes(term)
        ))
      );
    });
    if (filtered.length > 0) {
      filteredGrouped[routeNo] = filtered;
    }
  });

  return (
    <div style={{ overflowX: "auto" }}>
      {Object.keys(filteredGrouped).length > 0 ? (
        Object.entries(filteredGrouped).map(([routeNo, customers]) => {
          // Total paid/unpaid for this route
          const totalAmount = customers.reduce(
            (sum, customer) =>
              sum +
              customer.paidAmounts.reduce((subSum, entry) => subSum + entry.amount, 0),
            0
          );

          return (
            <div key={routeNo}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <b>Route No: {routeNo}</b>
                <b style={{ textAlign: "right", fontWeight: "bold" }}>
                  Total for Route {routeNo}: {totalAmount}
                </b>
              </div>
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
                  {customers.map((data) => (
                    <tr key={data._id}>
                      <td onClick={() => nvigate(`/customeramount/${data?.customerId}`)} style={{ textAlign: "center", cursor: "pointer" }}>{data.customerId}</td>
                      <td>
                        {data.name}
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
              <br />
            </div>
          );
        })
      ) : (
        <p>No customers found for the entered search term.</p>
      )}
    </div>
  );
};

export default AllCustomerAmountTable;
