import Footer from '../components/footer/Footer'
import CustomerHeader from '../components/header/CustomerHeader'
import CustomerTableFilter from '../components/filter/CustomerTableFilter';
import ProductTable from '../components/tables/Productlisting';
const CustomerMainContent = () => {
  return (
    <div className="main-content">
        <div className="row">
            <div className="col-12">
                <div className="panel">
                    <CustomerHeader/>
                    <div className="panel-body">
                        <CustomerTableFilter/>
                        <ProductTable/>                    
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default CustomerMainContent