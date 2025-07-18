import { BrowserRouter as Router,Routes,Route} from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import CrmDashboard from "./pages/CrmDashboard"
import HrmDashboard from "./pages/HrmDashboard"
import Return from "./pages/ReturnProduct"
import Company from "./pages/Supplier"
import Task from "./pages/Task"
import Leads from "./pages/Leads"
import Customer from "./pages/purchaseditems"
import AddEmployee from "./pages/AddEmployee"
import AllEmployee from "./pages/AllEmployee"
import Attendance from "./pages/Attendance"
import AllCustomer from "./pages/AllCustomer"
import AddNewProduct from "./pages/AddNewProduct"
import AllProduct from "./pages/AllProduct"
import Category from "./pages/Category"
import Order from "./pages/Order"
import Chat from "./pages/Chat"
import Email from "./pages/Email"
import Calendar from "./pages/Calendar"
import Invoices from "./pages/Invoices"
import Contacts from "./pages/Contacts"
import Login from "./pages/Login"
import Login2 from "./pages/Login2"
import Registration from "./pages/Registration"
import Registration2 from "./pages/Registration2"
import ResetPassword from "./pages/ResetPassword"
import UpdatePassword from "./pages/UpdatePassword"
import LoginStatus from "./pages/LoginStatus"
import Profile from "./pages/Profile"
import EditProfile from "./pages/EditProfile"
// import Utility from "./pages/Utility"
import SweetAlert from "./pages/SweetAlert"
import NestableList from "./pages/NestableList"
import Animation from "./pages/Animation"
import SwiperSlider from "./pages/SwiperSlider"
import Form from "./pages/Form"
import Table from "./pages/Table"
import Charts from "./pages/Charts"
import Icon from "./pages/Icon"
import Map from "./pages/Map"
import FileManager from "./pages/FileManager"
import Layout from "./components/layout/Layout"
import Login3 from "./pages/Login3"
import Error400 from "./pages/Error400"
import Error403 from "./pages/Error403"
import Error404 from "./pages/Error404"
import Error408 from "./pages/Error408"
import Error500 from "./pages/Error500"
import Error503 from "./pages/Error503"
import Error504 from "./pages/Error504"
import ComingSoon from "./pages/ComingSoon"
import ComingSoon2 from "./pages/ComingSoon2"
import AllOrderDetails from "./components/tables/Allorderdetails"
// import PricingTable from "./pages/PricingTable"
import PricingTable2 from "./pages/PricingTable2"
import UnderConstruction from "./pages/UnderConstruction"
import AllReviewTable from "./components/tables/AllReviews"
import Banner from "./components/tables/banner"
import ProductAssign from "./pages/productassign"
//
import StockList from "./pages/Stocklist"
import Salesorders from "./pages/Salesorders"
import AllCustomerByRoutes from "./pages/AllcustomerByRoutes";
import Customerpayment from "./pages/customerpayment";
import CustomerpaymentAmount  from "./pages/customeramount";
import CustomerBottlestock from "./pages/customerbottlestock";
import Customerleaveapply from "./pages/customerleaveapply"
import RoutebasedIncome from "./pages/routebasedincome"
import Rewarditem from "./components/reward/Rewarditem"
import Rewardredeams from "./components/reward/Rewardredeams"
import CostemerCalender from "./pages/CostemerCalender"


function App() {
  
  return (
    <Router>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/inventorydashboard" element={<Dashboard/>}/>
          <Route path="/routebasedincome" element={<RoutebasedIncome/>}/>
          <Route path="/customerpayment" element={<Customerpayment/>}/>
          <Route path="/customeramount" element={<CustomerpaymentAmount/>}/>
          <Route path="/customeramount/:id" element={<CostemerCalender/>}/>
          <Route path="/leaveapply" element={<Customerleaveapply/>}/>
          <Route path="/customerbottlestock" element={<CustomerBottlestock/>}/>
          <Route path="/allCustomerByRoutes" element={<AllCustomerByRoutes/>}/>
          <Route path="/stocklist" element={<StockList/>}/>
          <Route path="/banner" element={<Banner/>}/>
          <Route path="/productassign" element={<ProductAssign/>}/>
          <Route path="/allReview" element={<AllReviewTable/>}/>
          <Route path="/salesorders" element={<Salesorders/>}/>
          <Route path="/fileManager" element={<FileManager/>}/>
          <Route path="/dashboard" element={<CrmDashboard/>}/>
          <Route path="/hrmDashboard" element={<HrmDashboard/>}/>
          <Route path="/routeProduct" element={<Return/>}/>
          <Route path="/warehouse" element={<Company/>}/>
          <Route path="/allorders" element={<AllOrderDetails/>}/>
          <Route path="/rewarditem" element={<Rewarditem />}/>    
          <Route path="/rewardredeam" element={<Rewardredeams />}/>    
          <Route path="/task" element={<Task/>}/>
          <Route path="/leads" element={<Leads/>}/>
          <Route path="/purchaseditem" element={<Customer/>}/>
          <Route path="/addEmployee" element={<AddEmployee/>}/>
          <Route path="/allEmployee" element={<AllEmployee/>}/>
          <Route path="/attendance" element={<Attendance/>}/>
          <Route path="/allCustomer" element={<AllCustomer/>}/>
          <Route path="/addNewProduct" element={<AddNewProduct/>}/>
          <Route path="/allProduct" element={<AllProduct/>}/>
          <Route path="/category" element={<Category/>}/>
          <Route path="/taskmanagement" element={<Order/>}/>
          <Route path="/chat" element={<Chat/>}/>
          <Route path="/calendar" element={<Calendar/>}/>
          <Route path="/email" element={<Email/>}/>
          <Route path="/invoices" element={<Invoices/>}/>
          <Route path="/contacts" element={<Contacts/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/editProfile" element={<EditProfile/>}/>
          {/* <Route path="/utility" element={<Utility/>}/> */}
          <Route path="/sweetAlert" element={<SweetAlert/>}/>
          <Route path="/nestableList" element={<NestableList/>}/>
          <Route path="/animation" element={<Animation/>}/>
          <Route path="/swiperSlider" element={<SwiperSlider/>}/>
          <Route path="/form" element={<Form/>}/>
          <Route path="/table" element={<Table/>}/>
          <Route path="/charts" element={<Charts/>}/>
          <Route path="/icon" element={<Icon/>}/>
          <Route path="/map" element={<Map/>}/>
        </Route>
        <Route path="/" element={<Login/>}/>
        <Route path="/login2" element={<Login2/>}/>
        <Route path="/login3" element={<Login3/>}/>
        <Route path="/registration" element={<Registration/>}/>
        <Route path="/registration2" element={<Registration2/>}/>
        <Route path="/resetPassword" element={<ResetPassword/>}/>
        <Route path="/updatePassword" element={<UpdatePassword/>}/>
        <Route path="/loginStatus" element={<LoginStatus/>}/>
        <Route path="/error400" element={<Error400/>}/>
        <Route path="/error403" element={<Error403/>}/>
        <Route path="/error404" element={<Error404/>}/>
        <Route path="/error408" element={<Error408/>}/>
        <Route path="/error500" element={<Error500/>}/>
        <Route path="/error503" element={<Error503/>}/>
        <Route path="/error504" element={<Error504/>}/>
        <Route path="/comingSoon" element={<ComingSoon/>}/>
        <Route path="/comingSoon2" element={<ComingSoon2/>}/>
        {/* <Route path="/pricingTable" element={<PricingTable/>}/> */}
        <Route path="/pricingTable2" element={<PricingTable2/>}/>
        <Route path="/underConstruction" element={<UnderConstruction/>}/>
        <Route path="*" element={<Error404/>}/>
      </Routes>
    </Router>
  )
}

export default App
