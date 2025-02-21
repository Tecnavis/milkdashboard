import React, { useEffect, useState } from 'react'
import { fetchProducts } from '../../Helper/handle-api';

const MyTasks = () => {
    const [allProducts,setAllProducts] = useState([]);
    useEffect(() => {
        fetchProducts().then((res) => {
            setAllProducts(res);
        })
    },[]);
  return (
    <div className="col-xl-4 col-lg-5">
        <div className="panel">
            <div className="panel-header">
                <h5>My Products</h5>
            </div>
            <div className="panel-body p-0">
                <div className="table-responsive">
                    <table className="table task-table table-hover">
                        <tbody>
                            {allProducts.map((product) => (
                            <tr key={product._id}>
                                <td>
                                    <div className="form-check">
                                        <label className="form-check-label">
                                           {product.category}
                                        </label>
                                    </div>
                                </td>
                                <td>{product.quantity}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  )
}

export default MyTasks