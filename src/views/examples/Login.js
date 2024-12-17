import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate từ react-router-dom
import { loginAPI } from "../../components/API/apiService"; // Import loginAPI từ apiService

const Login = () => {
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault(); // Ngừng hành vi mặc định của form

    setLoading(true); // Đặt trạng thái loading khi bắt đầu đăng nhập
    setError(""); // Reset lỗi

    try {
      // Gọi API đăng nhập
      const accountData = { email, password };
      const response = await loginAPI(accountData);

      // Lưu token hoặc dữ liệu từ phản hồi vào localStorage hoặc state
      localStorage.setItem("token", response.token);
      localStorage.setItem("accountId", response.accountId);
      // localStorage.setItem("companyId", response.company.id);
      // localStorage.setItem("companyId", response.company.id);
      // localStorage.setItem("phoneVerified", response.company.phoneVerified);
      // localStorage.setItem("companyVerified", response.company.companyVerified);

      // Điều hướng người dùng tới trang dashboard hoặc trang chính sau khi đăng nhập thành công
      navigate("/dashboard"); // Ví dụ: điều hướng đến trang Dashboard
    } catch (err) {
      setError(err.message || "Đăng nhập không thành công. Vui lòng thử lại.");
    } finally {
      setLoading(false); // Đặt trạng thái loading là false sau khi hoàn thành
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-header text-center">
              <h3>Đăng nhập</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="text"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Nhập email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Mật khẩu:</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Nhập mật khẩu"
                  />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
