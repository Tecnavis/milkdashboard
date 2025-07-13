import React, { useState } from "react";
import Footer from "../components/footer/Footer";
import OrderHeader from "../components/header/OrderHeader";
import OrderListTable from "../components/tables/OrderListTable";
import TodayTask from "../components/crm/Deadlines";

const OrderMainContent = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="main-content">
      <div className="row g-4">
        <div className="col-12">
          <div className="panel">
            <div className="panel-body">
              <TodayTask />
              <OrderHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
              <br />
              <OrderListTable searchTerm={searchTerm} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderMainContent;
