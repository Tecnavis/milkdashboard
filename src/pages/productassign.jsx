import { useState } from "react";
import AddRouteModal from "./newrouteModal";
import Footer from "../components/footer/Footer";
import CustomerHeader from "../components/header/CustomerHeader";
import ProductTable from "../components/tables/Productlisting";

const CustomerMainContent = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


  return (
    <div className="main-content">
      <div className="row">
        <div className="col-12">
          <div className="panel">
            <CustomerHeader onSearch={setSearchQuery} />
            <div className="panel-body">
              <div className="table-filter-option">
                <div className="row g-3">
                  <div className="col-xl-10 col-9 col-xs-12">
                    <form className="row g-2">
                      <div className="col">
                        <button
                          type="button"
                          className="btn btn-sm btn-primary w-100"
                          onClick={() => setShowModal(true)}
                        >
                          ADD NEW
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="col-xl-2 col-3 col-xs-12 d-flex justify-content-end"></div>
                </div>
              </div>
              <ProductTable searchQuery={searchQuery} />
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Add Route Modal */}
      <AddRouteModal show={showModal} handleClose={() => setShowModal(false)} />
    </div>
  );
};

export default CustomerMainContent;
