import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FetchallOrders1, fetchRoutes1 } from "../../Helper/handle-api";

const RecentProjects = () => {
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    FetchallOrders1()
      .then((res) => {
        setAllOrders(res || []);
      })
      .catch((err) => console.error("Error fetching orders:", err));

      fetchRoutes1()
      .then((res) => {
        setAllOrders(res.routes || []);
      })
      .catch((err) => console.error("Error fetching routes:", err));
  }, []);

  console.log("Orders Response:", allOrders);

  return (
    <div className="col-lg-4">
      <div className="panel">
        <div className="panel-header">
          <h5>Recent Projects</h5>
          <div className="btn-box">
            <Link to="/task" className="btn btn-sm btn-outline-primary">
              View All
            </Link>
          </div>
        </div>
        <div className="panel-body">
          <div className="table-responsive">
            <table className="table table-striped mb-0 recent-project-table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.customer?.routeno || "N/A"}</td>
                    <td>{order.customer?.name || "N/A"}</td>
                  </tr>
                ))}
                {allOrders.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No Orders Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <table className="table table-striped mb-0 recent-project-table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.customer?.routeno || "N/A"}</td>
                    <td>{order.customer?.name || "N/A"}</td>
                  </tr>
                ))}
                {allOrders.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No Orders Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentProjects;
