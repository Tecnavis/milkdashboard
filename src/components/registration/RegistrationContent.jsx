import React, { useContext } from 'react'
import Footer from '../footer/Footer'
import { Link } from 'react-router-dom'
import { DigiContext } from '../../context/DigiContext'

const RegistrationContent = () => {
    const {passwordVisible, togglePasswordVisibility} = useContext(DigiContext)
  return (
    <div className="main-content login-panel">
        <div className="login-body">
            <div className="top d-flex justify-content-between align-items-center">
                <div className="logo">
                    <img src="assets/images/logo-big.png" alt="Logo"/>
                </div>
                <Link to="/login"><i className="fa-duotone fa-sign-in"></i></Link>
            </div>
            <div className="bottom">
                <h3 className="panel-title">Registration</h3>
                <form>
                    <div className="input-group mb-30">
                        <span className="input-group-text"><i className="fa-regular fa-user"></i></span>
                        <input type="text" className="form-control" placeholder="Full Name"/>
                    </div>
                    <div className="input-group mb-30">
                        <span className="input-group-text"><i className="fa-regular fa-envelope"></i></span>
                        <input type="email" className="form-control" placeholder="Email"/>
                    </div>
                    <div className="input-group mb-30">
                        <span className="input-group-text"><i className="fa-regular fa-phone"></i></span>
                        <input type="tel" className="form-control" placeholder="Phone Number"/>
                    </div>
                    <div className="input-group mb-20">
                        <span className="input-group-text"><i className="fa-solid fa-id-card"></i></span>
                        <input type="number" placeholder='Id' className="form-control"/>
                    </div>
                    <div className="input-group mb-30">
                        <span className="input-group-text"><i className="fa-solid fa-user"></i></span>
                        <input type='text' className='form-control' placeholder="Role"/>
                    </div>
                    <div className="input-group mb-20">
                        <span className="input-group-text"><i className="fa-regular fa-lock"></i></span>
                        <input type={passwordVisible ? 'text' : 'password'}  className="form-control rounded-end" placeholder="Password"/>
                        <Link role="button" className="password-show" onClick={togglePasswordVisibility}><i className="fa-duotone fa-eye"></i></Link>
                    </div>
                    <button className="btn btn-primary w-100 login-btn">Sign up</button>
                    <br/>
                </form>
                <br/>
            </div>
        </div>

        <Footer/>
    </div>
  )
}

export default RegistrationContent