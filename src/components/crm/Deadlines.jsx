import axios from "axios";
import React, { useEffect, useState } from "react";
import { URL } from "../../Helper/handle-api";

const Deadlines = () => {
  const [routeSummary, setRouteSummary] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTodayOrders = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${URL}/orderdetails/today-orders/routes`); 
        const { data } = response.data;

        setRouteSummary(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayOrders();
  }, []);

  const renderQuantitiesBadges = (quantities) => {
    return Object.entries(quantities).map(([size, count], index) => (
      <span key={index} className="badge bg-primary-subtle px-2 rounded me-2 mb-1">
        {size}({count})
      </span>
    ));
  };

  return (
    <div className="col-xl-12 col-lg-6">
      <div className="panel">
        <div className="panel-header">
          <b>Today's Delivery Summary</b>
        </div>
        <div className="panel-body p-0">
          <div className="table-responsive">
            <table className="table deadline-table table-hover">
              <thead>
                <tr>
                  <th>Route No</th>
                  <th>Product Quantities</th>
                  <th>Total Volume</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="3" className="text-center">Loading...</td>
                  </tr>
                ) : Object.keys(routeSummary).length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center">No deliveries scheduled for today</td>
                  </tr>
                ) : (
                  Object.entries(routeSummary).map(([routeNo, data], index) => (
                    <tr key={index}>
                      <td>{routeNo}</td>
                      <td>
                        <div className="d-flex flex-wrap">
                          {renderQuantitiesBadges(data.quantities)}
                        </div>
                      </td>
                      <td>{data.totalLiters.toFixed(1)} Liters</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deadlines;
