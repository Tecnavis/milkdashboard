
import axios from "axios";
import Swal from "sweetalert2";

export const  URL = `http://localhost:3001`;

//signup admin
export const signupAdmin = async (admin) => {
    const response = await axios.post(`${URL}/admin`, admin);
    return response.data;
};
export const loginAdmin = async (admin) => {
    const response = await axios.post(`${URL}/admin/login`, admin);
    return response.data;
};

export const fetchLogo = async () => {
  try {
    const response = await axios.get(`${URL}/logo`);
    return response.data;
  } catch (error) {
    console.error("Error fetching logo:", error);
  }
};

export const Customercreate = async (customer) => {
    const response = await axios.post(`${URL}/customer`, customer, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};


export const FetchCustomer = async () => {
    const response = await axios.get(`${URL}/customer`);
    return response.data;
};

export const FetchCustomerById = async (id) => {
    const response = await axios.get(`${URL}/customer/${id}`);
    return response.data;
};

//delete customer by Id
export const deleteCustomer = async (id) => {
    const response = await axios.delete(`${URL}/customer/${id}`);
    return response.data;
}

export const updateCustomer = async (id, updatedData) => {
    const response = await axios.put(`${URL}/customer/${id}`, updatedData);
    return response.data.updatedCustomer;
  };