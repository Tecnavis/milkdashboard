import React, { useState, useEffect } from "react";
import { fetchAdmins, URL } from "../../Helper/handle-api";

const AllEmployeeTable = () => {
  const [admins, setAdmins] = useState([]);
  // Fetch all employees
  useEffect(() => {
    const fetchAdminsData = async () => {
      const admins = await fetchAdmins();
      const filteredAdmins = admins.filter((admin) => admin.role === "Delivery Boy");
      setAdmins(filteredAdmins);
    };
    fetchAdminsData();
  }, []);

  return (
    <>
      <table
        className="table table-dashed table-hover digi-dataTable all-employee-table table-striped"
        id="allEmployeeTable"
      >
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((data) => (
            <tr key={data._id}>
              <td>
                <div className="avatar">
                  <img src={`${URL}/images/${data.image}`} alt="User" />
                </div>
              </td>
              <td>{data.name}</td>
              <td>{data.role}</td>
              <td>{data.phone}</td>
              <td>{data.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AllEmployeeTable;
