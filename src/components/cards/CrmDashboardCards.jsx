import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import {
  fetchAdmins,
  FetchCustomer,
  fetchRoutes1,
} from "../../Helper/handle-api";

const CrmDashboardCards = () => {
  const [allCustomer, setAllCustomer] = useState([]);
  const [allAdmin, setAllAdmin] = useState([]);
  const [allRoutes, setAllRoutes] = useState([]);
  useEffect(() => {
    FetchCustomer().then((res) => setAllCustomer(res));
    fetchAdmins().then((res) => setAllAdmin(res));
    fetchRoutes1().then((res) => setAllRoutes(res.routes || [])); // Ensure it's an array
  }, []);
  const totalRecords = allCustomer.length + allAdmin.length + allRoutes.length;

  const getPercentage = (count) => {
    return totalRecords > 0 ? ((count / totalRecords) * 100).toFixed(2) : 0;
  };

  return (
    <div className="row mb-30">
      <div className="col-lg-4 col-6 col-xs-12">
        <div className="dashboard-top-box d-block rounded border-0 panel-bg">
          <div className="d-flex justify-content-between align-items-center mb-20">
            <div className="right">
              <div className="part-icon text-light rounded">
                <span>
                  <i className="fa-light fa-user-plus"></i>
                </span>
              </div>
            </div>
            <div className="left">
              <h3 className="fw-normal">
                <CountUp end={allCustomer.length} />
              </h3>
            </div>
          </div>
          <div className="progress-box">
            <p className="d-flex justify-content-between mb-1">
              Active Client <small>+{getPercentage(allCustomer.length)}%</small>
            </p>

            <div
              className="progress"
              role="progressbar"
              aria-label="Basic example"
              aria-valuenow="75"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className="progress-bar bg-success"
                style={{ width: `${getPercentage(allCustomer.length)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-6 col-xs-12">
        <div className="dashboard-top-box d-block rounded border-0 panel-bg">
          <div className="d-flex justify-content-between align-items-center mb-20">
            <div className="right">
              <div className="part-icon text-light rounded">
                <span>
                  <i className="fa-light fa-user-secret"></i>
                </span>
              </div>
            </div>
            <div className="left">
              <h3 className="fw-normal">
                <CountUp end={allAdmin.length} />
              </h3>
            </div>
          </div>
          <div className="progress-box">
            <p className="d-flex justify-content-between mb-1">
              Active Admin <small>+{getPercentage(allAdmin.length)}%</small>
            </p>{" "}
            <div
              className="progress"
              role="progressbar"
              aria-label="Basic example"
              aria-valuenow="75"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className="progress-bar bg-primary"
                style={{ width: `${getPercentage(allAdmin.length)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-6 col-xs-12">
        <div className="dashboard-top-box d-block rounded border-0 panel-bg">
          <div className="d-flex justify-content-between align-items-center mb-20">
            <div className="right">
              <div className="part-icon text-light rounded">
                <span>
                  <i className="fa-light fa-money-bill"></i>
                </span>
              </div>
            </div>
            <div className="left">
              <h3 className="fw-normal">
                <CountUp end={allRoutes.length} />
              </h3>
            </div>
          </div>
          <div className="progress-box">
            <p className="d-flex justify-content-between mb-1">
              Total Routes <small>+{getPercentage(allRoutes.length)}%</small>
            </p>{" "}
            <div
              className="progress"
              role="progressbar"
              aria-label="Basic example"
              aria-valuenow="75"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className="progress-bar bg-warning"
                style={{ width: `${getPercentage(allRoutes.length)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrmDashboardCards;
