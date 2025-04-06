import { useEffect, useState } from "react";
import "./rewarditem.css";
import axios from "axios";
import { URL } from "../../Helper/handle-api";
import Readeam from "./Readeam";

const ITEMS_PER_PAGE = 20;

export default function Rewardredeams() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [costemers, setCostemers] = useState([]);
  const [filteredCostemers, setFilteredCostemers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [routeName, setRouteName] = useState(null);
  const [routsnamePass, setRoutsnamePass] = useState(false);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${URL}/route`);
      setCategories(response?.data?.routes || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCostomers = async () => {
    try {
      const response = await axios.get(`${URL}/customer`);
      setCostemers(response?.data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };



  const handlePassRoutesName = (route) => {
     setRoutsnamePass(true)
     setRouteName(route)
  }

  

  useEffect(() => {
    fetchCostomers();
    fetchCategory();
  }, []);

  useEffect(() => {
    let filtered = [...costemers];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((cust) => cust.routeno === selectedCategory);
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((cust) =>
        cust.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCostemers(filtered);
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, costemers]);

  const totalPages = Math.ceil(filteredCostemers.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredCostemers.slice(indexOfFirstItem, indexOfLastItem);
   

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <>
       {

!routsnamePass ?

(

    <div className="container mx-auto p-4">
      {/* Filter and Search */}
      <div className="filter-bar">
        {/* Filter dropdown */}
        <div className="relative">
          <button
            className="filter-category-button"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            {selectedCategory === "all" ? "All Routes" : selectedCategory}
          </button>

          {showCategoryDropdown && (
            <div className="category-dropdown-modal absolute mt-2 bg-white shadow-md rounded z-10 w-40">
              <div
                className={`category-option p-2 cursor-pointer ${
                  selectedCategory === "all" ? "bg-gray-200" : ""
                }`}
                onClick={() => {
                  setSelectedCategory("all");
                  setShowCategoryDropdown(false);
                }}
              >
                All Routes
              </div>
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className={`category-option p-2 cursor-pointer ${
                    selectedCategory === cat.name ? "bg-gray-200" : ""
                  }`}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setShowCategoryDropdown(false);
                  }}
                >
                  {cat.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <div>

        <input
          type="text"
          className="search-input border px-3 py-2 rounded"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          />

          </div>

      </div>

      {/* Table */}
      <div className="table-container overflow-x-auto">
        <table className="data-table w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Points</th>
              <th className="p-2 text-left">View</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.points || "0"}</td>
                  <td className="p-2">
                    <button className="view-button px-2 py-1 bg-blue-500 text-white rounded"  onClick={() => handlePassRoutesName(item)}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination mt-6 flex flex-wrap justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num}
              onClick={() => handlePageChange(num + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === num + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {num + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
            Next
          </button>
        </div>
      )}
    </div>
    )
    :
    ( 
      <Readeam routeName = {routeName}  setRoutsnamePass = {setRoutsnamePass} />
    )
    }
    </>
  );
}



