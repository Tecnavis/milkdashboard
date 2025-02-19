import React from 'react'
import BalanceChart from '../charts/BalanceChart'

const BalanceOverview = () => {
  return (
    <div className="col-lg-8">
        <div className="panel chart-panel-1">
            <div className="panel-header">
                <h5>Weekly Order Insights</h5>
                <div className="btn-box">
                    <button className="btn btn-sm btn-outline-primary">Week</button>
                </div>
            </div>
            <div className="panel-body">
                <div id="balanceOverview" className="chart-dark">
                    <BalanceChart/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default BalanceOverview