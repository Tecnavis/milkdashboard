import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FetchallOrders1, fetchRoutes1 } from "../../Helper/handle-api";

const RecentProjects = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [allRoutes, setAllRoutes] = useState([]);

  useEffect(() => {
    FetchallOrders1()
      .then((res) => {
        setAllOrders(res || []);
      })
      .catch((err) => console.error("Error fetching orders:", err));

   fetchRoutes1().then((res) => setAllRoutes(res.routes || []));
  }, []);

  console.log("Orders Response:", allRoutes);
  // Count orders for each route
  const routeOrderCount = allOrders.reduce((acc, order) => {
    const routeName = order.customer?.routeno;
    if (routeName) {
      acc[routeName] = (acc[routeName] || 0) + 1;
    }
    return acc;
  }, {});
  return (
    <div className="col-lg-4">
      <div className="panel">
        <div className="panel-header">
          <h5>Route Based Orders</h5>
          <div className="btn-box">
            <Link to="/task" className="btn btn-sm btn-outline-primary">
              View All
            </Link>
          </div>
        </div>
        <div className="panel-body">
          <div className="table-responsive">
            {/* //each route have how much order availble// */}
            <table className="table table-striped mb-0 recent-project-table mt-3">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Order Count</th>
                </tr>
              </thead>
              <tbody>
                {allRoutes.map((route) => (
                  <tr key={route._id}>
                    <td>{route.name || "N/A"}</td>
                    <td>{routeOrderCount[route.name] || 0}</td>
                  </tr>
                ))}
                {allRoutes.length === 0 && (
                  <tr>
                    <td colSpan="2" className="text-center">
                      No Routes Available
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
