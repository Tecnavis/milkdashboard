import React, { useContext, useState } from "react";
import { Form } from "react-bootstrap";
import { DigiContext } from "../../context/DigiContext";

const CustomerHeader = ({onSearch}) => {
  const { headerBtnOpen, handleHeaderBtn, handleHeaderReset, headerRef } =
    useContext(DigiContext);
    const [searchQuery, setSearchQuery] = useState('');
    

  const [checkboxes, setCheckboxes] = useState({
    showAction: true,
    showCustomerId: true,
    showName: true,
    showPhone: true,
    showGroup: true,
    showCustomerType: true,
    showCreditLimit: true,
    showOpeningBalance: true,
    showDebit: true,
    showCredit: true,
    showClosingBalance: true,
    showStatus: true,
  });

  
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value); // Pass search value to parent component
  };

  const handleChange = (e) => {
    const { id } = e.target;
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [id]: !prevCheckboxes[id],
    }));
  };
  return (
    <div className="panel-header">
      <h5> Assign Products for Routes</h5>
      <div className="btn-box d-flex gap-2">
        <div id="tableSearch">
        <Form.Control 
              type='text' 
              placeholder='Search ...' 
              value={searchQuery} 
              onChange={handleSearch} 
            />
        </div>
      </div>
    </div>
  );
};

export default CustomerHeader;




