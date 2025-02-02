import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { fetchAdmins, URL, fetchRoutes } from "../../Helper/handle-api";

const AllEmployeeTable = () => {
  const [admins, setAdmins] = useState([]);
  const [allRoutes, setAllRoutes] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [route, setRoute] = useState("");

  useEffect(() => {
    const fetchAdminsData = async () => {
      const admins = await fetchAdmins();
      setAdmins(admins.filter((admin) => admin.role === "Delivery Boy"));
    };
    fetchAdminsData();

    const fetchAllRoutes = async () => {
      const response = await fetchRoutes();
      setAllRoutes(response?.routes || (Array.isArray(response) ? response : []));
    };
    fetchAllRoutes();
  }, []);

  const handleAssignRouteClick = (admin) => {
    setSelectedAdmin(admin);
    setRoute(admin.route || "");
    setShow(true);
  };


  return (
    <>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Route</th>
            <th>Route Assign</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((data) => (
            <tr key={data._id}>
              <td>
                <img src={`${URL}/images/${data.image}`} alt="User" className="avatar" />
              </td>
              <td>{data.name}</td>
              <td>{data.role}</td>
              <td>{data.phone}</td>
              <td>{data.email}</td>
              <td>{data.route || "Unassigned"}</td>
              <td>
                <button className="btn btn-primary" onClick={() => handleAssignRouteClick(data)}>
                  Assign Route
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bootstrap Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Assign Route</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Assign a route to {selectedAdmin?.name}</p>
          <select
            className="form-control"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            placeholder="Enter route"
          ><option value="">Select Route No</option>
          {Array.isArray(allRoutes) &&
            allRoutes.map((route) => (
              <option key={route._id} value={route.name}>
                {route.name}
              </option>
            ))}
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" >
            Save
          </Button>
          <Button variant="danger" onClick={() => setShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AllEmployeeTable;
