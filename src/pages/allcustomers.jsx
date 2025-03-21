import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchAllOrders ,URL} from "../Helper/handle-api";

const AllCustomerTable = ({ searchTerm }) => {
  const [customers, setCustomers] = useState([]);
  const [groupedCustomers, setGroupedCustomers] = useState({});
  

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await fetchAllOrders();
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
        .map((routeNo) => (
          <div key={routeNo}>
            <b>Route No: {routeNo}</b>
            <Table className="table table-dashed table-hover table-striped">
              <thead>
                <tr>
                  <th>Customer Id</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Paid Amount </th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {groupedCustomers[routeNo].map((data) => (
                  <tr key={data._id}>
                    <td >{data?.customer?.customerId}</td>
                    <td>
                      <Link to="#">{data?.customer?.name}</Link>
                    </td>
                    <td>{data?.customer?.phone}</td>
                   
                    <td>
  {data?.customer?.paidAmounts?.reduce((sum, payment) => sum + payment.amount, 0)}
</td>
<td>{data.totalPrice}</td>

                  </tr>
                ))}
              </tbody>
            </Table>
            <br/>
          </div>
        ))}
    </div>
  );
};

export default AllCustomerTable;