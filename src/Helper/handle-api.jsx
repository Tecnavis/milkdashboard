
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
