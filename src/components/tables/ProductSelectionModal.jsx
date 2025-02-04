import React, { useState } from "react";
import "./styles.css"
const ProductSelectionModal = ({ isOpen, onClose, route, allProducts }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleSelectProduct = (productId, price) => {
    setSelectedProducts((prev) => {
      const updatedProducts = prev.filter((p) => p.productId !== productId);
      if (price > 0) {
        updatedProducts.push({ productId, price });
      }
      return updatedProducts;
    });
  };


  if (!isOpen) return null;

  return (
    <div className="modal-overlays">
      <div className="modal-contents">
        <h4>Select Products for {route.name}</h4>
        <table className="table">
          <thead>
            <tr>
                <th>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="markAllProduct"/>
                  </div>
                </th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {allProducts.map((product) => (
              <tr key={product._id}>
                <td>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={product._id}
                      onChange={() =>
                        handleSelectProduct(product._id, product.price)
                      }
                    />
                  </div>
                </td>
                <td>{product.productId}</td>
                <td>{product.category}</td>
                <td>
                  <input
                    type="number"
                    placeholder="Enter price"
                    onChange={(e) =>
                      handleSelectProduct(product._id, Number(e.target.value))
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-success" >
          Save
        </button>
        <button className="btn btn-danger" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ProductSelectionModal;
