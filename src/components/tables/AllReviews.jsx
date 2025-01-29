import React, { useEffect, useState } from 'react'
import { attendanceData } from '../../data/Data'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import PaginationSection from './PaginationSection';
import { fetchAllReview,deleteReview } from '../../Helper/handle-api';
import Swal from 'sweetalert2';

const ReviewTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(10);
    const dataList = attendanceData
     // Pagination logic
     const indexOfLastData = currentPage * dataPerPage;
     const indexOfFirstData = indexOfLastData - dataPerPage;
     const currentData = dataList.slice(indexOfFirstData, indexOfLastData);
   
     const paginate = (pageNumber) => {
       setCurrentPage(pageNumber);
     };
   
     // Calculate total number of pages
     const totalPages = Math.ceil(dataList.length / dataPerPage);
     const pageNumbers = [];
     for (let i = 1; i <= totalPages; i++) {
       pageNumbers.push(i);
     }
   
     const [allReview, setAllReview]= useState([]);
     useEffect(()=>{
        fetchAllReview().then((res)=>{
            setAllReview(res);
        })
     },[])
     const handleDelete = async (id) => {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await deleteReview(id);
              Swal.fire("Deleted!", "Review has been deleted.", "success");
      
              // Refresh the review list after deletion
              setAllReview(allReview.filter((review) => review._id !== id));
            } catch (error) {
              Swal.fire("Error!", "Failed to delete review.", "error");
            }
          }
        });
      };
  return (
    <>
      <div className="main-content">
        <div className="row">
          <div className="col-12">
            <div className="panel">
              <div className="panel-body">
                <OverlayScrollbarsComponent>
                  <table
                    className="table table-dashed table-hover digi-dataTable attendance-table table-striped"
                    id="attendanceTable"
                  >
                    <thead>
                      <tr>
                        <th className="no-sort">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="markAllAttendance"
                            />
                          </div>
                        </th>
                        <th>Date</th>
                        <th>Name</th>
                        <th>product ID</th>
                        <th>Category</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allReview.map((data) => (
                        <tr key={data._id}>
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                            </div>
                          </td>
                          <td>{new Date(data.createdAt).toLocaleDateString("en-GB")}</td>
                          <td>{data.customerId.name}</td>
                          <td>{data.productId.productId}</td>
                          <td>{data.productId.category}</td>
                          <td className="rating">
                            {data.rating}
                            <div className="star">
                              {[...Array(5)].map((_, index) => (
                                <i
                                  key={index}
                                  className={`fa-solid fa-star ${
                                    index < data.rating ? "starred" : ""
                                  }`}
                                ></i>
                              ))}
                            </div>
                          </td>

                          <td>{data.comment}</td>
                          <td>
                            <div className="btn-box">
                              {/* <button className="btn btn-sm btn-icon btn-primary">
                                <i className="fa-light fa-edit"></i>
                              </button> */}
                              <button className="btn btn-sm btn-icon btn-danger">
                                <i className="fa-light fa-trash-can" onClick={() => handleDelete(data._id)}></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </OverlayScrollbarsComponent>
                <PaginationSection
                  currentPage={currentPage}
                  totalPages={totalPages}
                  paginate={paginate}
                  pageNumbers={pageNumbers}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReviewTable