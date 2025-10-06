import React, { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { DigiContext } from "../../context/DigiContext";

const AppsPart = () => {
  const {
    state,
    toggleCrmDropdown,
    toggleHrmDropdown,
    toggleAccountsDropdown,
    toggleEcommerceDropdown,
    toggleRewardDropdown,
    toggleMainDropdown,
    toggleSubDropdown,
    layoutPosition,
    dropdownOpen,
    mainAppsDropdownRef,
    isExpanded,
    isNavExpanded,
    isSmallScreen,
    toggleReportDropdown,
    toggleWarehouseDropdown,
  } = useContext(DigiContext);
  const {
    isMainDropdownOpen,
    isCrmDropdownOpen,
    isHrmDropdownOpen,
    isEcommerceDropdownOpen,
    isSubDropdownOpen,
    isRewardDropdownOpen,
    isReportDropdownOpen,
    isWarehouseDropdownOpen,
  } = state;

  const handleSubNavLinkClick = () => {
    if (!isSubDropdownOpen) {
      toggleSubDropdown(); // Open the sub-dropdown
    }
  };
  return (
    <li
      className="sidebar-item"
      ref={
        isExpanded ||
        isNavExpanded.isSmall ||
        layoutPosition.horizontal ||
        (layoutPosition.twoColumn && isExpanded) ||
        (layoutPosition.twoColumn && isSmallScreen)
          ? mainAppsDropdownRef
          : null
      }
    >
      <Link
        role="button"
        className={`sidebar-link-group-title has-sub ${
          isMainDropdownOpen ? "show" : ""
        }`}
        onClick={toggleMainDropdown}
      >
        Apps
      </Link>
      <ul
        className={`sidebar-link-group 
      ${
        layoutPosition.horizontal
          ? dropdownOpen.apps
            ? "d-block"
            : "d-none"
          : isMainDropdownOpen
          ? "d-none"
          : ""
      }
      `}
      >
        <li className="sidebar-dropdown-item">
          <Link
            role="button"
            className={`sidebar-link has-sub ${
              isHrmDropdownOpen ? "show" : ""
            }`}
            onClick={toggleHrmDropdown}
          >
            <span className="nav-icon">
              <i className="fa-light fa-user-tie"></i>
            </span>{" "}
            <span className="sidebar-txt">HRM</span>
          </Link>
          <ul
            className={`sidebar-dropdown-menu ${
              isHrmDropdownOpen && isSubDropdownOpen ? "d-block" : ""
            }`}
            id="hrmDropdown"
          >
            <li className="sidebar-dropdown-item">
              <NavLink
                to="/allCustomer"
                className="sidebar-link"
                onClick={handleSubNavLinkClick}
              >
                All Customer
              </NavLink>
            </li>

            <li className="sidebar-dropdown-item">
              <NavLink
                to="/allCustomerByRoutes"
                className="sidebar-link"
                onClick={handleSubNavLinkClick}
              >
                All Customer By Routes
              </NavLink>
            </li>

               <li className="sidebar-dropdown-item">
              <NavLink
                to="/salesorders"
                className="sidebar-link"
                onClick={handleSubNavLinkClick}
              >
                 Customer Plan 
              </NavLink>
            </li>

            <li className="sidebar-dropdown-item">
              <NavLink
                to="/allorders"
                className="sidebar-link"
                onClick={handleSubNavLinkClick}
              >
                Customer Order details
              </NavLink>
            </li>

            <li className="sidebar-dropdown-item">
              <NavLink
                to="/customerbottlestock"
                className="sidebar-link"
                onClick={handleSubNavLinkClick}
              >
                Customer Bottle Stock
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink
                to="/leaveapply"
                className="sidebar-link"
                onClick={handleSubNavLinkClick}
              >
                Customer Leave Apply
              </NavLink>
            </li>
            {/* <li className="sidebar-dropdown-item">
              <NavLink to="/addEmployee" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Add Employee
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/attendance" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Attendance
              </NavLink>
            </li> */}
          </ul>
        </li>

        <li className="sidebar-dropdown-item">
          <Link
            role="button"
            className={`sidebar-link has-sub ${
              isReportDropdownOpen ? "show" : ""
            }`}
            onClick={toggleReportDropdown}
          >
            <span className="nav-icon">
              <i className="fa-light fa-chart-line" title="Reports"></i>
            </span>{" "}
            <span className="sidebar-txt">Reports</span>
          </Link>
          <ul
            className={`sidebar-dropdown-menu ${
              isReportDropdownOpen && isSubDropdownOpen ? "d-block" : ""
            }`}
            id="ecommerceDropdown"
          >
            {/* <li className="sidebar-dropdown-item">
              <NavLink to="/addNewProduct" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Add Product
              </NavLink>
            </li> */}

            <li className="sidebar-dropdown-item">
              <NavLink
                to="/sales"
                className="sidebar-link"
                onClick={handleSubNavLinkClick}
              >
                Total Sales
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink
                to="/customerpayment"
                className="sidebar-link"
                onClick={handleSubNavLinkClick}
              >
                All Customer Payment
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink
                to="/customeramount"
                className="sidebar-link"
                onClick={handleSubNavLinkClick}
              >
                All Customer Amount
              </NavLink>
            </li>

            {/* <li className="sidebar-dropdown-item">
              <NavLink to="/allreview" className="sidebar-link" onClick={handleSubNavLinkClick}>
                All Reviews
              </NavLink>
            </li> */}
          </ul>
        </li>

        <li className="sidebar-dropdown-item">
          <Link
            role="button"
            className={`sidebar-link has-sub ${
              isWarehouseDropdownOpen ? "show" : ""
            }`}
            onClick={toggleWarehouseDropdown}
          >
            <span className="nav-icon">
              <i className="fa-light fa-warehouse" title="Warehouse"></i>
            </span>{" "}
            <span className="sidebar-txt">Warehouse</span>
          </Link>
          <ul
            className={`sidebar-dropdown-menu ${
              isWarehouseDropdownOpen && isSubDropdownOpen ? "d-block" : ""
            }`}
            id="ecommerceDropdown"
          >
            <li className="sidebar-dropdown-item">
              <NavLink
                to="/warehouse"
                className="sidebar-link"
                onClick={handleSubNavLinkClick}
              >
                Warehouse
              </NavLink>
            </li>

            {/* <li className="sidebar-dropdown-item">
              <NavLink to="/allreview" className="sidebar-link" onClick={handleSubNavLinkClick}>
                All Reviews
              </NavLink>
            </li> */}
          </ul>
        </li>

        <li className="sidebar-dropdown-item">
          <Link
            role="button"
            className={`sidebar-link has-sub ${
              isCrmDropdownOpen ? "show" : ""
            }`}
            onClick={toggleCrmDropdown}
          >
            <span className="nav-icon">
              <i className="fa-light fa-user-headset"></i>
            </span>{" "}
            <span className="sidebar-txt">Administraction</span>
          </Link>
          <ul
            className={`sidebar-dropdown-menu ${
              isCrmDropdownOpen && isSubDropdownOpen ? "d-block" : ""
            }`}
            id="crmDropdown"
          >
            <li className="sidebar-dropdown-item">
              <NavLink
                to="/allEmployee"
                className="sidebar-link"
                onClick={handleSubNavLinkClick}
              >
                Employees
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink
                to="/stocklist"
                className="sidebar-link"
                onClick={handleSubNavLinkClick}
              >
                Route Assign for Delivery Boy
              </NavLink>
            </li>

            {/* <li className="sidebar-dropdown-item">
              <NavLink to="/salesorders" className="sidebar-link" onClick={handleSubNavLinkClick}>
               Order product
              </NavLink>
            </li> */}
            {/* <li className="sidebar-dropdown-item">
              <NavLink to="/taskmanagement" className="sidebar-link" onClick={handleSubNavLinkClick}>
               Task Management
              </NavLink>
            </li> */}
          </ul>
        </li>

        <li className="sidebar-dropdown-item">
          <Link
            role="button"
            className={`sidebar-link has-sub ${
              isEcommerceDropdownOpen ? "show" : ""
            }`}
            onClick={toggleEcommerceDropdown}
          >
            <span className="nav-icon">
              <i className="fa-light fa-box" title="Products"></i>
            </span>{" "}
            <span className="sidebar-txt">Products</span>
          </Link>
          <ul
            className={`sidebar-dropdown-menu ${
              isEcommerceDropdownOpen && isSubDropdownOpen ? "d-block" : ""
            }`}
            id="ecommerceDropdown"
          >
            {/* <li className="sidebar-dropdown-item">
              <NavLink to="/addNewProduct" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Add Product
              </NavLink>
            </li> */}
            <li className="sidebar-dropdown-item">
              <NavLink
                to="/allProduct"
                className="sidebar-link"
                onClick={handleSubNavLinkClick}
              >
                All Product
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink
                to="/category"
                className="sidebar-link"
                onClick={handleSubNavLinkClick}
              >
                Category
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink
                to="/productassign"
                className="sidebar-link"
                onClick={handleSubNavLinkClick}
              >
                Assign Product <br />
                for Routes
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink
                to="/routeProduct"
                className="sidebar-link"
                onClick={handleSubNavLinkClick}
              >
                Route Based
                <br />
                Product Lists
              </NavLink>
            </li>

            <li className="sidebar-dropdown-item">
              <NavLink
                to="/banner"
                className="sidebar-link"
                onClick={handleSubNavLinkClick}
              >
                Banner
              </NavLink>
            </li>

            {/* <li className="sidebar-dropdown-item">
              <NavLink to="/allreview" className="sidebar-link" onClick={handleSubNavLinkClick}>
                All Reviews
              </NavLink>
            </li> */}
          </ul>
        </li>

        <li className="sidebar-dropdown-item">
          <Link
            role="button"
            className={`sidebar-link has-sub ${
              isRewardDropdownOpen ? "show" : ""
            }`}
            onClick={toggleRewardDropdown}
          >
            <span className="nav-icon">
              <i className="fa-light fa-medal" title="Reward"></i>
            </span>{" "}
            <span className="sidebar-txt">Rewards</span>
          </Link>
          <ul
            className={`sidebar-dropdown-menu ${
              isRewardDropdownOpen && isSubDropdownOpen ? "d-block" : ""
            }`}
            id="crmDropdown"
          >
            <li className="sidebar-dropdown-item">
              <NavLink
                to="/rewarditem"
                className="sidebar-link"
                onClick={handleSubNavLinkClick}
              >
                Reward Items
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink
                to="/rewardredeam"
                className="sidebar-link"
                onClick={handleSubNavLinkClick}
              >
                Reward redeam
              </NavLink>
            </li>

            {/* <li className="sidebar-dropdown-item">
              <NavLink to="/taskmanagement" className="sidebar-link" onClick={handleSubNavLinkClick}>
               Task Management
              </NavLink>
            </li> */}
          </ul>
        </li>

        {/* <li className="sidebar-dropdown-item">
          <Link
            role="button"
            className={`sidebar-link has-sub ${isAccountsDropdownOpen ? 'show' : ''}`}
            onClick={toggleAccountsDropdown}
          >
            <span className="nav-icon">
              <i className="fa-light fa-user-tie"></i>
            </span>{' '}
            <span className="sidebar-txt">Accounts</span>
          </Link>
          <ul
            className={`sidebar-dropdown-menu ${
              isAccountsDropdownOpen && isSubDropdownOpen ? 'd-block' : ''
            }`}
            id="accountsDropdown"
          >
          <li className="sidebar-dropdown-item">
            <NavLink to="/leads" className="sidebar-link" onClick={handleSubNavLinkClick}>
              Leads
            </NavLink>
          </li>
          </ul>
        </li> */}

        {/* <li className="sidebar-dropdown-item">
            <NavLink to="/task" className="sidebar-link" onClick={handleSubNavLinkClick}>
              Task
            </NavLink>
          </li> */}

        {/* <li className="sidebar-dropdown-item">
          <NavLink to="/task" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-calendar"></i>
            </span>{' '}
            <span className="sidebar-txt">Task</span>
          </NavLink>
        </li> */}
        <li className="sidebar-dropdown-item">
          <NavLink to="/calendar" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-calendar"></i>
            </span>{" "}
            <span className="sidebar-txt">Calendar</span>
          </NavLink>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink to="/taskmanagement" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-tasks"></i>
            </span>{" "}
            <span className="sidebar-txt">Task Management</span>
          </NavLink>
        </li>
        {/* <li className="sidebar-dropdown-item">
          <NavLink to="/chat" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-messages"></i>
            </span>{' '}
            <span className="sidebar-txt">Chat</span>
          </NavLink>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink to="/email" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-envelope"></i>
            </span>{' '}
            <span className="sidebar-txt">Email</span>
          </NavLink>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink to="/invoices" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-file-invoice"></i>
            </span>{' '}
            <span className="sidebar-txt">Invoices</span>
          </NavLink>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink to="/contacts" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-user-plus"></i>
            </span>{' '}
            <span className="sidebar-txt">Contacts</span>
          </NavLink>
        </li> */}
      </ul>
    </li>
  );
};

export default AppsPart;
