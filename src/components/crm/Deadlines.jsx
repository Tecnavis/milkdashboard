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
        console.log(data, "data");
        
        setRouteSummary(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayOrders();
  }, []);

  // Function to calculate total liters per route
  const calculateTotalLitersPerRoute = () => {
    const totals = {};
    Object.entries(routeSummary).forEach(([routeNo, categories]) => {
      totals[routeNo] = Object.values(categories).reduce((sum, category) => sum + category.totalLiters, 0);
    });
    return totals;
  };

  const totalLitersPerRoute = calculateTotalLitersPerRoute();

  const renderQuantitiesBadges = (quantities) => {
    return Object.entries(quantities).map(([size, count], index) => (
      <span key={index} className="badge bg-primary-subtle px-2 rounded me-2 mb-1">
        {size}({count})
      </span>
    ));
  };
  const calculateOverallTotalVolume = () => {
    return Object.values(totalLitersPerRoute).reduce((sum, liters) => sum + liters, 0).toFixed(1);
  };
  
  const overallTotalVolume = calculateOverallTotalVolume();
  
  return (
    <div className="col-xl-12 col-lg-6">
      <div className="panel">
      <div className="panel-header">
  <b>Today's Delivery Summary (Total Order Litter: {overallTotalVolume} Liters)</b>
<p> Date:  {new Date().toLocaleDateString()}</p>
</div>

        <div className="panel-body p-0">
          <div className="table-responsive">
            <table className="table deadline-table table-hover">
              <thead>
                <tr>
                  <th>Route No</th>
                  <th>Category</th>
                  <th>Product Quantities</th>
                  <th>Total Volume</th>
                  <th>Total Volume Of Route</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center">Loading...</td>
                  </tr>
                ) : Object.keys(routeSummary).length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">No deliveries scheduled for today</td>
                  </tr>
                ) : (
                  Object.entries(routeSummary).map(([routeNo, categories], routeIndex) => {
                    let isFirstCategory = true;
                    return Object.entries(categories).map(([category, data], categoryIndex) => {
                      const showTotalVolume = isFirstCategory;
                      isFirstCategory = false;
                      return (
                        <tr key={`${routeIndex}-${categoryIndex}`}>
                          <td style={{fontWeight: "bold"}}>{categoryIndex === 0 ? routeNo : ""}</td>
                          <td>{category}</td>
                          <td>
                            <div>
                              {renderQuantitiesBadges(data.quantities)}
                            </div>
                          </td>
                          <td>{data.totalLiters.toFixed(1)} Liters</td>
                          <td>{showTotalVolume ? `${totalLitersPerRoute[routeNo].toFixed(1)} Liters` : ""}</td>
                        </tr>
                      );
                    });
                  })
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
