
import axios from "axios";
import Swal from "sweetalert2";

export const  URL = `http://localhost:3001`;
// export const  URL = `https://api.palkkaran.in`;
//create product
export const createProduct = async (product) => {
    const response = await axios.post(`${URL}/product`, product);
    return response.data;
}
//fetch product by id

export const fetchProductById = async (id) => {
    const response = await axios.get(`${URL}/product/${id}`);
    return response.data;
}
//fetch all products
export const fetchProducts = async () => {
    const response = await axios.get(`${URL}/product`);
    return response.data;
}
//signup admin
export const signupAdmin = async (admin) => {
    const response = await axios.post(`${URL}/admin`, admin);
    return response.data;
};
export const loginAdmin = async (admin) => {
    const response = await axios.post(`${URL}/admin/login`, admin);
    return response.data;
};
export const fetchAdmins= async () => {
    const response = await axios.get(`${URL}/admin`);
    return response.data;
}
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

  //create warehouse
  export const createWarehouse = async (warehouse) => {
    const response = await axios.post(`${URL}/warehouse`, warehouse);
    return response.data;
  };

  //fetch All Warehouse
  export const fetchAllWarehouse = async () => {
    const response = await axios.get(`${URL}/warehouse`);
    return response.data;
  };

  //delete warehouse by Id
  export const deleteWarehouse = async (id) => {
    const response = await axios.delete(`${URL}/warehouse/${id}`);
    return response.data;
  };


  export const updateWarehouse = async (id, details) => {
    const response = await axios.put(`${URL}/warehouse/${id}`, details);
    return response.data;
  };
  
  //create main category
export const createMainCategory = async (category) => {
    const response = await axios.post(`${URL}/category`, category);
    return response.data;
};

export const fetchMainCategory = async () => {
    const response = await axios.get(`${URL}/category`);
    return response.data;
};
