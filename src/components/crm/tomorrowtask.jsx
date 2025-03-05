import axios from "axios";
import React, { useEffect, useState } from "react";
import { URL } from "../../Helper/handle-api";

const TomorrowTask = () => {
  const [routeSummary, setRouteSummary] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTomorrowOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`${URL}/orderdetails/tomorrow-orders/routes`);

        if (response.data.success) {
          setRouteSummary(response.data.data);
        } else {
          setError("Failed to fetch data.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTomorrowOrders();
  }, []);

  const renderQuantitiesBadges = (quantities) => {
    return Object.entries(quantities).map(([size, count], index) => (
      <span key={index} className="badge bg-primary-subtle px-2 rounded me-2 mb-1">
        {size} ({count})
      </span>
    ));
  };

  return (
    <div className="col-xl-12 col-lg-6">
      <div className="panel">
        <div className="panel-header">
          <b>Tomorrow's Delivery Summary</b>
        </div>
        <div className="panel-body p-0">
          {isLoading ? (
            <div className="text-center p-4">
              <span className="spinner-border text-primary" role="status"></span>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : Object.keys(routeSummary).length === 0 ? (
            <div className="text-center p-4">No deliveries scheduled for tomorrow</div>
          ) : (
            <div className="table-responsive">
              <table className="table deadline-table table-hover">
                <thead>
                  <tr>
                    <th>Route No</th>
                    <th>Category</th>
                    <th>Product Quantities</th>
                    <th>Total Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(routeSummary).map(([routeNo, categories], index) => (
                    Object.entries(categories).map(([category, data], catIndex) => (
                      <tr key={`${index}-${catIndex}`}>
                        {catIndex === 0 && (
                          <td rowSpan={Object.keys(categories).length} style={{ fontWeight: "bold" }}>{routeNo}</td>
                        )}
                        <td style={{ textAlign:"center"}}>{category}</td>
                        <td>
                          <div className="d-flex flex-wrap">
                            {renderQuantitiesBadges(data.quantities)}
                          </div>
                        </td>
                        <td>{data.totalLiters.toFixed(1)} Liters</td>
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TomorrowTask;
