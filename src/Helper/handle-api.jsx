
import axios from "axios";
import Swal from "sweetalert2";

// export const  URL = `http://localhost:3001`;
export const  URL = `https://api.palkkaran.in`;
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

export const BottleSummary = async () => {
  const response = await axios.get(`${URL}/orderdetails/bottles-summary/allcustomer`);
  return response.data;
}
export const updateReturnedBottles = async (customerId, returnedBottles) => {
  const response = await fetch(`${URL}/orderdetails/orders/${customerId}/returned-bottles`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ returnedBottles }),
  });
  return response.json();
};

export const FetchCustomerById = async (id) => {
    const response = await axios.get(`${URL}/customer/${id}`);
    return response.data;
};

//delete customer by Id
export const deleteCustomer = async (id) => {
  const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
      try {
          const response = await axios.delete(`${URL}/customer/${id}`);
          Swal.fire("Deleted!", "Customer has been deleted.", "success");
          return response.data;
      } catch (error) {
          Swal.fire("Error!", "Failed to delete customer.", "error");
      }
  }
};


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


export const fetchAllOrders = async () => {
    const response = await axios.get(`${URL}/orderdetails`);
    return response.data;
}
//delete order by Id
export const deleteOrder = async (id) => {
    const response = await axios.delete(`${URL}/orderdetails/${id}`);
    return response.data;
}
//fetch all review
export const fetchAllReview = async () => {
    const response = await axios.get(`${URL}/review`);
    return response.data;
}

//delete review by Id
export const deleteReview = async (id) => {
    const response = await axios.delete(`${URL}/review/${id}`);
    return response.data;
}
//fetch routes
export const fetchRoutes = async () => {
    const response = await axios.get(`${URL}/route`);
    return response.data;
}
export const fetchRoutes1 = async () => {
  try {
      const response = await axios.get(`${URL}/route`);
      return response.data;
  } catch (error) {
      console.error("Error fetching routes:", error);
      return [];
  }
};
export const FetchallOrders1 = async () => {
  try {
      const response = await axios.get(`${URL}/orderdetails`);
      return response.data;
  } catch (error) {
      console.error("Error fetching routes:", error);
      return [];
  }
}

export const confirmCustomer = async (customerId) => {
    const response = await axios.get(`${URL}/customer/confirm/${customerId}`);
    return response.data;
  };

  export const assignRoute = async (adminId, route) => {
    try {
        const response = await axios.put(`${API_URL}/admin/assign-route/${adminId}`, { route });
        return response.data;
    } catch (error) {
        console.error("Error assigning route:", error);
        return null;
    }
};

export const getAllRoutes = async () => {
    try {
        const response = await axios.get(`${URL}/route`);
        return response.data;
    } catch (error) {
        console.error("Error fetching routes:", error);
        return [];
    }
};

//delete route by id
export const deleteRoute = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this Route!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
});

if (result.isConfirmed) {
    const response = await axios.delete(`${URL}/route/${id}`);
    return response.data;
}
}

// delete product by id
export const deleteRouteId = async (id, productId) => {
  console.log(id, "id");
  
  const response = await axios.delete(`${URL}/route/${id}/products/${productId}`);
    return response.data;
}


//get details by route name
export const getDetailsByRouteName = async (routeName) => {
    const response = await axios.get(`${URL}/route/name/${routeName}`);
    return response.data;
}

//get plans by customer id
export const getPlansByCustomerId = async (customerId) => {
    const response = await axios.get(`${URL}/plan/customer/${customerId}`);
    return response.data;
}

export const createPlan = async (planData) => {
    const response = await fetch(`${URL}/plan`, {
      method: "POST",
      body: JSON.stringify(planData),
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  };
  
  export const createOrder = async (orderData) => {
    const response = await fetch(`${URL}/orderdetails`, {
      method: "POST",
      body: JSON.stringify(orderData),
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  };

  export const fetchBanner = async () => {
    const response = await axios.get(`${URL}/banner`);
    return response.data;
  }

  export const deleteBanner = async (id) => {
    const response = await axios.delete(`${URL}/banner/${id}`);
    return response.data;
  }

  export const updateBanner = async (id, updatedData) => {
    const response = await axios.put(`${URL}/banner/${id}`, updatedData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};


  export const createBanner = async (formData) => {
    const response = await axios.post(`${URL}/banner`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };
  