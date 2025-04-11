import React, { useEffect, useState } from "react";
import "./Readeam.css";
import axios from "axios";
import { URL } from "../../Helper/handle-api";
import { format } from "date-fns";

export default function Readeam({ routeName, setRoutsnamePass }) {
  const [reward, setReward] = useState([]);
  const [history, setHistory] = useState([]);
  const [points, setPoints] = useState(routeName.point); 

  const fetchReward = async () => {
    try {
      const response = await axios.get(
        `${URL}/rewarditem/${routeName.routeno}`
      );
      setReward(response?.data || []);
    } catch (error) {
      console.error("Error fetching reward items:", error);
    }
  };

  const fetchRewardsHistory = async () => {
    try {
      const id = routeName._id;
      const response = await axios.get(`${URL}/rewards/history/${id}`);
      setHistory(response?.data || []);
    } catch (error) {
      console.error("Error fetching reward history:", error);
    }
  };

  const handleReadeam = async (id, rewardItemId) => {
    try {
      await axios.post(`${URL}/rewards/${id}/readeem/${rewardItemId}`);
      fetchReward();
      fetchRewardsHistory();

      const redeemedItem = reward.find((item) => item._id === rewardItemId);
      if (redeemedItem) {
        setPoints((prev) => prev - redeemedItem.points); 
      }
    } catch (error) {
      console.error("Error redeeming reward:", error);
    }
  };

  useEffect(() => {
    fetchReward();
    fetchRewardsHistory();
  }, []);

  return (
    <>
      <header className="rewards-header">
        <div className="header-content">
          <span
            onClick={() => setRoutsnamePass(false)}
            style={{ cursor: "pointer" }}
          >
            X
          </span>
          <div className="welcome-message">
            <h1>Welcome</h1>
            <h2>{routeName.name}</h2>
          </div>
          <div className="points-display">
            <div className="points-badge">
              <span className="points-value">{points}</span>
              <span className="points-label">Points Available</span>
            </div>
          </div>
        </div>
      </header>

      {/* Product Cards Section */}
      <div className="product-list">
        {reward?.map((item) => {
          const alreadyRedeemed = history.some(
            (his) => his.rewardItem?._id === item._id
          );
          const isAffordable = points >= item.points;

          return (
            <div
              className={`product-card ${alreadyRedeemed ? "blur-card" : ""}`}
              key={item?._id}
            >
              <div className="product-image">
                <img
                  src={`${URL}/images/${item.image}`}
                  alt="reward"
                  width={200}
                  height={200}
                  className="product-img"
                />
              </div>
              <div className="product-info">
                <h3 className="product-name">{item?.title}</h3>
                <div className="product-points">
                  <span className="points">{item?.points}</span>
                  <span className="stock">{item?.stock}</span>
                </div>
                {!alreadyRedeemed && isAffordable && (
                  <button
                    className="redeem-button"
                    onClick={() =>
                      handleReadeam(routeName._id, item._id)
                    }
                  >
                    Redeem Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Redemption History Section */}
      <div className="redemption-history">
        <h2>Previous Redemption History</h2>
        <div className="history-content">
          <table className="history-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Date</th>
                <th>Points</th>
              </tr>
            </thead>
            {history.length !== 0 ? (
              history.map((his) => (
                <tbody key={his._id}>
                  <tr>
                    <td>{his.rewardItem?.title}</td>
                    <td>
                      {format(new Date(his.createdAt), "dd MMM yyyy")}
                    </td>
                    <td>{his.rewardItem?.points}</td>
                  </tr>
                </tbody>
              ))
            ) : (
              <tbody>
                <tr>
                  <td colSpan="3">
                    <div className="no-history">
                      <p>No previous redemptions</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
}
