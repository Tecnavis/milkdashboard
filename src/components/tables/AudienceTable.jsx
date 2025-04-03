import React, { useContext, useEffect, useState } from "react";
import { DigiContext } from "../../context/DigiContext";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import { getAllRoutes, URL, deleteRoute, deleteRouteId } from "../../Helper/handle-api";

const AudienceTable = () => {
  const { currentPage, currentData, paginate, totalPages, pageNumbers } = useContext(DigiContext);

  const [allRoutes, setAllRoutes] = useState([]);

  useEffect(() => {
    const fetchAllRoutes = async () => {
      const response = await getAllRoutes();
      if (response && response.routes) {
        setAllRoutes(response.routes);
      } else {
        setAllRoutes(Array.isArray(response) ? response : []);
      }
    };
    fetchAllRoutes();
  }, []);

  return (
    <>
      <OverlayScrollbarsComponent>
        <table className="table table-dashed table-hover digi-dataTable target-audience-table table-striped" id="targetAudienceTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Route</th>
              <th>Product ID</th>
              <th>Cover Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Actions</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allRoutes.map((route, routeIndex) =>
              route.products.map((product, productIndex) => (
                <tr key={`${routeIndex}-${productIndex}`}>
                  {/* Merge Route Name Cell: Display only on the first product */}
                  {productIndex === 0 && <td rowSpan={route.products.length} className="align-middle text-center">{routeIndex + 1}</td>}
                  {productIndex === 0 && <td rowSpan={route.products.length} className="align-middle text-center">{route.name}</td>}

                  <td className="align-middle text-center">{product.productId.productId}</td>

                  <td className="align-middle text-center">
                    <img 
                      src={`${URL}/images/${product.productId.coverimage}`} 
                      alt="Product" 
                      width="50"
                    />
                  </td>

                  <td className="align-middle text-center">{product.productId.title}</td>
                  <td className="align-middle text-center">₹{product.routePrice}</td>

                  {/* Delete Product Button (Centered) */}
                  <td className="align-middle text-center">
                    <button className="btn btn-sm btn-danger" onClick={() => deleteRouteId(route._id, product.productId._id)}>
                      Delete
                    </button>
                  </td>

                  {/* Delete Route Button (Centered, Only for First Product) */}
                  {productIndex === 0 && (
                    <td rowSpan={route.products.length} className="align-middle text-center">
                      <button className="btn btn-sm btn-danger" onClick={() => deleteRoute(route._id)}>
                        <i className="fa-light fa-trash"></i> Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </OverlayScrollbarsComponent>

      <PaginationSection 
        currentPage={currentPage} 
        totalPages={totalPages} 
        paginate={paginate} 
        pageNumbers={pageNumbers} 
      />
    </>
  );
};

export default AudienceTable;
