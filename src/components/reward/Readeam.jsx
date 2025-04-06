import React, { useEffect, useState } from 'react';
import './Readeam.css';
import axios from "axios";
import { URL } from "../../Helper/handle-api";

export default function Readeam({ routeName, setRoutsnamePass }) {

    const [reward, setReward] = useState([]);


    const fetchReward = async () => {
       
        try {
            const response = await axios.get(`${URL}/rewarditem/${routeName.routeno}`);
            setReward(response?.data || []);
          } catch (error) {
            console.error("Error fetching customers:", error);
          }
    }

    useEffect(() => {
      fetchReward();
    }, [])
   
  return (
    <>
      <header className="rewards-header">
        <div className="header-content">
            <span onClick={() => setRoutsnamePass(false)} style={{cursor: 'pointer'}}>X</span>
          <div className="welcome-message">
            <h1>Welcome</h1>
            <h2>{routeName.name}</h2>
          </div>
          <div className="points-display">
            <div className="points-badge">
              <span className="points-value">{100}</span>
              <span className="points-label">Points Available</span>
            </div>
          </div>
        </div>
      </header>

      {/* Product Cards Section */}
      <div className="product-list">
        {reward?.map((item) => (
          <div className="product-card" key={item}>
            <div className="product-image">
              <img
                src={`${URL}/images/${item.image}`}
                alt="gun"
                width={200}
                height={200}
                className="product-img"
              />
            </div>
            <div className="product-info">
              <h3 className="product-name">{item.title}</h3>
              <div className="product-points">
                <span className="points">{item.points}</span>
              </div>
              <button className="redeem-button">Redeem Now</button>
            </div>
          </div>
        ))}
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
            <tbody></tbody>
          </table>
          <div className="no-history">
            <p>No previous redemptions</p>
          </div>
        </div>
      </div>
    </>
  );
}
