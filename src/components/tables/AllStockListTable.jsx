import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { fetchAdmins, URL, fetchRoutes } from "../../Helper/handle-api";

const AllEmployeeTable = ({ searchQuery }) => {
  const [admins, setAdmins] = useState([]);
  const [allRoutes, setAllRoutes] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [route, setRoute] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminsData = async () => {
      try {
        const adminsData = await fetchAdmins();
        setAdmins(adminsData.filter((admin) => admin.role === "Delivery Boy"));
      } catch (err) {
        console.error("Error fetching admins:", err);
      }
    };
    fetchAdminsData();

    const fetchAllRoutes = async () => {
      try {
        const response = await fetchRoutes();
        // Make sure to handle both cases if response.routes exists or response is an array.
        setAllRoutes(
          response?.routes || (Array.isArray(response) ? response : [])
        );
      } catch (err) {
        console.error("Error fetching routes:", err);
      }
    };
    fetchAllRoutes();
  }, []);

  const handleAssignRouteClick = (admin) => {
    setSelectedAdmin(admin);
    setRoute(admin.route || "");
    setShow(true);
  };

  const handleSaveRoute = async () => {
    if (!selectedAdmin) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${URL}/admin/assign-route/${selectedAdmin._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ route }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // If the backend returns an error message.
        setError(data.message || "Failed to update the route.");
        return;
      }

      // Update the admin list with the new route
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin._id === selectedAdmin._id ? data.admin : admin
        )
      );

      // Optionally, you can display a success message here
      setShow(false);
    } catch (err) {
      console.error("Error updating route:", err);
      setError("An error occurred while updating the route.");
    } finally {
      setLoading(false);
    }
  };

  // Filter customers based on search query
  const filteredCustomers = admins.filter(
    (admin) =>
      admin.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.phone?.includes(searchQuery) ||
      admin.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.route?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          {filteredCustomers.map((data) => (
            <tr key={data._id}>
              <td>
                <img
                  src={`${URL}/images/${data.image}`}
                  alt="User"
                  className="avatar"
                />
              </td>
              <td>{data.name}</td>
              <td>{data.role}</td>
              <td>{data.phone}</td>
              <td>{data.email}</td>
              <td>{data.route || "Unassigned"}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAssignRouteClick(data)}
                >
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
          >
            <option value="">Select Route No</option>
            {Array.isArray(allRoutes) &&
              allRoutes.map((routeItem) => (
                <option key={routeItem._id} value={routeItem.name}>
                  {routeItem.name}
                </option>
              ))}
          </select>
          {error && <p className="text-danger mt-2">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={handleSaveRoute}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
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
