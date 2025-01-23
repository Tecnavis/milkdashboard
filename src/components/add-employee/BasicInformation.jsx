import React, { useState } from 'react'
import { useForm } from '../../Helper/useForm';
import {Customercreate} from '../../Helper/handle-api';
import Swal from 'sweetalert2';
const BasicInformation = () => {

    const [values,handleChange] = useForm({
        name: '',   
        password: '',
        phone: '',
        location: '',
        address: '',
        routeno: '',
        email: '',
        routename: '',
    });
const [image, setImage] = useState('');
    const handleImage = (e) => {
        setImage(e.target.files[0]);
    };
    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("password", values.password);
        formData.append("phone", values.phone);
        formData.append("location", values.location);
        formData.append("address", values.address);
        formData.append("routeno", values.routeno);
        formData.append("email", values.email);
        formData.append("routename", values.routename);
        formData.append("image", image);
    
        try {
            const response = await Customercreate(formData);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Customer created successfully!',
            });
        } catch (error) {
            if (error.response?.status === 400) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response.data.message || 'Phone number already exists.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Unexpected Error',
                    text: 'Phone number already exists',
                });
            }
        }
    };
    
    
  return (
    <div className="col-12">
        <div className="panel">
            <div className="panel-header">
                <h5>Customer Create</h5>
            </div>
            <div className="panel-body">
                <div className="row g-3">
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                        <label className="form-label">Image</label>
                        <input type="file" className="form-control form-control-sm" onChange={handleImage} accept='image/*'/>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                        <label className="form-label">Full Name</label>
                        <input type="text" className="form-control form-control-sm" placeholder="Name" name='name' value={values.name} onChange={handleChange}/>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                        <label className="form-label">Phone</label>
                        <input type="tel" className="form-control form-control-sm" placeholder="Phone" name='phone' value={values.phone} onChange={handleChange}/>
                    </div>
                    
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                        <label className="form-label">Location</label>
                        <input type="text" className="form-control form-control-sm" placeholder="Location" name='location' value={values.location} onChange={handleChange}/>
                    </div>
                    
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                        <label className="form-label">Address</label>
                        <input type="text" className="form-control form-control-sm" placeholder="Address" name='address' value={values.address} onChange={handleChange}/>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                        <label className="form-label">Route No</label>
                        <input type="text" className="form-control form-control-sm" placeholder='Route No' name='routeno' value={values.routeno} onChange={handleChange}/>
                    </div>
                   <div className='col-xxl-3 col-lg-4 col-sm-6'>
                        <label className='form-label'>Email </label>
                        <input type='email' className='form-control form-control-sm' placeholder='Email' name='email' value={values.email} onChange={handleChange}/>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                        <label className="form-label">Route Name</label>
                        <input type="text" className="form-control form-control-sm" placeholder='Route Name' name='routename' value={values.routename} onChange={handleChange}/>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control form-control-sm" placeholder='Password' name='password' value={values.password} onChange={handleChange}/>
                    </div>
                    <div className="col-12">
    <button
        className="btn btn-sm btn-primary"
        onClick={() => handleSubmit()}
    >
        Save
    </button>
</div>

                </div>
            </div>
        </div>
    </div>
  )
}

export default BasicInformation