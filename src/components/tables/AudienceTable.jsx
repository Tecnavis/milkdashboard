import React, { useContext, useEffect, useState } from 'react'
import {DigiContext} from '../../context/DigiContext'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import PaginationSection from './PaginationSection'
import { getAllRoutes, URL ,deleteRoute} from '../../Helper/handle-api'
const AudienceTable = () => {
    const {
        currentPage,
        currentData,
        paginate,
        totalPages,
        pageNumbers
      } = useContext(DigiContext)

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
      },[])
  return (
    <>
    <OverlayScrollbarsComponent>
        <table className="table table-dashed table-hover digi-dataTable target-audience-table table-striped" id="targetAudienceTable">
            <thead>
                <tr>
                <th>ID</th>
                <th>Route</th>
                <th>Product ID</th>
                <th>Cover image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Status</th>
                </tr>
            </thead>
            <tbody>
  {allRoutes.map((route, routeIndex) => (
    route.products.map((product, productIndex) => (
      <tr key={`${routeIndex}-${productIndex}`}>
        {/* Merge Route Name Cell: Display only on the first product */}
        {productIndex === 0 && (
          <td rowSpan={route.products.length}>{routeIndex + 1}</td>
        )}
        {productIndex === 0 && (
          <td rowSpan={route.products.length}>{route.name}</td>
        )}

        <td>{product.productId.productId}</td> {/* Product ID */}
        <td>
          <img 
            src={`${URL}/images/${product.productId.coverimage}`} // Use the cover image URL from the product.productId.coverimage ? `/uploads/${product.productId.coverimage}` : "assets/images/avatar.png"} 
            alt="Product" 
            width="50"
          />
        </td>
        <td>{product.productId.title}</td>
        <td> ₹{product.routePrice}</td> {/* Route-specific price */}
        {productIndex === 0 && (
          <td rowSpan={route.products.length}>
          <div className="btn-box" style={{ justifyContent: 'center' }}>
            <button className='btn btn-sm btn-danger' onClick={() => deleteRoute(route._id)}><i className="fa-light fa-trash"></i> Delete</button>
          </div>
        </td>
         )}
      </tr>
    ))
  ))}
</tbody>


        </table>
    </OverlayScrollbarsComponent>
    <PaginationSection currentPage={currentPage} totalPages={totalPages} paginate={paginate} pageNumbers={pageNumbers}/>
    </>
  )
}

export default AudienceTable