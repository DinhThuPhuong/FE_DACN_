import axios from 'axios'
const URL_API = "http://localhost:8080"


// Thêm Interceptor vào Axios để tự động thêm token vào header Authorization
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        if (token) {
            // Thêm token vào header nếu có
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const signUpAPI = async (accountData) => {
    const res = await axios.post(`${URL_API}/api/accounts/create`, accountData)
    return res.data
}



//Login
export const loginAPI = async (accountData) => {
    try {
        // Kiểm tra dữ liệu trước khi gửi
        if (!accountData || typeof accountData !== 'object') {
            throw new Error("Invalid accountData format. It must be an object.");
        }
        if (!accountData.email || !accountData.password) {
            throw new Error("Missing required fields: username and password.");
        }

        // console.log("Data to be sent to API:", accountData); // Log dữ liệu để kiểm tra
        const res = await axios.post(`${URL_API}/api/login`, accountData);
        // console.log("Response from API:", res.data); // Log dữ liệu trả về
        return res.data;
    } catch (error) {
        console.error("Error during API call:", error); // Log lỗi
        throw error.response?.data || "Login failed";
    }
};

// Profile company
export const getProfile = async () => {
    try {
        // const token = localStorage.getItem("token"); // Lấy token từ localStorage
        const response = await axios.get('http://localhost:8080/api/account/myiInfo')
        //     headers: {
        //         Authorization: `Bearer ${token}`, // Gửi token trong Authorization header
        //     },

        // });
        return response.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
};
export const addCompanyInfo = async (companyId, companyRequest, file) => {
    try {
        const formData = new FormData();
        formData.append("companyRequest", JSON.stringify(companyRequest)); // Thêm dữ liệu JSON vào formData
        if (file) {
            formData.append("file", file); // Thêm file vào formData nếu có
        }

        const response = await axios.put(`http://localhost:8080/api/companies/addInfo/${companyId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Chỉ định header cho multipart
            },
        });

        return response.data; // Trả về dữ liệu phản hồi từ backend
    } catch (error) {
        console.error('Error updating company info:', error);
        throw error; // Ném lỗi nếu có lỗi xảy ra
    }
};

// Ham cap nhat thong tin cong ty

// Hàm gọi API để xóa bài tuyển dụng
export const deleteJobPosting = async (id) => {
    try {
        const response = await axios.post(`${URL_API}/jobPosting/company/delete/${id}`);
        return response.data; // API trả về giá trị boolean
    } catch (error) {
        console.error("Error deleting job posting:", error);
        throw error; // Ném lỗi để xử lý ở nơi sử dụng
    }
};

// Hàm yêu cầu OTP từ backend
export const otpRequest = async (accountId, phoneNumber) => {
    try {
        const response = await axios.post(`${URL_API}/api/otp/send-otp`, {
            accountId: accountId,
            phoneNumber: phoneNumber,
        });
        return response.data; // Dữ liệu trả về từ backend
    } catch (error) {
        console.error("Error requesting OTP:", error);
        throw error; // Đảm bảo rằng lỗi được ném ra để xử lý sau
    }
};
// Hàm validate OTP từ backend
export const validateOtp = async (accountId, otpNumber) => {
    try {
        const response = await axios.post(`${URL_API}/api/otp/validate-otp`, {
            accountId: accountId,
            otpNumber: otpNumber,
        });
        return response.data; // Dữ liệu trả về từ backend
    } catch (error) {
        console.error("Error validating OTP:", error);
        throw error; // Đảm bảo lỗi được ném ra để xử lý sau
    }
};

// Hàm thêm bài tuyển dụng
export const addJobPosting = async (jobPostingData) => {
    try {
        const response = await axios.post(`${URL_API}/api/jobPosting/add`, jobPostingData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log("Dữ liệu trả về từ API:", response.data);  // In dữ liệu trả về
        return response.data; // Trả về dữ liệu nhận được từ API (JobPostingResponse)
    } catch (error) {
        console.error("Error adding job posting:", error);
        throw error; // Ném lỗi để có thể xử lý ở frontend
    }
};

export const updateCompanyInfo = async (companyId, companyRequest, file) => {
    try {
        const formData = new FormData();
        formData.append("companyRequest", JSON.stringify(companyRequest)); // Thêm dữ liệu JSON vào formData
        if (file) {
            formData.append("file", file); // Thêm file vào formData nếu có
        }

        const response = await axios.put(`http://localhost:8080/api/companies/update/${companyId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Chỉ định header cho multipart
            },
        });

        return response.data; // Trả về dữ liệu phản hồi từ backend
    } catch (error) {
        console.error('Error updating company info:', error);
        throw error; // Ném lỗi nếu có lỗi xảy ra
    }
};

//Truy van tat ca cong ty chinh 
export const getAllMainCompanies = async () => {
    try {
        const response = await axios.get(`${URL_API}/api/companies/allMainCompany`);
        return response.data;  // Trả về dữ liệu trả về từ API
    } catch (error) {
        console.error("Error fetching main companies:", error);
        throw error;
    }
};

// Truy vấn tất cả yêu cầu xác thực từ các công ty con
export const getAllBranchRequests = async (mainCompanyId) => {
    try {
        const response = await axios.get(`${URL_API}/api/company/${mainCompanyId}/branch-requests`);
        return response.data;  // Trả về dữ liệu trả về từ API
    } catch (error) {
        console.error("Error fetching branch requests:", error);
        throw error;
    }
};

// Tạo yêu cầu chi nhánh mới
export const createBranchRequest = async (branchRequest) => {
    try {
        const response = await axios.post(`${URL_API}/api/company/createRequest`, branchRequest);
        return response.data; // Trả về dữ liệu trả về từ API
    } catch (error) {
        console.error("Error creating branch request:", error);
        throw error; // Ném lỗi để xử lý phía trên nếu cần
    }
};

// Phê duyệt yêu cầu chi nhánh
export const approveBranchRequest = async (requestId) => {
    try {
        const response = await axios.post(`${URL_API}/api/branch-requests/${requestId}/approve`);
        return response.data; // Trả về dữ liệu trả về từ API
    } catch (error) {
        console.error("Error approving branch request:", error);
        throw error; // Ném lỗi để xử lý phía trên nếu cần
    }
};

// Từ chối yêu cầu chi nhánh với lý do từ chối
export const rejectBranchRequest = async (requestId, reason) => {
    try {
        const response = await axios.post(`${URL_API}/api/branch-requests/${requestId}/reject`, null, {
            params: { reason } // Truyền lý do từ chối qua query params
        });
        return response.data; // Trả về dữ liệu trả về từ API
    } catch (error) {
        console.error("Error rejecting branch request:", error);
        throw error; // Ném lỗi để xử lý phía trên nếu cần
    }
};





export const getJobPosting = async () => {
    try {
        // const token = localStorage.getItem("token"); // Lấy token từ localStorage
        const response = await axios.get('http://localhost:8080/api/jobPosting/company/getAll');
        // headers: {
        //     Authorization: `Bearer ${token}`, // Gửi token trong Authorization header
        // },

        // });
        return response.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
};

// Kiểm tra CV có còn liên kết với bài tuyển dụng không
export const checkCVOffJobPosting = async (id) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/checkCV/${id}`);
        return response.data; // true or false
    } catch (error) {
        console.error(`Error checking CV for job posting with ID ${id}:`, error);
        throw error;
    }
};
//Update bài tuyển dụng
export const updateJobPosting = async (id, jobPostingRequest) => {
    try {
        const response = await axios.put(`http://localhost:8080/api/jobPosting/update/${id}`, jobPostingRequest);
        return response.data; // Dữ liệu trả về từ API
    } catch (error) {
        console.error(`Error updating job posting with ID ${id}:`, error);
        throw error;
    }
};
// Lấy bài tuyển dụng theo ID
export const getJobPostingById = async (id) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/jobPosting/${id}`);
        console.log("ID being fetched:", id);


        return response.data; // Dữ liệu trả về từ API
    } catch (error) {
        console.error(`Error fetching job posting with ID ${id}:`, error);
        throw error;
    }
};
// Lấy bài tuyển dụng theo ID
export const getCompanyById = async (id) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/companies/${id}`);
        console.log("ID being fetched:", id);


        return response.data; // Dữ liệu trả về từ API
    } catch (error) {
        console.error(`Error fetching job posting with ID ${id}:`, error);
        throw error;
    }
};
// Đăng xuất
export const logout = async () => {
    try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage

        if (!token) {

            throw new Error("Token not found");
        }


        const response = await axios.post(
            "http://localhost:8080/api/logout", // URL đăng xuất của backend
            { token: token }, // Gửi token trong body của request
            {
                headers: {
                    "Content-Type": "application/json", // Chỉ định kiểu dữ liệu JSON
                },
            }
        );

        return response.data; // Trả về phản hồi từ backend
    } catch (error) {
        console.error("Error during logout:", error);
        throw error; // Đẩy lỗi nếu có vấn đề xảy ra
    }
};



//truy van bai tuyen dung hot trong tuan
// Job Postings - Truy vấn các bài tuyển dụng hot trong tuần
export const fetchHotJobPostingsWeeklyAPI = async () => {
    try {
        const res = await axios.get(`${URL_API}/api/jobPosting/hot`);
        return res.data;
    } catch (error) {
        console.error("Error fetching hot job postings:", error);
        throw error.response?.data || "Error fetching hot job postings.";
    }
};

// truy vấn company hot trong tuan
export const fetchHotCompanysWeeklyAPI = async () => {
    try {
        const res = await axios.get(`${URL_API}/api/companies/hot`);
        console.log("Fetched hot companies data:", res.data); // Kiểm tra cấu trúc của dữ liệu trả về
        return res.data;
    } catch (error) {
        console.error("Error fetching hot companies:", error);
        throw error.response?.data || "Error fetching hot companies.";
    }
};


//lay user hien tai

export const fetchUserInfoAPI = async () => {
    try {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage

        // console.log(token); // Log lỗi
        if (!token) {
            throw new Error("No token found! User is not authenticated.");
        }


        const res = await axios.get(`${URL_API}/api/account/myiInfo`, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi Bearer Token trong headers
            },
        });

        console.log(res.data)

        return res.data; // Trả về thông tin người dùng
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
    }
};

//log out
export const logOut = async () => {
    try {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage
        console.log(token); // Log lỗi
        if (!token) {
            throw new Error("No token found! User is not authenticated.");
        }
        const res = await axios.post(`${URL_API}/api/logout`,
            { token: token }, // Gửi token qua body
            { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log(token)

        console.log(res.data)
    } catch (error) {
        console.error("Error logOut:", error);
        throw error;
    }
};

// export const fetchUserInfoAPI = async (userId) => {
//     const res = await axios.get(`${URL_API}/api/accounts/${userId}`)
//     return res.data
// }
export const updateUserAPI = async (userId, updatedUser) => {
    const res = await axios.put(`${URL_API}/api/accounts/${userId}`, updatedUser)
    return res.data
}
export const validatePasswordAPI = async ({ id, oldPassword }) => {
    const res = await axios.post(`${URL_API}/api/accounts/validate-password?id=${id}&oldPassword=${oldPassword}`);
    return res.data;
};
//locations
export const fetchAllLocations = async () => {
    const res = await axios.post(`${URL_API}/api/Location`)
    return res.data
}
//Categories
export const fetchAllCategories = async () => {
    const res = await axios.get(`${URL_API}/api/Categories`)
    return res.data
}
//Hotels
export const fetchAllProducts = async () => {
    const res = await axios.get(`${URL_API}/api/Product`)
    return res.data
}

export const fetchOneProducts = async (ProductId) => {
    const res = await axios.get(`${URL_API}/api/Product/${ProductId}`)
    return res.data
}