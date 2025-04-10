import React, { useEffect, useState } from "react";
import { customerData } from "../../data/Data";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import { fetchRoutes, fetchProducts } from "../../Helper/handle-api";
import ProductSelectionModal from "./ProductSelectionModal"; // Import the modal component

const CustomerTable = ({searchQuery}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [allRoutes, setAllRoutes] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAllRoutes = async () => {
      const response = await fetchRoutes();
      if (response && response.routes) {
        setAllRoutes(response.routes);
      } else {
        setAllRoutes(Array.isArray(response) ? response : []);
      }
    };
    fetchAllRoutes();

    fetchProducts().then((res) => {
      setAllProducts(res);
    });
  }, []);

  const handleSelectProduct = (route) => {
    setSelectedRoute(route);
    setIsModalOpen(true);
  };


  const filteredRoute = allRoutes.filter((route) =>
    route.name?.toLowerCase().includes(searchQuery.toLowerCase()) 
  );
  

  return (
    <>
      <OverlayScrollbarsComponent>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Item</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoute.map((route, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{route.name}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleSelectProduct(route)}
                  >
                    Select Product
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </OverlayScrollbarsComponent>

      {/* <PaginationSection
        currentPage={currentPage}
        totalPages={Math.ceil(allRoutes.length / dataPerPage)}
        paginate={setCurrentPage}
      /> */}

      {isModalOpen && (
        <ProductSelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          route={selectedRoute}
          allProducts={allProducts}
        />
      )}
    </>
  );
};

export default CustomerTable;
